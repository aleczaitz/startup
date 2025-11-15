const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { findUser } = require('../utils/helpers');
const DB = require('../database.js');

async function findMatchById(matchId) {
  if (!matchId) return null;
  return await DB.getMatchById(matchId);
}

/**
 * POST /api/matches/create
 * Body: { inviterId: string, inviteeId: string }
 * Returns: { match: MatchObject }
 */
router.post('/create', async (req, res) => {

  if (!req.body.inviterId || !req.body.inviteeEmail) {
  return res.status(400).send({ msg: 'Missing inviterId or inviteeId' });
  }

  const invitee = await findUser('email', req.body.inviteeEmail);

  if (!invitee) return res.status(400).send({ msg: `No user found for email: ${ req.body.inviteeEmail }`});

  const inviteeId = invitee.userId

  const match = {
    matchId: uuid.v4(),
    player1Id: req.body.inviterId,
    player2Id: inviteeId,
    quote: '',
    status: 'pending',
    createdAt: new Date()
  };
  await DB.createMatch(match);
  res.status(200).send({ match });
});

/**
 * PUT /api/matches/accept
 * Body: { matchId: string, accepterId: string }
 * Returns: { match: MatchObject }
 */
router.put('/accept', async (req, res) => {
  const match = await findMatchById(req.body.matchId);
  const accepterId = req.body.accepterId;

  if (!match) {
    return res.status(404).send({ msg: 'No match found' });
  }

  if (!accepterId) {
    return res.status(400).send({ msg: 'Must include accepterId' });
  }

  if (match.player2Id !== accepterId) {
    return res.status(400).send({ msg: 'AccepterId does not line up with match'});
  }

  try {
    const response = await fetch('https://api.api-ninjas.com/v2/randomquotes', {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    });
    if (!response.ok) throw new Error(`Quote API error: ${response.status}`);
    const data = await response.json();
    match.status = 'in progress';
    match.quote = data[0].quote;
    await DB.updateMatch(match);
    res.status(200).send({ match });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

/**
 * PUT /api/matches/accept
 * Body: { matchId: string , userId: string }
 * Returns: { match: MatchObject }
 */
router.put('/complete', async (req, res) => {
  const match = await findMatchById(req.body.matchId);

  if (!match) return res.status(404).send({ msg: 'match not found with that id'});

  if (match.status !== 'in progress') return res.status(400).send({ msg: 'match must be in progress to complete'});

  const user = await findUser('userId', req.body.userId);

  if (!user) return res.status(404).send({ msg: 'user not found with that id'});

  if (user.userId !== match.player1Id && user.userId !== match.player2Id) return res.status(400).send({ msg: "user must be a part of the match"});

  match.status = 'complete';

  await DB.updateMatch(match);

  res.send({ match });
})

/**
 * GET /api/matches/userId/:userId
 * Body: {  }
 * Returns: { [{match}, match] }
 */
router.get('/userId/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).send({ msg: 'Request must include a userId' });
  }

  const userMatches = await DB.getMatchesByUserId(userId);

  const enriched = await Promise.all(
    userMatches.map(async (m) => {
      const [player1, player2] = await Promise.all([
        DB.getUserById(m.player1Id),
        DB.getUserById(m.player2Id),
      ]);

      return {
        ...m,
        player1Email: player1?.email,
        player2Email: player2?.email,
      };
    })
  );

  res.send(enriched);
});

module.exports = router;