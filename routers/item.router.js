const express = require("express");
const router = express.Router();
// const { Item } = require('../models'); // Pastikan path model Item sudah sesuai

const controller = require("../controllers/item.controller");

router.get("/", controller.getItems);
// router.get("/:id", ); //blm buat function get id
router.post("/", controller.createItem);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;

//Test
