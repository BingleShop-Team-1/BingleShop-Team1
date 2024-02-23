const express = require('express')
const bcrypt = require('bcrypt')

const app = express()
const port = 3002

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//load view engine using ejs
app.set('view engine', 'ejs')
console.log(bcrypt.hashSync('12345', 10));
const userList = [
    {
        id: parseInt(1),
        name: "user 1",
        email: "user1@mail.com",
        password: "$2b$10$awDLXFTjbzVFrbfLp8t.peuv0pgcbu/rsVmp.BuZlrzpB4vXnqFWm", // bcrypt.hashSync('12345', 10),
        active: true
    }
];
const itemList = [
    {
        id: parseInt(1),
        name: "item 1",
        description: "description item 1",
        stock: 10,
        price: 1000
    }
];
const orderList = [
    {
        id: parseInt(1),
        user_id: 1,
        item_id: 1,
        quantity: 2
    }
];

app.get('/login', (req, res) => res.render('login'))
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = userList.find((u) => u.email == email)
    if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (!isValidPassword) {
            return res.status(400).send("Email atau password salah")
        }
    }
    res.sendStatus(200)
})

app.get('/register', (req, res) => res.render('register'))
app.post("/register", (req, res) => {
    const { email, password } = req.body
    userList.push({
        id: parseInt(userList[userList.length - 1]?.id + 1 || 1),
        email,
        password: bcrypt.hashSync(password, 10)
    })
    return res.sendStatus(201)
})


app.get('/users', (req, res) => getList(req, res, userList))
app.get('/items', (req, res) => getList(req, res, itemList))
app.get('/orders', (req, res) => getList(req, res, orderList))

app.post('/users', (req, res) => {
    const { name, email, active } = req.body

    const id = parseInt(userList[userList.length - 1].id) + 1
    userList.push({ id, name, email, active })

    res.status(204)
})
app.post('/items', (req, res) => {
    const { name, description, stock } = req.body

    const id = parseInt(itemList[itemList.length - 1].id) + 1
    itemList.push({ id, name, email, active })

    res.status(204)
})
app.post('/orders', (req, res) => {
    res.status(204)
})

app.put('/users/:id', (req, res) => {
    const id = req.params.id
    const { name, email, active } = req.body

    index = userList.findIndex((user) => user.id == id)

    if (index == -1) {
        return res.status(404).json({
            message: "user not found. id: " + id,
        })
    }

    userList[index].name = name
    userList[index].email = email
    userList[index].active = active

    res.status(204)
})
app.put('/items/:id', (req, res) => {
    const id = req.params.id
    const { name, description, stock } = req.body

    index = itemList.findIndex((item) => item.id == id)

    if (index == -1) {
        return res.status(404).json({
            message: "item not found. id: " + id,
        })
    }

    itemList[index].name = name
    itemList[index].description = description
    itemList[index].stock = stock

    res.status(204)
})
app.put('/orders/:id', (req, res) => {
    res.status(204)
})

app.delete('/users/:id', (req, res) => {
    const id = req.params.id

    let index = userList.findIndex((user) => user.id == id)

    if (index == -1) {
        return res.status(404).json({
            message: "user not found. id: " + id,
            data: [],
        })
    }

    userList.splice(index, 1) // delete item in array || // delete userList[index] // delete returns to null

    res.status(204)
})
app.delete('/items/:id', (req, res) => {
    const id = req.params.id

    let index = itemList.findIndex((item) => item.id == id)

    if (index == -1) {
        return res.status(404).json({
            message: "item not found. id: " + id,
            data: [],
        })
    }

    itemList.splice(index, 1)

    res.status(204)
})
app.delete('/orders/:id', (req, res) => {
    res.status(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function getList(req, res, list) {
    res.status(200).json({
        message: "get list",
        data: list
    })
}