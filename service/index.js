require('dotenv').config();

const apiKey = process.env.API_KEY;
const port = process.argv.length > 2 ? process.argv[2] : 4000; // Default port is 4000, otherwise use the provided argument
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// The field that keeps the auth token on the client browser
const authCookieName = 'token';

// JSON body parsing using built-in middleware (makes the request body available on req.body)
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens (does the same thing but on req.cookies)
app.use(cookieParser());

// This causes Express static middleware to serve files from the pulic directory
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

// Apply auth middleware to all routes that start with /match
apiRouter.use('/match', verifyAuth);

/**
 * POST /api/match/create
 * Body: { inviterId: string, inviteeId: string }
 * Returns: { match: MatchObject }
 */
apiRouter.post('/match/create', (req, res) => {
    // Creates a match with two user id's and a quote to type
    const match = {
        matchId: uuid.v4(),
        player1: req.body.inviterId, 
        player2: req.body.inviteeId,
        quote: "",
        status: "pending",
    }
    matches.push(match);

    res.status(200).send({ match });
});

/**
 * PUT /api/match/accept
 * Body: { matchId: string, playerId: string }
 * Returns: { match: MatchObject }
 */
apiRouter.put('/match/accept', async (req, res) => {
    const match = await findMatch('id', req.body.matchId);
    if (!match) {
        res.status(404).send({ msg: "No match found"});
        return;
    } else {
        try {
            const response = await fetch('https://api.api-ninjas.com/v2/randomquotes', {
                headers: { 'X-Api-Key': process.env.API_NINJAS_KEY}
            });
            const data = await response.json();
            const quote = data[0].quote;

            match.status = "active";
            match.quote = quote;

            res.status(200).send({ match });
        } catch (err) {
            res.status(500).send({ msg: err.message })
        }
    }
});

/**
 * POST /api/friendships/create
 * Body: { initiatorId: string, receiverId: string }
 * Returns: { friendshipId: string }
 */
apiRouter.post('/friendships/create', verifyAuth, async (req, res) => {
    if (await findFriendship(req.body.initiatorId, req.body.receiverId)) {
        res.status(409).send({ msg: 'Existing friendship' });
        return;
    } else {
        const friendship = await createFriendship(req.body.initiatorId, req.body.receiverId);

        res.send({ friendshipId: friendship.friendshipId });
    }
});

/**
 * returns a list of friendships that a userId is involved in
 * GET /api/friendships/:userId
 * Body: {  }
 * Returns: { [ {friendship}, {friendship} ... ] }
 */
apiRouter.get('/friendships/:userId', verifyAuth, async (req, res) => {
    const userId = req.params.userId;
    if (!await findUser('userId', userId)) {
        res.status(404).send({ msg: 'No User Found'});
        return;
    } else {
        const userFriendships = friendships.filter((f) => f.initiatorId === userId || f.receiverId === userId);
        res.send(userFriendships);
    }
})

/**
 * GET /api/users/:email
 * Body: {  }
 * Returns: { userId: string }
 */
apiRouter.get('/users/:email', verifyAuth, async (req, res) => {
    const user = await findUser('email', req.params.email);
    if (user) {
        res.send({ userId: user.userId });
    } else {
        res.status(404).send({ msg: "No user by that email"});
        return;
    }
}) 

/**
 * GET /api/users/:userId
 * Body: {  }
 * Returns: { user }
 */
apiRouter.get('/users/:userId', verifyAuth, async (req, res) => {
    const user = await findUser('userId', req.params.email);
    if (user) {
        res.send({ user });
    } else {
        res.status(404).send({ msg: "No user by that id"});
        return;
    }
}) 


// Default error handler
app.use((err, req, res, next) => { // giving a middleware method 4 params tells express that it's an error handler
    res.status(500).send({ type: err.name, message: err.message }) // Generic server error
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper functions

async function findMatch(field, value) {
    if (!value) return null;

    return matches.find((m) => m[field] === value);
}

async function findFriendship(initiatorId, receiverId) {
    if (!initiatorId || !receiverId) return null;

    return friendships.find((f) => 
        (f.initiatorId === initiatorId && f.receiverId === receiverId) ||
        (f.initiatorId === receiverId && f.receiverId === initiatorId)
    );
}

async function createFriendship(initiatorId, receiverId) {
    const friendship = {
        friendshipId: uuid.v4(),
        initiatorId: initiatorId,
        receiverId: receiverId,
        createdAt: new Date(),
        status: "pending"
    }
    friendships.push(friendship);
    return friendship;
}



app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});