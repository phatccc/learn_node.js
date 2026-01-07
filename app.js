require("dotenv").config();

const express = require('express');
const authRoutes = require('./routes/auth.route');

app = express();

app.use(express.json());
app.use("" , authRoutes) ;

module.exports = app