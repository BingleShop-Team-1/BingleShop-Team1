const router = require("express").Router();
const { isAdmin, isAuthenticated } = require('../middlewares');

const controller = require("../controllers/item.controller");
const {uploader} = require("../libs/media.handling");

router.get("/", controller.getItems);
router.get("/:id", controller.getDetailItem);
router.post("/", isAdmin, uploader.single("image"), controller.adminCreateItem);
router.put("/:id", isAdmin, uploader.single("image"), controller.adminUpdateItem);
router.delete("/:id", isAdmin, controller.adminDeleteItem);

module.exports = router;
