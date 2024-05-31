const express = require("express");
const router = require("./routers");
const { verifyToken } = require('./middlewares/');
require('dotenv').config();

const app = express();
app.use(express.json());

// Endpoint untuk verifikasi email - (untuk render tampilan verifikasi berhasil)
app.get('/verify-email', verifyToken, (req, res) => {
    res.sendFile(__dirname + '/views/verification-success.html');
});

app.use(router);

module.exports = app;
