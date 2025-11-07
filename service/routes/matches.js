const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { matches, users, findUser } = require('../utils/helpers');

async function findMatch(field, value) {
  if (!value) return null;
  return matches.find((m) => m[field] === value);
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
  };
  matches.push(match);
  res.status(200).send({ match });
});

/**
 * PUT /api/matches/accept
 * Body: { matchId: string, accepterId: string }
 * Returns: { match: MatchObject }
 */
router.put('/accept', async (req, res) => {
  const match = await findMatch('matchId', req.body.matchId);
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
    res.status(200).send({ match });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

/**
 * GET /api/matches/userId/:userId
 * Body: {  }
 * Returns: { [{match}, match] }
 */
router.get('/userId/:userId', async(req, res) => {
  const userId = req.params.userId;

  if (!userId) return res.status(400).send({ msg: "Request must include a userId" });
  
  const userMatches = matches.filter((m) => userId === m.player1Id || userId === m.player2Id);

  if (userMatches.length === 0) return res.status(404).send({ msg: "No matches for this userId" });
  
  const enriched = userMatches.map((m) => {
    const player1 = users.find((u) => u.userId === m.player1Id);
    const player2 = users.find((u) => u.userId === m.player2Id);
    return { ...m, player1Email: player1.email, player2Email: player2.email }
  });

  res.send(enriched);


})

module.exports = router;