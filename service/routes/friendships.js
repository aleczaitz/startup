const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { friendships, findUser } = require('../utils/helpers');
const { verifyAuth } = require('../utils/middleware');

// Temporary in-memory helper (if not already moved to helpers)
async function findFriendship(initiatorId, receiverId) {
  if (!initiatorId || !receiverId) return null;
  return friendships.find(
    (f) =>
      (f.initiatorId === initiatorId && f.receiverId === receiverId) ||
      (f.initiatorId === receiverId && f.receiverId === initiatorId)
  );
}

async function createFriendship(initiatorId, receiverId) {
  const friendship = {
    friendshipId: uuid.v4(),
    initiatorId,
    receiverId,
    createdAt: new Date(),
    status: 'pending',
  };
  friendships.push(friendship);
  return friendship;
}

/**
 * POST /api/friendships/create
 * Body: { initiatorId: string, receiverId: string }
 * Returns: { friendshipId: string }
 */
router.post('/create', verifyAuth, async (req, res) => {
  if (await findFriendship(req.body.initiatorId, req.body.receiverId)) {
    res.status(409).send({ msg: 'Existing friendship' });
    return;
  }
  const friendship = await createFriendship(
    req.body.initiatorId,
    req.body.receiverId
  );
  res.send({ friendshipId: friendship.friendshipId });
});

/**
 * returns a list of friendships that a userId is involved in
 * GET /api/friendships/:userId
 * Body: {  }
 * Returns: { [ {friendship}, {friendship} ... ] }
 */
router.get('/:userId', verifyAuth, async (req, res) => {
  const userId = req.params.userId;
  if (!await findUser('userId', userId)) {
    res.status(404).send({ msg: 'No user by that id' });
    return;
  }
  const userFriendships = friendships.filter(
    (f) => f.initiatorId === userId || f.receiverId === userId
  );
  res.send(userFriendships);
});

module.exports = router;