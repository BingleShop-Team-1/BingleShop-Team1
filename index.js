const express = require("express");
const bcrypt = require("bcrypt");
const {User} = require("./models");

const router = require("./routers");

const app = express();
app.use(express.json());
const port = 3002;

app.use(express.urlencoded({extended: true}));

app.use(router);
//load view engine using ejs
app.set("view engine", "ejs");

const statusOrder = ["pending", "success"];

app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({where: {email: email}});

  if (user != undefined) {
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (isValidPassword) {
      return res.sendStatus(200);
    }

    return res.status(422).json({
      status: false,
      error: "Wrong email or password",
    });
  }

  return res.status(422).json({
    status: false,
    error: "Email is not registered",
  });
});

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  const {name, address, email, password} = req.body;

  const user = new User();
  user.name = name;
  user.email = email;
  user.address = address;
  user.password = bcrypt.hashSync(password, 10);
  await user.save();

  return res.sendStatus(201);
});

app.get("/users", (req, res) => getList(req, res, User));
app.post("/users", async (req, res) => {
  const {name, address, email, password} = req.body;

  const user = new User();
  user.name = name;
  user.email = email;
  user.address = address;
  user.password = bcrypt.hashSync(password, 10);
  await user.save();

  return res.sendStatus(201);
});
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const {name, address, email, password} = req.body;

  const user = await User.findByPk(id);
  if (user != undefined) {
    user.name = name;
    user.email = email;
    user.address = address;
    user.password = bcrypt.hashSync(password, 10);
    await user.save();

    return res.sendStatus(204);
  }

  return res.sendStatus(404);
});
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  const user = await User.findByPk(id);
  if (user != undefined) {
    await User.destroy({
      where: {
        id: id,
      },
    });
    return res.sendStatus(204);
  }

  return res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getList(req, res, Model) {
  const data = await Model.findAll();
  return res.status(200).json({
    success: true,
    data: data,
  });
}
