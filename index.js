const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const cors = require('cors');           // 👈 add this
const app = express();

// polyfill fetch...
if (typeof fetch === 'undefined') {
  global.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

// allow 5173 to talk to 3000
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://startup.who-1.com'],
    credentials: true,
  })
);
const authCookieName = 'token';
let users = [];
let scores = [];
let games = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;


// ====== Middleware ======
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// ====== API Router ======
const apiRouter = express.Router();
app.use('/api', apiRouter);

// ====== Authentication Routes ======
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// ====== Auth Middleware ======
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) next();
  else res.status(401).send({ msg: 'Unauthorized' });
};

// ====== WHO-1 Game Routes ======
apiRouter.get('/scores', verifyAuth, (_req, res) => res.send(scores));

apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

apiRouter.get('/games', verifyAuth, (_req, res) => res.send(games));

apiRouter.post('/games', verifyAuth, (req, res) => {
  const newGame = {
    id: games.length + 1,
    player: req.body.player,
    team: req.body.team,
    score: req.body.score,
    date: new Date(),
  };
  games.push(newGame);
  res.status(201).send(newGame);
});

apiRouter.get('/games/:id', verifyAuth, (req, res) => {
  const game = games.find((g) => g.id == req.params.id);
  if (game) res.send(game);
  else res.status(404).send({ msg: 'Game not found' });
});

// ====== NBA API Route (INSIDE /api router) ======
apiRouter.get('/nba', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Fetching NBA data for ${today}...`);

    const response = await global.fetch(
      `https://api.balldontlie.io/v1/games?dates[]=${today}`,
      {
        headers: {
          Authorization: 'Bearer 2873b959-b285-4125-a3a7-682509f51981',
        },
      }
    );

    if (!response.ok) {
      console.error('NBA API error:', response.status);
      return res
        .status(response.status)
        .json({ error: 'Failed to fetch from NBA API' });
    }

    const data = await response.json();

    // 🏀 Fallback: fetch yesterday’s games if none today
    if (!data.data || data.data.length === 0) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];
      console.log(`No games today — fetching ${yesterday} instead`);
      const response2 = await global.fetch(
        `https://api.balldontlie.io/v1/games?dates[]=${yesterday}`,
        {
          headers: {
            Authorization: '2873b959-b285-4125-a3a7-682509f51981',
          },
        }
      );
      const fallbackData = await response2.json();
      return res.json(fallbackData);
    }

    console.log('Fetched NBA data successfully ✅');
    res.json(data);
  } catch (err) {
    console.error('Error fetching NBA data:', err);
    res.status(500).json({ error: 'Failed to load NBA data' });
  }
});

// ====== Utility Functions ======
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }
  if (!found) scores.push(newScore);
  if (scores.length > 10) scores.length = 10;
  return scores;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// ====== Error Handling ======
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).send({ type: err.name, message: err.message });
});

// ====== Fallback Route (keep LAST) ======
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// ====== Start Server ======
app.listen(port, () => {
  console.log(`WHO-1 service running on port ${port}`);
});
