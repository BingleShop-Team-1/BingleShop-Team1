var express = require('express');
var router = express.Router();

router.get('/', (req, res) => getList(req, res, Order));
router.post('/', async (req, res) => {
    const { user_id, item_id, quantity } = req.body;

    const order = new Order;
    order.user_id = user_id;
    order.item_id = item_id;
    order.quantity = quantity;
    await order.save();

    try {
        const newOrder = await Order.create({ user_id, item_id, quantity });
        res.status(201).json(newOrder);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat order baru.' });
      };
});
router.patch('/:id/update-status', async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    checkStatus = statusOrder.includes(status);

    if (! checkStatus) {
        return res.status(422).json({
            status: false,
            error: 'Status not matched'
        })
    };

    const order = await Order.findByPk(id)
    if (order != undefined) {
        order.status = status
        await order.save()

        return res.sendStatus(200)
    };

    return res.sendStatus(404)
});

module.exports = router;
