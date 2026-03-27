const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all sales
router.get('/', authenticate, async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { garden: true },
      orderBy: { date: 'desc' }
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Make a sale
router.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    if (data.date) data.date = new Date(data.date);
    const sale = await prisma.sale.create({ data });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete sale (Admin)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.sale.delete({ where: { id: req.params.id } });
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
