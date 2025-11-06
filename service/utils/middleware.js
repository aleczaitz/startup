const { findUser, authCookieName } = require('./helpers');

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

module.exports = { verifyAuth };