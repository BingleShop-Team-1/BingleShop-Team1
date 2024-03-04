const express = require('express')
const bcrypt = require('bcrypt')
const { User, Order, Item } = require('./models')

const app = express()
const port = 3002

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//load view engine using ejs
app.set('view engine', 'ejs')

app.get('/login', (req, res) => res.render('login'))
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (user != undefined) {
        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (isValidPassword) {
            return res.sendStatus(200)
        }
        return res.status(400).send("Email atau password salah")
    }
    return res.status(400).send('email tidak terdaftar')
})

app.get('/register', (req, res) => res.render('register'))
app.post("/register", async (req, res) => {
    const { name, address, email, password } = req.body

    const user = new User
    user.name = name
    user.email = email
    user.address = address
    user.password = bcrypt.hashSync(password, 10)
    await user.save()

    return res.sendStatus(201)
})

app.get('/users', (req, res) => getList(req, res, User))
app.post('/users', async (req, res) => {
    const { name, address, email, password } = req.body

    const user = new User
    user.name = name
    user.email = email
    user.address = address
    user.password = bcrypt.hashSync(password, 10)
    await user.save()

    return res.sendStatus(201)
})
app.put('/users/:id', async (req, res) => {
    const id = req.params.id
    const { name, address, email, password } = req.body

    const user = User.findByPk(id)
    if (user != undefined) {
        user.name = name
        user.email = email
        user.address = address
        user.password = bcrypt.hashSync(password, 10)
        await user.save()

        return res.sendStatus(204)
    }

    return res.sendStatus(404)
})
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
app.post('/orders', (req, res) => {
    res.status(204)
})
app.put('/orders/:id', (req, res) => {
    res.status(204)
})
app.delete('/orders/:id', (req, res) => {
    res.status(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function getList(req, res, Model) {
    const data = await Model.findAll()
    return res.status(200).json({
        success: 1,
        data: data
    })
}