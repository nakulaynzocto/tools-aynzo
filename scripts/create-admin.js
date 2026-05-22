const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection;

  // Check if admin already exists
  const existing = await db.collection('adminusers').findOne({ email: 'admin@aynzo.com' });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    process.exit(0);
  }

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await db.collection('adminusers').insertOne({
    email: 'admin@aynzo.com',
    passwordHash,
    name: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Admin user created successfully!');
  console.log('Email: admin@aynzo.com');
  console.log('Password: admin123');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
