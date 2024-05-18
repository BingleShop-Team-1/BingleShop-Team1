const { Order, OrderItem  } = require('../models')

const statusOrder = ['pending', 'success']

const getOrders = async (req, res) => {
    const data = await Order.findAll()
    return res.status(200).json({
        success: true,
        data: data
    });
}

const createOrder =  async (req, res) => {
    const { item_id, quantity } = req.body

    console.log(req.user)

    const order = new Order
    order.user_id = req.user.id
    order.total_quantity = 0
    order.total_price = 0
    await order.save()

    const orderItem = new OrderItem
    orderItem.order_id = order.id
    orderItem.item_id = item_id
    orderItem.quantity = quantity
    await orderItem.save()

    return res.sendStatus(201)
}

const updateStatusOrder = async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    checkStatus = statusOrder.includes(status)

    if (! checkStatus) {
        return res.status(422).json({
            status: false,
            error: 'Status not matched'
        })
    }

    const order = await Order.findByPk(id)
    if (order != undefined) {
        order.status = status
        await order.save()

        return res.sendStatus(200)
    }

    return res.sendStatus(400)
}

module.exports = {
    getOrders,
    createOrder,
    updateStatusOrder
}