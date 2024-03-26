const routers = require("express").Router();
const userRouter = require('/user.router');
const itemRouter = require("./item.router");
const orderRouter = require("./order.router");

// routers.use('/users', userRouter);
routers.use("/items", itemRouter);
routers.use("/orders", orderRouter);
routers.use("/users", userRouter);

module.exports = routers;