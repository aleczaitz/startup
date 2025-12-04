const path = require('path');
const { WebSocketServer } = require('ws');
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

  socket.on('message', (raw) => {
    try {
      const data = JSON.parse(raw);
    } catch {
      return;
    }

    // handle join message

    // handle progress message

    // handle finished message
  });

  // handle onclose()
})