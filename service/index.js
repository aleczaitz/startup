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

// This causes Express static middleware to serve files from the pulic directory
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({msg: "Existing User"});
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token)
        res.send({ email: user.email }) // don't need to set the status code because the default is 200
    }
})

// Helper functions

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

function setAuthCookie(res, user) {
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