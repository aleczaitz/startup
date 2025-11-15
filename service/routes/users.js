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
  try {
    const users = await DB.getUsers();       // should be an array
    return res.status(200).send(users || []); // always send an array
  } catch (err) {
    console.error('Error getting users:', err);
    return res.status(500).send({ msg: 'Error getting users' });
  }
});

module.exports = router;