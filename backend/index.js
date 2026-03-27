const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/gardens', require('./src/routes/gardens'));
app.use('/api/expenses', require('./src/routes/expenses'));
app.use('/api/suppliers', require('./src/routes/suppliers'));
app.use('/api/harvests', require('./src/routes/harvests'));
app.use('/api/sales', require('./src/routes/sales'));
app.use('/api/dashboard', require('./src/routes/dashboard'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
