const router = require('express').Router();
const controller = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post("/register", controller.userRegister);

router.get('/', isAuthenticated, controller.getUsers);

router.post("/login", controller.userLogin);

router.put('/:id', isAuthenticated, controller.userUpdate);

router.delete('/:id', isAuthenticated, controller.userDelete);

router.get('/whoami', isAuthenticated, controller.whoAmI);

//Endpoint admin (kurang tahu benar atau salah)
router.post("/admin/register", controller.adminRegister);

router.get('/admin', isAuthenticated, controller.getAdmin);

router.post("/admin/login", controller.adminLogin);

router.put('/admin/:id', isAuthenticated, controller.adminUpdate);

router.delete('/admin/:id', isAuthenticated, controller.adminDelete);

module.exports = router;
