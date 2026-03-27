const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create Admin User
  const password = await bcrypt.hash('9805994378', 10);
  const admin = await prisma.user.upsert({
    where: { email: '9805994378' },
    update: {},
    create: {
      name: 'Super Admin',
      email: '9805994378',
      password,
      role: 'ADMIN',
    },
  });

  // 2. Create Gardens
  const garden1 = await prisma.garden.create({
    data: {
      name: 'Sunrise Orchard', location: 'Biratnagar', ownerName: 'Ramesh Sharma', ownerContact: '9840000000', leaseAmount: 50000,
      startDate: new Date('2025-01-01'), endDate: new Date('2026-01-01'), treeCount: 150, variety: 'Maldah', notes: 'Premium quality'
    }
  });

  const garden2 = await prisma.garden.create({
    data: {
      name: 'Himalayan Greens', location: 'Janakpur', ownerName: 'Sita Ram', ownerContact: '9840000001', leaseAmount: 75000,
      startDate: new Date('2025-02-01'), endDate: new Date('2026-02-01'), treeCount: 200, variety: 'Dasheri', notes: 'High yield potential'
    }
  });

  // 3. Create Suppliers
  const supplier = await prisma.supplier.create({
    data: { name: 'Agrovet Nepal', contact: '014111222', type: 'Pesticide & Fertilizer' }
  });

  // 4. Create Expenses
  await prisma.expense.create({
    data: { 
      gardenId: garden1.id, supplierId: supplier.id, type: 'Pesticide', 
      cost: 15000, date: new Date('2025-03-10'), notes: 'Spring spray'
    }
  });

  // 5. Create Harvests
  await prisma.harvest.create({
    data: {
      gardenId: garden1.id, quantity: 5000, laborCost: 12000, date: new Date('2025-06-15'), notes: 'First batch'
    }
  });

  // 6. Create Sales
  await prisma.sale.create({
    data: {
      buyerName: 'Fresh Fruits Kathmandu', location: 'Kathmandu', gardenId: garden1.id,
      quantity: 5000, pricePerUnit: 60, transportCost: 20000, date: new Date('2025-06-16')
    }
  });

  console.log('Seeding Completed Successfully!');
  console.log('Login credentials: ID: 9805994378 / PASS: 9805994378');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
