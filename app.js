const express = require("express");
const router = require("./routers");
// const { verifyEmail } = require('./controllers/user.controller');
const jwt = require('jsonwebtoken');
const { User } = require('./models');
require('dotenv').config()

const app = express();
app.use(express.json());

/// Route untuk memverifikasi token dan merender halaman sukses verifikasi
// app.get('/verify-email', verifyEmail);

// Menambahkan route untuk halaman verifikasi dengan middleware verifyToken
app.get('/verify-email', (req, res) => {
    res.sendFile(__dirname + '/verification-success.html');
});

// app.use(verifyEmail)
app.use(router);

module.exports = app;
