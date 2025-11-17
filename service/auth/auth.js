const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { getUser, getUserByToken, addUser, updateUser } = require('../database');

const router = express.Router();
const saltRounds = 10;

router.post('/create', async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await getUser(email);
  if (existingUser) {
    res.status(409).send({ msg: 'User already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);
  const token = uuid();

  const newUser = {
    email,
    passwordHash,
    token,
  };

  await addUser(newUser);

  res.send({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await getUser(email);
  if (!user) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    res.status(401).send({ msg: 'Unauthorized' });
    return;
  }

  user.token = uuid();
  await updateUser(user);

  res.send({ token: user.token });
});

router.post('/logout', async (req, res) => {
  const { token } = req.body;

  const user = await getUserByToken(token);
  if (user) {
    user.token = '';
    await updateUser(user);
  }

  res.send({ msg: 'Logged out' });
});

module.exports = router;
