const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');
const { getUser, getUserByToken, addUser, updateUser, addGame, getGamesByUser } =
  require('./service/database');

const app = express();

// Fallback fetch for older Node versions
if (typeof fetch === 'undefined') {
  global.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// ---------- Middleware ----------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://startup.who-1.com'],
    credentials: true,
  })
);

// Serve React build files
app.use(express.static(path.join(__dirname, '..', 'public')));

const apiRouter = express.Router();
app.use('/api', apiRouter);

// ---------- AUTH ROUTES ----------
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

// ---------- AUTH MIDDLEWARE ----------
const verifyAuth = async (req, res, next) => {
  const user = await getUserByToken(req.cookies[authCookieName]);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });

  req.user = user;
  next();
};

// ---------- GAME STORAGE ----------
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

// ---------- ESPN NBA LIVE DATA ROUTE ----------
apiRouter.get('/nba', async (req, res) => {
  try {
    // Get EST date
    const estNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    const format = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
        d.getDate()
      ).padStart(2, '0')}`;

    const today = new Date(estNow);
    const yesterday = new Date(estNow);
    yesterday.setDate(yesterday.getDate() - 1);

    const dates = [format(today), format(yesterday)];

    // Fetch both days from ESPN
    const fetchGames = async (date) => {
      const url = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/scoreboard?dates=${date}`;
      const response = await fetch(url);
      const json = await response.json();
      return json.events || [];
    };

    let eventUrls = [
      ...(await fetchGames(dates[0])),
      ...(await fetchGames(dates[1])),
    ];

    // remove duplicates
    eventUrls = [...new Set(eventUrls)];

    const games = await Promise.all(
      eventUrls.map(async (eventUrl) => {
        const eventResp = await fetch(eventUrl);
        const eventData = await eventResp.json();

        const compUrl = eventData.competitions[0];
        const compResp = await fetch(compUrl);
        const comp = await compResp.json();

        const home = comp.competitors.find((t) => t.homeAway === "home");
        const away = comp.competitors.find((t) => t.homeAway === "away");

        return {
          id: eventData.id,
          status: comp.status.type.shortDetail,
          state: comp.status.type.state, // "in", "post", "pre"
          home: {
            name: home.team.displayName,
            score: Number(home.score),
          },
          away: {
            name: away.team.displayName,
            score: Number(away.score),
          },
        };
      })
    );

    // Only return today's relevant games
    const filtered = games.filter((g) =>
      ["in", "pre"].includes(g.state)
    );

    res.json({ games: filtered });

  } catch (err) {
    console.error("NBA API error:", err);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});
