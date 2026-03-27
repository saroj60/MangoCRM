const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/stats', authenticate, async (req, res) => {
  try {
    // Basic Counts
    const totalGardens = await prisma.garden.count();
    
    // Total Expenses
    const expenses = await prisma.expense.aggregate({ _sum: { cost: true } });
    const totalExpenses = expenses._sum.cost || 0;

    // Total Harvest Quantity
    const harvests = await prisma.harvest.aggregate({ _sum: { quantity: true, laborCost: true } });
    const totalHarvestQuantity = harvests._sum.quantity || 0;
    const totalHarvestLaborCost = harvests._sum.laborCost || 0;

    // Total Revenue (Quantity * Price) - Transport Cost
    const allSales = await prisma.sale.findMany();
    let totalRevenue = 0;
    allSales.forEach(sale => {
      totalRevenue += (sale.quantity * sale.pricePerUnit) - sale.transportCost;
    });

    const netProfit = totalRevenue - (totalExpenses + totalHarvestLaborCost);

    // Profit by Garden
    const gardens = await prisma.garden.findMany({
      include: { expenses: true, sales: true, harvests: true }
    });

    const profitByGarden = gardens.map(g => {
      const gExpenses = g.expenses.reduce((sum, e) => sum + e.cost, 0);
      const gLabor = g.harvests.reduce((sum, h) => sum + h.laborCost, 0);
      const gRevenue = g.sales.reduce((sum, s) => sum + ((s.quantity * s.pricePerUnit) - s.transportCost), 0);
      return {
        id: g.id,
        name: g.name,
        revenue: gRevenue,
        expenses: gExpenses + gLabor,
        profit: gRevenue - (gExpenses + gLabor)
      };
    });

    res.json({
      totalGardens,
      totalExpenses: totalExpenses + totalHarvestLaborCost, // Combine all costs
      totalHarvestQuantity,
      totalRevenue,
      netProfit,
      profitByGarden
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
