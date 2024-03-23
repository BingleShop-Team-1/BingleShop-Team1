const express = require('express');
const router = express.Router();
const { Item } = require('../models'); // Pastikan path model Item sudah sesuai

// Route untuk mendapatkan semua item
router.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data item.' });
  }
});

// Route untuk mendapatkan detail item berdasarkan ID
router.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan.' });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil detail item.' });
  }
});

// Route untuk membuat item baru
router.post('/items', async (req, res) => {
  const { name, description, image, stock, price } = req.body;
  try {
    const newItem = await Item.create({ name, description, image, stock, price });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat item baru.' });
  }
});

// Route untuk menghapus item berdasarkan ID
router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan.' });
    }
    await item.destroy();
    res.json({ message: 'Item berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus item.' });
  }
});

// Route untuk memperbarui item berdasarkan ID
router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, image, stock, price } = req.body;
  try {
    let item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item tidak ditemukan.' });
    }
    item.name = name;
    item.description = description;
    item.image = image;
    item.stock = stock;
    item.price = price;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui item.' });
  }
});

module.exports = router;

//Test
