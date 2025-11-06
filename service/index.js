require('dotenv').config();

const apiKey = process.env.API_KEY;
const port = process.argv.length > 2 ? process.argv[2] : 4000; // Default port is 4000, otherwise use the provided argument
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

// This will be kept in server RAM and be deleted once the server restarts
const users = [];
const matches = [];
const friendships = [];

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

/**
 * POST /api/auth/create
 * Creates a new user account.
 * 
 * Request body:
 * {
 *   "email": string,
 *   "password": string
 * }
 * 
 * Responses:
 *  - 200: { "email": string, userId: string } – user successfully created
 *  - 409: { "msg": "Existing User" } – email already in use
 */
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: "Existing User"});
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token)
        res.send({ email: user.email, userId: user.userId }) // don't need to set the status code because the default is 200
    }
});

/**
 * POST /api/auth/login
 * Authenticates an existing user and sets an auth cookie.
 * 
 * Request body:
 * {
 *   "email": string,
 *   "password": string
 * }
 * 
 * Responses:
 *  - 200: { "email": string, userId: string } – login successful
 *  - 401: { "msg": "Unauthorized" } – invalid email or password
 */
apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user) { // check if there is actually a user in the request
        if (await bcrypt.compare(req.body.password, user.password)) { // Check is the passwords match
            user.token = uuid.v4();
            setAuthCookie(res, user.token);
            res.send({ email: user.email, userId: user.userId });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized'});
});

/**
 * DELETE /api/auth/logout
 * Logs the user out by removing their auth token and clearing the cookie.
 * 
 * No request body.
 * 
 * Responses:
 *  - 204: (no content) – logout successful
 */
apiRouter.delete('/auth/logout', async (req, res) => {
    // Find the user by the token cookie, that way we know if the session is active
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    } // get rid of the token stored in RAM
    res.clearCookie(authCookieName);
    res.status(204).end(); // 204 means that the request was successfull but there isn't any content to return
});

/**
 * Middleware: verifyAuth
 * Checks if the user making the request has a valid auth cookie.
 * 
 * If valid → calls next() to continue to the route handler.
 * If invalid → returns 401 Unauthorized.
 */
const verifyAuth = async (req, res, next) => {
    const user = findUser('token', req.cookies[authCookieName]);
    if (user) {
        next(); // move on
    } else {
        res.status(401).send({ msg: "Unauthorized" });
    }
};

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
        id: uuid.v4(),
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
 * Body: { initiatorId: string, recieverId: string }
 * Returns: { friendshipId: string }
 */
apiRouter.post('/friendships/create', verifyAuth, async (req, res) => {
    if (await findFriendship(req.body.initiatorId, req.body.recieverId)) {
        res.status(409).send({ msg: 'Existing friendship' })
    } else {
        const friendship = createFriendship(req.body.initiatorId, req.body.recieverId);

        res.send({ friendshipId: friendship.id });
    }
});

// Default error handler
app.use((err, req, res, next) => { // giving a middleware method 4 params tells express that it's an error handler
    res.status(500).send({ type: err.name, message: err.message }) // Generic server error
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Helper functions

async function findUser(field, value) {
    if (!value) return null;

    return users.find((user) => user[field] === value);
}

async function findMatch(field, value) {
    if (!value) return null;

    return matches.find((m) => m[field] === value);
}

async function findFriendship(initiatorId, recieverId) {
    if (!initiatorId || !recieverId) return null;

    return friendships.find((f) => 
        (f.initiatorId === initiatorId && f.recieverId === recieverId) ||
        (f.initiatorId === recieverId && f.recieverId === initiatorId)
    );
}

// {
//     friendshipId: string,
//     initiatorId: string,
//     recieverId: string,
//     createAt: Date,
//     status: 'pending' 'accepted'
// }

async function createFriendship(initiatorId, recieverId) {
    const friendship = {
        friendshipId: uuid.v4(),
        initiatorId: initiatorId,
        recieverId: recieverId,
        createdAt: new Date(),
        status: "pending"
    }
    friendships.push(friendship);
    return friendship;
}

async function createUser(email, password) {
    // create a user object and store it in the server RAM for now

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
        userId: uuid.v4(),
        token: uuid.v4(),
    };
    users.push(user);
    return user;
}

function setAuthCookie(res, authToken) {
    // set the response cookie to store an auth token in the user's browser
    // and store the token in the server RAM
    res.cookie(authCookieName, authToken, {
        maxAge: 1000 * 60 * 60, // How long the cookie lasts in the browser in ms
        secure: true, // only sent over https?
        httpOnly: true, // doesn't show up in js (document.cookie)
        sameSite: 'strict', // doesn't allow cross origin attacks
    });
}

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});