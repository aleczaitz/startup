const bcrypt = require('bcrypt');
const uuid = require('uuid');

const authCookieName = 'token';

// This will be kept in server RAM and be deleted once the server restarts
// const users = [];
// const friendships = [];
// const matches = [];

const DB = require('../database.js');


async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  } else if (field === 'userId') {
    return DB.getUserById(value);
  }
  return DB.getUserByEmail(value);
}

// create a user object and store it in the server RAM for now
async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
        userId: uuid.v4(),
        token: uuid.v4(),
    };
    await DB.createUser(user);
    return user;
}

// set the response cookie to store an auth token in the user's browser and store the token in the server RAM
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        maxAge: 1000 * 60 * 60, // How long the cookie lasts in the browser in ms
        secure: true, // only sent over https?
        httpOnly: true, // doesn't show up in js (document.cookie)
        sameSite: 'strict', // doesn't allow cross origin attacks
    });
}

async function findMatchById(matchId) {
  if (!matchId) return null;
  return await DB.getMatchById(matchId);
}

module.exports = { findUser, createUser, setAuthCookie, authCookieName, findMatchById };