const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    name: 'Security Guard frontdesk',
    email: 'security@example.com',
    password: 'password123',
    role: 'Security'
  },
  {
    name: 'Jane Doe',
    email: 'jane.host@example.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await User.deleteMany();
    for (const u of users) {
      await User.create(u);
    }
    console.log('Users Seeded Successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
