const router = require('express').Router();

const controller = require('../controllers/order.controller')

router.get('/', controller.getOrders);
router.post('/', controller.createOrder);
router.patch('/:id/update-status', controller.updateStatusOrder);

module.exports = router;
