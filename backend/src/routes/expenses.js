const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all expenses
router.get('/', authenticate, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: { garden: true, supplier: true },
      orderBy: { date: 'desc' }
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create expense
router.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    if (data.date) data.date = new Date(data.date);
    const expense = await prisma.expense.create({ data });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense (Admin & Manager)
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    await prisma.expense.delete({ where: { id: req.params.id } });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
