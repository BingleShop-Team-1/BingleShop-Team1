require("dotenv").config()
const app = require('../app')
const jwt = require('jsonwebtoken')
const httpRequest = require('supertest')
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { sequelize, User, Item } = require('../models')
const path = require('path')
// const cloudinary = require('cloudinary').v2

// jest.mock('cloudinary')
// cloudinary.uploader.upload = jest.fn().mockImplementation((file) => {
//     return Promise.resolve({
//         secure_url: 'http://mockedurl.com/image.png'
//     })
// })

describe('Create Item Test', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    const userLogin = async (isAdmin) => {
        const user = await User.create({ email: 'testuser@mail.com', password: 'testpass', is_admin: isAdmin })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY)
        return token
    }

    it('should return unauthorized if not logged in', async () => {
        const res = await httpRequest(app)
            .post('/items')
            .field('name', 'Test Item')
            .field('description', 'Test Description')
            .field('stock', 10)
            .field('price', 99.99)
            .attach('image', path.resolve(__dirname, '../test-image.png'))

        expect(res.status).toBe(401)
    })

    it('should return forbidden if not admin', async () => {
        const token = await userLogin(false)

        const res = await httpRequest(app)
            .post('/items')
            .set('Authorization', `Bearer ${token}`)
            .field('name', 'Test Item')
            .field('description', 'Test Description')
            .field('stock', 10)
            .field('price', 99.99)
            // .attach('image', path.resolve(__dirname, '../test-image.png'))

        expect(res.status).toBe(403)
    })

    it('should create item if admin', async () => {
        // const token = await userLogin(true)

        // const res = await httpRequest(app)
        //     .post('/items')
        //     .set('Authorization', `Bearer ${token}`)
        //     .field('name', 'Test Item')
        //     .field('description', 'Test Description')
        //     .field('stock', 10)
        //     .field('price', 99.99)
        //     .attach('image', path.resolve(__dirname, '../test-image.png'))

        // expect(res.status).toBe(200)
        // expect(res.body.success).toBe(true)
        // expect(res.body.data).toHaveProperty('id')
        // expect(res.body.data.name).toBe('Test Item')
        // expect(res.body.data.description).toBe('Test Description')
        // expect(res.body.data.stock).toBe(10)
        // expect(res.body.data.price).toBe(99.99)
        // expect(res.body.data.image).toBe('http://mockedurl.com/image.png')
    })
})
