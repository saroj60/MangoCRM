# Mango Farming CRM

A complete, production-ready web application designed for Mango Farming & Supply Chain Management in Nepal. 

## 🌟 Key Features
- **Authentication**: Role-based (Admin, Manager, Worker) using JWT.
- **Garden Management**: Track leases, locations, tree counts, and varieties.
- **Expenses & Suppliers**: Maintain accurate ledgers for all operational costs.
- **Harvest & Sales**: Track fruit yields and monitor market sales seamlessly.
- **Advanced Dashboard**: Visual profit/loss tracking using Recharts.
- **i18n Localization**: Built-in toggle to switch gracefully between English and Nepali (नेपाली).

## 🗄️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, React Router, Recharts, i18next
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL

---

## 🚀 Setup Instructions

### 1. Database Configuration
You must have PostgreSQL installed and running.
1. Open up `/backend/.env`
2. Update the `DATABASE_URL` with your exact PostgreSQL credentials. For example:
   `postgresql://your_user:your_password@localhost:5432/mango_crm?schema=public`

### 2. Backend Initialization
Open a terminal and sequence these commands:
```bash
cd backend
npm install
# Push the schema definitions to the database
npx prisma db push
# Generate the Prisma client
npx prisma generate
# Seed the database with sample Mango data
node seed.js
# Start the API server (Runs on port 5000)
npm run start
```

### 3. Frontend Initialization
In a separate terminal window:
```bash
cd frontend
npm install
# Start the Vite development server
npm run dev
```

### 4. Admin Access
Once both servers are running, access the web UI via `http://localhost:5173`.
You can sign in using the seeded test account:
- **Email**: admin@mangocrm.com
- **Password**: admin123
