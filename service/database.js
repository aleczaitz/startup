const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluseter
const client = new MongoClient(url);
const db = client.db('jorvo');

const userCollection = db.collection('user');
const friendshipCollection = db.collection('friendship');


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

function getUserByEmail(email) {
  return userCollection.findOne({ email: email });
}

function getUserById(email) {
  return userCollection.findOne({ id: id });
}

async function createUser(user) {
  await userCollection.insertOne(user);
}

async function createFriendship(friendship) {
  await friendshipCollection.insertOne(friendship);
}