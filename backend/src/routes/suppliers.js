const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all suppliers
router.get('/', authenticate, async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create supplier
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const supplier = await prisma.supplier.create({ data: req.body });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete supplier (Admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
