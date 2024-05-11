const router = require("express").Router();
const { isAdmin, isAuthenticated } = require('../middlewares');

const controller = require("../controllers/item.controller");
const {uploader} = require("../libs/media.handling");

router.get("/", controller.getItems);
// router.get("/:id", ); //blm buat function get id
router.post("/", uploader.single("image"), controller.createItem);
router.put("/:id", uploader.single("image"), controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;
