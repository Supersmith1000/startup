const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority`;

const client = new MongoClient(url);

let db;
let userCollection;
let gameCollection;

async function connect() {
  try {
    await client.connect();
    db = client.db('who1');

    userCollection = db.collection('users');
    gameCollection = db.collection('games');

    console.log("Connected to MongoDB");
  } catch (ex) {
    console.error(`Unable to connect to database: ${ex.message}`);
    process.exit(1);
  }
}

connect();



function getUser(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function addUser(user) {
  return userCollection.insertOne(user);
}

async function updateUser(user) {
  return userCollection.updateOne({ email: user.email }, { $set: user });
}


async function addGame(game) {
  return gameCollection.insertOne(game);
}

function getGamesByUser(email) {
  return gameCollection.find({ email }).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  addGame,
  getGamesByUser,
};
