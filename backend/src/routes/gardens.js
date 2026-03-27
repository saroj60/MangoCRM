const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all gardens
router.get('/', authenticate, async (req, res) => {
  try {
    const gardens = await prisma.garden.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(gardens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create garden (Admin & Manager)
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const data = req.body;
    // ensure dates are valid
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const garden = await prisma.garden.create({ data });
    res.status(201).json(garden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single garden
router.get('/:id', authenticate, async (req, res) => {
  try {
    const garden = await prisma.garden.findUnique({
      where: { id: req.params.id },
      include: { expenses: true, harvests: true, sales: true }
    });
    if (!garden) return res.status(404).json({ error: 'Garden not found' });
    res.json(garden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update garden (Admin & Manager)
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const data = req.body;
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const garden = await prisma.garden.update({
      where: { id: req.params.id },
      data
    });
    res.json(garden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete garden (Admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.garden.delete({ where: { id: req.params.id } });
    res.json({ message: 'Garden deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
