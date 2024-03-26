const router = require('express').Router();

const controller = require("../controllers/item.controller");

router.get("/", controller.getItems);
// router.get("/:id", ); //blm buat function get id
router.post("/", controller.createItem);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;
