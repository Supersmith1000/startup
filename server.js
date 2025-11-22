const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');

const {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addGame,
  getGamesByUser,
} = require('./service/database');

const app = express();

if (typeof fetch === 'undefined') {
  global.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://startup.who-1.com'],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, '..', 'public')));


const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;

  const existing = await getUser(email);
  if (existing) {
    res.status(409).send({ msg: 'Existing user' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email,
    passwordHash,
    token: uuid.v4(),
  };

  await addUser(user);
  setAuthCookie(res, user.token);

  res.send({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await getUser(email);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

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


const verifyAuth = async (req, res, next) => {
  const user = await getUserByToken(req.cookies[authCookieName]);

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};



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

apiRouter.get('/nba', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `https://api.balldontlie.io/v1/games?dates[]=${today}`,
      {
        headers: {
          Authorization: 'Bearer 2873b959-b285-4125-a3a7-682509f51981',
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Failed to fetch NBA data' });
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];

      const fallback = await fetch(
        `https://api.balldontlie.io/v1/games?dates[]=${yesterday}`,
        {
          headers: {
            Authorization: 'Bearer 2873b959-b285-4125-a3a7-682509f51981',
          },
        }
      );

      return res.json(await fallback.json());
    }

    res.json(data);
  } catch (err) {
    console.error('NBA API error:', err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


app.listen(port, () => {
  console.log(`WHO-1 service backend running on port ${port}`);
});
