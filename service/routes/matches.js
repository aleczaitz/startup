const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { matches } = require('../utils/helpers');

async function findMatch(field, value) {
  if (!value) return null;
  return matches.find((m) => m[field] === value);
}

/**
 * POST /api/matches/create
 * Body: { inviterId: string, inviteeId: string }
 * Returns: { match: MatchObject }
 */
router.post('/create', (req, res) => {
  const match = {
    matchId: uuid.v4(),
    player1: req.body.inviterId,
    player2: req.body.inviteeId,
    quote: '',
    status: 'pending',
  };
  matches.push(match);
  res.status(200).send({ match });
});

/**
 * PUT /api/matches/accept
 * Body: { matchId: string, playerId: string }
 * Returns: { match: MatchObject }
 */
router.put('/accept', async (req, res) => {
  const match = await findMatch('matchId', req.body.matchId);
  if (!match) {
    res.status(404).send({ msg: 'No match found' });
    return;
  }

  try {
    const response = await fetch('https://api.api-ninjas.com/v2/randomquotes', {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
    });
    const data = await response.json();
    match.status = 'active';
    match.quote = data[0].quote;
    res.status(200).send({ match });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

module.exports = router;