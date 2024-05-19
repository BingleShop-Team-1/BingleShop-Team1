require("dotenv").config();
const app = require('../app')
const httpRequest = require('supertest')
const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')
const { sequelize, Item, User } = require('../models');
const jwt = require('jsonwebtoken')

describe('Get Detail Item Test', () => {
    let token;
    let itemId;

    beforeAll(async () => {
        await sequelize.sync({force:true})
        token = await userLogin(false)
        const item = await Item.create({ name: 'Test Item', price: 100 });
        itemId = item.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('Should return unauthorized without token', async () => {
        const res = await httpRequest(app)
            .get(`/items/${itemId}`)

        expect(res.status).toBe(401);
    });

    it('Should return item detail', async () => {
        const res = await httpRequest(app)
            .get(`/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id', itemId);
    });

    it('Should return 400 if item not found', async () => {
        const res = await httpRequest(app)
            .get('/items/999999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Item not found');
    });

    it('Should handle server errors', async () => {
        const originalFindByPk = Item.findByPk;
        Item.findByPk = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });

        const res = await httpRequest(app)
            .get(`/items/${itemId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Database error');

        Item.findByPk = originalFindByPk;
    });
});

async function userLogin(isAdmin) {
    const user = await User.create({ email: 'testuser@mail', password: 'testpass', is_admin: isAdmin });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    return token
}
