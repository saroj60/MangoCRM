const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all harvests
router.get('/', authenticate, async (req, res) => {
  try {
    const harvests = await prisma.harvest.findMany({
      include: { garden: true },
      orderBy: { date: 'desc' }
    });
    res.json(harvests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add harvest
router.post('/', authenticate, async (req, res) => {
  try {
    const data = req.body;
    if (data.date) data.date = new Date(data.date);
    const harvest = await prisma.harvest.create({ data });
    res.status(201).json(harvest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete harvest (Admin & Manager)
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    await prisma.harvest.delete({ where: { id: req.params.id } });
    res.json({ message: 'Harvest deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
