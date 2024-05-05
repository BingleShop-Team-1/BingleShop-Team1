const express = require("express");

const passport = require('./libs/passport');
const router = require("./routers");
require('dotenv').config()

const app = express();
const port = process.env.NODE_PORT || 3002;
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`BingleShop app listening on port ${port}`);
});