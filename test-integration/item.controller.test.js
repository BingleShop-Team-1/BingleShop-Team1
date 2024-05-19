// tests/item.controller.test.js
require("dotenv").config();

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Item } = require('../models');
const itemController = require('../controllers/item.controller');

const app = express();
app.use(bodyParser.json());

app.put('/items/:id', itemController.adminUpdateItem);
app.delete('/items/:id', itemController.adminDeleteItem);

describe('Item Controller', () => {
  let createdItem;

  beforeAll(async () => {
    // Sync database and create an item to test update and delete
    await sequelize.sync({ force: true });
    createdItem = await Item.create({
      name: 'Test Item',
      description: 'Test Description',
      stock: 10,
      price: 100,
      image: 'http://example.com/image.jpg',
    });
  });

  afterAll(async () => {
    // Clean up the database after tests
    await sequelize.close();
  });

  describe('PUT /items/:id', () => {
    it('should update an item', async () => {
      const response = await request(app)
        .put(`/items/${createdItem.id}`)
        .send({
          name: 'Updated Item',
          description: 'Updated Description',
          stock: 5,
          price: 200,
          image: 'http://example.com/newimage.jpg',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item updated!');

      const updatedItem = await Item.findByPk(createdItem.id);
      expect(updatedItem.name).toBe('Updated Item');
      expect(updatedItem.description).toBe('Updated Description');
      expect(updatedItem.stock).toBe(5);
      expect(updatedItem.price).toBe(200);
      expect(updatedItem.image).toBe('http://example.com/newimage.jpg');
    });

    it('should return 404 if item not found', async () => {
      const response = await request(app)
        .put('/items/999999')
        .send({
          name: 'Non-existing Item',
          description: 'Non-existing Description',
          stock: 5,
          price: 200,
          image: 'http://example.com/newimage.jpg',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an item', async () => {
      const response = await request(app).delete(`/items/${createdItem.id}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item deleted');

      const deletedItem = await Item.findByPk(createdItem.id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 if item not found', async () => {
      const response = await request(app).delete('/items/999999');
      expect(response.status).toBe(404);
    });
  });
});