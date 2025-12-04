const path = require('path');
const { WebSocketServer } = require('ws');
const uuid = require('uuid');
const { findMatchById } = require('./routes/matches');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cookieParser = require('cookie-parser');
const { verifyAuth } = require('./utils/middleware');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Built-in middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Import route modules
const authRouter = require('./routes/auth');
const friendshipRouter = require('./routes/friendships');
const matchRouter = require('./routes/matches');
const userRouter = require('./routes/users');

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/friendships', friendshipRouter);
app.use('/api/matches', verifyAuth, matchRouter);
app.use('/api/users', userRouter);

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ type: err.name, message: err.message });
});

// Fallback to index.html for any unknown route (SPA support)
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const matches = new Map();

// Create a websocket object
const socketServer = new WebSocketServer({ server });

socketServer.on('connection', (socket) => {
  socket.isAlive = true;

  // expects 
  socket.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (e) {
      console.error('Invalid JSON from client:', raw.toString());
      return;
    }

    // handle join message
    // This assumes that the match has already been made
    if (msg.type === 'join') {
      const { matchId, userId } = msg;

      // Either load from cache or from DB the first time
      let matchState = matches.get(matchId);

      if (!matchState) {
        // Load match doc from Mongo
        const matchDoc = await findMatchById(matchId);
        if (!matchDoc) {
          // match not found
          socket.send(JSON.stringify({ type: 'error', message: 'Match not found' }));
          return;
        }

        const { player1Id, player2Id } = matchDoc;

        matchState = {
          players: new Map(),
          started: false,
          player1Id,
          player2Id,
        };

        matches.set(matchId, matchState);
      }

      //  Only allow the two users listed on the match
      const allowed = [matchState.player1Id, matchState.player2Id];
      if (!allowed.includes(userId)) {
        socket.send(JSON.stringify({ type: 'error', message: 'You are not part of this match' }));
        return;
      }

      // Prevent extra connections (3rd person, duplicate tabs, etc. — you can customize)
      if (matchState.players.size >= 2 && !matchState.players.has(socket)) {
        socket.send(JSON.stringify({ type: 'error', message: 'Match is already full' }));
        return;
      }

      matchState.players.set(socket, { userId });

      // When both players have joined, start the match
      if (matchState.players.size === 2 && !matchState.started) {
        const { quote } = await findMatchById(matchId); // or use matchDoc if you kept it
        matchState.started = true;

        broadcast(matchId, {
          type: 'match_start',
          text: quote,
          startTime: Date.now() + 3000,
        });
      }
    }
  
    // handle progress message
    if (msg.type === 'progress') {
      const { matchId, userId, progress, wpm } = msg;

      broadcast(matchId, {
        type: 'opponent_progress',
        userId,
        progress,
        wpm
      })
    }

    if (msg.type == 'finished') {
      const { matchId, userId, timeMs } = msg;
      
      broadcast(matchId, {
        type: 'match_result',
        winnerUserId: userId,
        timeMs
      });

      // todo: save results to mongoDB

    }

    // handle finished message
  });

  // handle onclose()
  socket.on('close', () => {
    // Remove socket from any match it was in
    for (const [matchId, match] of matches.entries()) {
      if (match.players.has(socket)) {
        match.players.delete(socket);
        broadcast(matchId, {type: 'opponent_left' });
        if (match.players.size === 0) {
          matches.delete(matchId);
        }
      }
    }
  })
})

function broadcast(matchId, payload) {
  const match = matches.get(matchId);
  if (!match) return;
  const json = JSON.stringify(payload);
  for (const [socket] of match.players) {
    if (socket.readyState === socket.OPEN) {
      socket.send(json);
    }
  }
}