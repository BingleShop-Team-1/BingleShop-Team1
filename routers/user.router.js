const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { isAdmin } = require('../middlewares');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post("/register", controller.userRegister);
router.get('/', isAuthenticated, isAdmin(true), controller.getUsers); 
router.post("/login", controller.userLogin);
router.put('/user-update', isAuthenticated, controller.userUpdate);
router.delete('/user-delete', isAuthenticated, isAdmin(true), controller.userDelete);
router.get('/whoami', isAuthenticated, controller.whoAmI);

module.exports = router;
