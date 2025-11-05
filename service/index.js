const port = process.argv.length > 2 ? process.argv[2] : 4000; // Default port is 4000, otherwise use the provided argument

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');

// This causes Express static middleware to serve files from the pulic directory
app.use(express.static('public'));