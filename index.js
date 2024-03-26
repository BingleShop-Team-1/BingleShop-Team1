const express = require("express");
const router = require("./routers");

const app = express();
app.use(express.json());
const port = 3002;

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});