const router = require('express').Router();
const controller = require('../controllers/user.controller');
const verifyToken = require('../middlewares/authMiddleware');

router.post("/register", controller.userRegister);

router.get('/', verifyToken, controller.getUsers);

router.post("/login", controller.userLogin);

router.put('/:id', verifyToken, controller.userUpdate);

router.delete('/:id', verifyToken, controller.userDelete);

router.get('/whoami', verifyToken, controller.whoAmI);

module.exports = router;