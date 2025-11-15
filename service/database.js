const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluseter
const client = new MongoClient(url);
const db = client.db('jorvo');

const userCollection = db.collection('user');
const friendshipCollection = db.collection('friendship');
const matchCollection = db.collection('match');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
});


// Users
function getUserByEmail(email) {
  return userCollection.findOne({ email: email });
}

function getUserById(email) {
  return userCollection.findOne({ id: id });
}

async function createUser(user) {
  await userCollection.insertOne(user);
}

// Friendships
function getFriendshipById(friendshipId) {
  return friendshipCollection({ friendshipId: friendshipId });
}

async function createFriendship(friendship) {
  await friendshipCollection.insertOne(friendship);
}

function getFriendshipsByUserId(userId) {
  const query = { $or: [
    { initiatorId: userId },
    { receiverId: userId }
  ]};
  const cursor = friendshipCollection.find(query);
  return cursor.toArray();
}

// Matches
function getMatchById(matchId) {
  return matchCollection.findOne({ matchId: matchId });
}

async function createMatch(match) {
  matchCollection.insertOne(match);
}

function getMatchesByUserId(userId) {
  const query = { $or: [
    { player1Id: userId },
    { player2Id: userId }
  ]};
  const cursor = matchCollection.find(query);
  return cursor.toArray();
}

async function updateMatch(match) {
  await matchCollection.updateOne({ matchId: match.matchId }, { $set: match})
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getFriendshipById,
  createFriendship,
  getFriendshipsByUserId,
  getMatchById,
  createMatch,
  getMatchesByUserId,
  updateMatch
}