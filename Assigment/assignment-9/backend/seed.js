const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'mainadmin@yopmail.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    name: 'Security Guard frontdesk',
    email: 'security@yopmail.com',
    password: 'password123',
    role: 'Security'
  },
  {
    name: 'Baishali',
    email: 'baishali.host@yopmail.com',
    password: 'password123',
    role: 'Employee',
    department: 'HR'
  },
  {
    name: 'Somen',
    email: 'somen.host@yopmail.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineer'
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
