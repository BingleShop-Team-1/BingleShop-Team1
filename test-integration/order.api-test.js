require('assert').strictEqual(process.env.NODE_ENV, 'test')
const { describe, it } = require('@jest/globals')
const app = require('../app')
const httpRequest = require('supertest')
const { sequelize } = require('../models')
const Order = sequelize.model('Order')
// const Order = require('../../models').sequelize.model('Order')

describe('Order test', () => {
    // beforeAll(async () => {
    //     await sequelize.sync({force:true})
    // })
    it('GET /orders - success - get all orders', async () => {
        const res = await httpRequest(app).get('/orders')
        

    })
})



