const express = require('express')
const bcrypt = require('bcrypt')
const { User, Order, Item } = require('./models')
const { userRouter } = require('/Routes/user.router')

const app = express()
const port = 3002

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//load view engine using ejs
app.set('view engine', 'ejs')

const statusOrder = ['pending', 'success']

app.use('/login', userRouter)

app.use("/register", userRouter)

app.use('/users', userRouter)

app.use('/users', userRouter)

app.use('/users/:id', userRouter)

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id

    const user = await User.findByPk(id)
    if (user != undefined) {
        await User.destroy({
            where: {
                id: id
            }
        });
        return res.sendStatus(204)
    }

    return res.sendStatus(404)
})

app.get('/items', (req, res) => getList(req, res, Item))
app.post('/items', async (req, res) => {
    const { name, description, image, stock, price } = req.body

    const item = new Item
    item.name = name
    item.description = description
    item.image = image
    item.stock = stock
    item.price = price
    await item.save()

    return res.sendStatus(201)
})
app.put('/items/:id', async (req, res) => {
    const id = req.params.id
    const { name, description, image, stock, price } = req.body

    const item = Item.findByPk(id)
    if (item != undefined) {
        item.name = name
        item.description = description
        item.image = image
        item.stock = stock
        item.price = price
        await item.save()

        return res.sendStatus(201)
    }

    return res.sendStatus(404)

})
app.delete('/items/:id', async (req, res) => {
    const id = req.params.id

    const item = await Item.findByPk(id)
    if (item != undefined) {
        await item.destroy({
            where: {
                id: id
            }
        });
        return res.sendStatus(204)
    }

    return res.sendStatus(404)
})

app.get('/orders', (req, res) => getList(req, res, Order))
app.post('/orders', async (req, res) => {
    const { user_id, item_id, quantity } = req.body

    const order = new Order
    order.user_id = user_id
    order.item_id = item_id
    order.quantity = quantity
    await order.save()

    return res.sendStatus(201)
})
app.patch('/orders/:id/update-status', async (req, res) => {
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

    return res.sendStatus(404)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function getList(req, res, Model) {
    const data = await Model.findAll()
    return res.status(200).json({
        success: true,
        data: data
    })
}