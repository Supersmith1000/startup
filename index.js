const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// The users, scores, and games are stored in memory and will reset when the service restarts
let users = [];
let scores = [];
let games = [];

// Service port (defaults to 3000)
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use('/api', apiRouter);

//
// ---------- AUTHENTICATION ----------
//

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// Login existing user
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

// Logout user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Auth verification middleware
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

//
// ---------- SIMON-STYLE SCORE ENDPOINTS ----------
//

// Get all scores
apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

// Submit a new score
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

//
// ---------- WHO-1 GAME ENDPOINTS ----------
//

// Get all games
apiRouter.get('/games', verifyAuth, (_req, res) => {
  res.send(games);
});

// Add a new game
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

// Get a specific game by ID
apiRouter.get('/games/:id', verifyAuth, (req, res) => {
  const game = games.find(g => g.id == req.params.id);
  if (game) {
    res.send(game);
  } else {
    res.status(404).send({ msg: 'Game not found' });
  }
});

//
// ---------- HELPERS ----------
//

// Update top 10 scores (used for Simon logic)
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

// Create new user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);
  return user;
}

// Find a user by field (email or token)
async function findUser(field, value) {
  if (!value) return null;
  return users.find(u => u[field] === value);
}

// Set authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

//
// ---------- SERVER & ERROR HANDLING ----------
//

// Default error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Catch-all: serve frontend
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`WHO-1 service running on port ${port}`);
});
