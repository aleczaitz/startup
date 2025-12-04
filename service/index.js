const path = require('path');
const { WebSocketServer } = require('ws');
const uuid = require('uuid');
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
const { match, match } = require('assert');

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
    try {
      const msg = JSON.parse(raw);
    } catch {
      return;
    }

    // handle join message
    // This assumes that the match has already been made
    if (msg.type === "join") {
      const { matchId, userId }  = msg;

      if (!matches.has(match)) {
        matches.set(matchId, {
          players: new Map(), // socket -> { userId }
          started: false
        })
      }

      const match = matches.get(matchId);
      match.players.set(socket, { userId });

      if (match.players.size === 2 && !match.started) {

          try {
            const response = await fetch('https://api.kanye.rest', {
            });
            if (!response.ok) throw new Error(`Quote API error: ${response.status}`);
            const quote = await response.json();
          } catch {
            return;
          }

        match.started = true;
        broadcast(matchId, {
          type: "match_start",
          text: quote,
          startIme: Date.now() + 3000 // start in 3 seconds
        })
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
})

function broadcast(matchId, payload) {
  const match = matches.get(matchId);
  if (!matchId) return;
  const json = JSON.stringify(payload);
  for (const [socket] of match.players) {
    if (socket.readyState === socket.OPEN) {
      socket.send(json);
    }
  }
}