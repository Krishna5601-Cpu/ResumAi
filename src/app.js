const express = require("express");
// Importing Packages -

const app = express();
// Creates App Engine or Creating Server's Instance -

app.use(express.json);
// Json Middleware

module.exports = app;
