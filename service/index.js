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

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: "Existing User"});
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token)
        res.send({ email: user.email }) // don't need to set the status code because the default is 200
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user) { // check if there is actually a user in the request
        if (await bcrypt.compare(req.body.password, user.password)) { // Check is the passwords match
            user.token = uuid.v4();
            setAuthCookie(res, user.token);
            res.send({ email: user.email });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized'});
});

apiRouter.delete('/auth/logout', async (req, res) => {
    // Find the user by the token cookie, that way we know if the session is active
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    } // get rid of the token stored in RAM
    res.clearCookie(authCookieName);
    res.status(204).end(); // 204 means that the request was successfull but there isn't any content to return
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = findUser('token', req.cookies[authCookieName]);
    if (user) {
        next(); // move on
    } else {
        res.status(401).send({ msg: "Unauthorized" });
    }
};

// createMatch create a match between two users 
apiRouter.post('/match/create', verifyAuth, (req, res) => {
    // Creates a match with two user id's and a quote to type
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

async function findUser(field, value) {
    if (!value) return null;

    return users.find((user) => user[field] === value);
}

async function createUser(email, password) {
    // create a user object and store it in the server RAM for now

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
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

// takes in 2 user id's and returns a match object with a quote
async function createMatch(player1Id, player2Id) {
    const res = await fetch('https://api.api-ninjas.com/v2/randomquotes');
    const data = await res.json();
    const quote = data[0].quote;

    const match = {player1: player1Id, player2: player2Id, quote: quote};

    return match;
}


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});