const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { findUser, createUser, setAuthCookie } = require('../utils/helpers');

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
apiRouter.post('/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: "Existing User"});
        return;
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
apiRouter.post('/login', async (req, res) => {
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
apiRouter.delete('/logout', async (req, res) => {
    // Find the user by the token cookie, that way we know if the session is active
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    } // get rid of the token stored in RAM
    res.clearCookie(authCookieName);
    res.status(204).end(); // 204 means that the request was successfull but there isn't any content to return
});

// Apply auth middleware to all routes that start with /match
apiRouter.use('/match', verifyAuth);