const express = require('express');
const router = express.Router();
const { findUser } = require('../utils/helpers');
const { verifyAuth } = require('../utils/middleware');
const DB = require('../database.js');

/**
 * GET /api/users/:email
 * Body: {  }
 * Returns: { userId: string }
 */
router.get('/email/:email', verifyAuth, async (req, res) => {
  const user = await findUser('email', req.params.email);
  if (user) res.send({ userId: user.userId });
  else res.status(404).send({ msg: 'No user by that email' });
});

/**
 * GET /api/users/:userId
 * Body: {  }
 * Returns: { user }
 */
router.get('/id/:userId', verifyAuth, async (req, res) => {
  const user = await findUser('userId', req.params.userId);
  if (user) res.send({ user });
  else res.status(404).send({ msg: 'No user by that id' });
});

/**
 * GET /api/users
 * Body: {  }
 * Returns: { [{user}, {user}] }
 */
router.get('/', verifyAuth, async (req, res) => {
  const users = await DB.getUsers();
  if (users.length < 1) {
    return res.status(404).send([]);
  }
  res.send(users);
});

module.exports = router;