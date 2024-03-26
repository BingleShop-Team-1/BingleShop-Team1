const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.post("/register", controller.userRegister);

router.get('/', controller.getUsers);

router.post("/login", controller.userLogin);

router.put('/:id', controller.userUpdate);

router.delete('/:id', controller.userDelete);

module.exports = router;