const port = process.argv.length > 2 ? process.argv[2] : 4000; // Default port is 4000, otherwise use the provided argument

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

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

function createUser() {
    // create a user object and store it in the server RAM for now
}

function setAuthCookie() {
    // set the response cookie to store an auth token in the user's browser
    // and store the token in the server RAM
}


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});