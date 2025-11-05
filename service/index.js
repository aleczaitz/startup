const port = process.argv.length > 2 ? process.argv[2] : 4000; // Default port is 4000, otherwise use the provided argument
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

// This will be kept in server RAM and be deleted once the server restarts
const users = [];

// The field that keeps the auth token on the client browser
const authCookieName = 'token'

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
})

apiRouter.get('/auth/password/:email', async (req, res) => {
    const email = req.params.email;
    const user = await findUser('email', email);

    if (!user) {
        res.status(404).send({ msg: "No user found" });
    } else {
        res.send({ password: user.password })
    }
});

// Return the application's default page if the path is unknown
// For example, if someone refreshes the browser on a front-end route,
// this will return the index.html page so the front-end app can load
// and handle the route. The url /dashboard would still show /dashboard in the browser,
// but the back end would just return index.html for the front end to handle it.
// If you tried navigating to an route that is unknown to the back end
// without this, you would get a 404 error from the back end.
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


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});