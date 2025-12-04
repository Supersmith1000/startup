// ------------------- IMPORTS -------------------
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addGame,
  getGamesByUser,
} = require('./service/database');

const app = express();

// Fallback fetch
if (typeof fetch === 'undefined') {
  global.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://startup.who-1.com'],
    credentials: true,
  })
);

// Serve React build
app.use(express.static(path.join(__dirname, '..', 'public')));

// ------------------- API ROUTER -------------------
const apiRouter = express.Router();
app.use('/api', apiRouter);

// ------------------- AUTH ROUTES -------------------
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  const existing = await getUser(email);
  if (existing) return res.status(409).send({ msg: 'Existing user' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, passwordHash, token: uuid.v4() };

  await addUser(user);
  setAuthCookie(res, user.token);

  res.send({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await getUser(email);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return res.status(401).send({ msg: 'Unauthorized' });

  user.token = uuid.v4();
  await updateUser(user);

  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await getUserByToken(req.cookies[authCookieName]);

  if (user) {
    user.token = '';
    await updateUser(user);
  }

  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ------------------- AUTH MIDDLEWARE -------------------
const verifyAuth = async (req, res, next) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });

  req.user = user;
  next();
};

// ------------------- GAMES API -------------------
apiRouter.get('/games', verifyAuth, async (req, res) => {
  const games = await getGamesByUser(req.user.email);
  res.send(games);
});

apiRouter.post('/games', verifyAuth, async (req, res) => {
  const game = {
    email: req.user.email,
    player: req.body.player,
    team: req.body.team,
    score: req.body.score,
    date: new Date(),
  };

  await addGame(game);
  res.status(201).send(game);
});

apiRouter.get('/games/:id', verifyAuth, async (req, res) => {
  const games = await getGamesByUser(req.user.email);
  const game = games.find((g) => g._id?.toString?.() === req.params.id);

  if (game) res.send(game);
  else res.status(404).send({ msg: 'Game not found' });
});

// ------------------- NBA LIVE ROUTE -------------------
apiRouter.get('/nba', async (req, res) => {
  try {
    const estNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
    );

    const y = estNow.getFullYear();
    const m = String(estNow.getMonth() + 1).padStart(2, '0');
    const d = String(estNow.getDate()).padStart(2, '0');
    const dateParam = `${y}${m}${d}`;

    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateParam}`;
    const response = await fetch(url);
    const json = await response.json();

    const games = (json?.events || []).map((event) => {
      const comp = event.competitions?.[0];
      const status = comp?.status?.type?.shortDetail ?? 'Unknown';
      const state = comp?.status?.type?.state ?? 'pre';

      const home = comp?.competitors?.find((t) => t.homeAway === 'home');
      const away = comp?.competitors?.find((t) => t.homeAway === 'away');

      return {
        id: event.id,
        status,
        state,
        home: { name: home?.team?.displayName ?? '', score: Number(home?.score ?? 0) },
        away: { name: away?.team?.displayName ?? '', score: Number(away?.score ?? 0) },
      };
    });

    res.json({ games });
  } catch (err) {
    console.error('NBA API error:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// ------------------- COOKIE -------------------
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// ------------------- CREATE HTTP SERVER -------------------
const server = http.createServer(app);

// ------------------- WEBSOCKETS -------------------
const wss = new WebSocket.Server({ noServer: true });

// Upgrade HTTP → WS
server.on('upgrade', (req, socket, head) => {
  if (!req.url.startsWith('/ws')) {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

// ------------------- WS CONNECTION -------------------
wss.on('connection', (ws, req) => {
  const fullUrl = new URL(req.url, "http://localhost");
  ws.gameId = fullUrl.searchParams.get("gameId");

  console.log(`WS client connected to game ${ws.gameId}`);

  ws.send(JSON.stringify({
    type: "connected",
    msg: "Welcome to WHO-1 WebSocket!",
    gameId: ws.gameId
  }));

  ws.on("message", raw => {
    let data;
    try { data = JSON.parse(raw.toString()); }
    catch { return; }

    if (data.type === "score_update") {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN &&
            client.gameId === ws.gameId) {
          client.send(JSON.stringify({
            type: "score_update",
            gameId: ws.gameId,
            team1: data.team1,
            team2: data.team2
          }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`WS client disconnected from game ${ws.gameId}`);
  });
});

// ------------------- FALLBACK ROUTING -------------------
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ------------------- START SERVER -------------------
server.listen(port, () =>
  console.log(`WHO-1 backend running with WebSocket on port ${port}`)
);
