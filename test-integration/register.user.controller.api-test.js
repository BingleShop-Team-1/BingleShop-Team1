const request = require('supertest');
const app = require('../app');
const { User, sequelize } = require('../models');
const { describe, it, beforeAll, afterAll, beforeEach, expect } = require('@jest/globals');

describe('POST /users/register', () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    it('should register a new user successfully', async () => {
        const newUser = {
            name: 'New User',
            email: 'newuser@example.com',
            password: 'password123',
            address: 'Yogyakarta'
        };

        const response = await request(app)
            .post('/users/register')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Pengguna berhasil didaftarkan');
    });

    it('should return a 400 error if required fields are missing', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({ email: 'testuser@example.com' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Silakan isikan Email, Password, dan Nama Lengkap');
    });

    it('should return a 400 error if email already exists', async () => {
        const existingUser = {
            name: 'Existing User',
            email: 'existinguser@example.com',
            password: 'password123',
            address: '123 Existing St.'
        };

        await User.create(existingUser);

        const response = await request(app)
            .post('/users/register')
            .send(existingUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Email telah digunakan');
    });
});
