const router = require('express').Router();
const controller = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAuthorized = require('../middlewares/isAuthorized');

router.post("/register", controller.userRegister);

router.get('/', isAuthenticated, controller.getUsers);

router.post("/login", controller.userLogin);

router.put('/:id', isAuthenticated, controller.userUpdate);

router.delete('/:id', isAuthenticated, controller.userDelete);

router.get('/whoami', isAuthenticated, controller.whoAmI);

module.exports = router;
