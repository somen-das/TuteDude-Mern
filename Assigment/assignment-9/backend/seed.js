const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Visitor = require('./models/Visitor');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'mainadmin@yopmail.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    name: 'Security Guard',
    email: 'security@yopmail.com',
    password: 'password123',
    role: 'Security'
  }
];

for (let i = 1; i <= 8; i++) {
  users.push({
    name: `Employee ${i}`,
    email: `employee${i}@yopmail.com`,
    password: 'password123',
    role: 'Employee',
    department: i % 2 === 0 ? 'HR' : 'Engineering'
  });
}


const visitors = [];

for (let i = 1; i <= 30; i++) {
  visitors.push({
    name: `Visitor ${i}`,
    email: `visitor${i}@yopmail.com`,
    password: 'password123',
    phone: `98765432${(i + '').padStart(2, '0')}`,
    company: i % 2 === 0 ? 'TCS' : 'Infosys',
    photoUrl: 'https://res.cloudinary.com/dwysh6bvr/image/upload/v1775825615/visitor_passes/czciecopau7opagozdq8.jpg'
  });
}


mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    await User.deleteMany();
    await Visitor.deleteMany();

    for (const u of users) {
      await User.create(u);
    }

    for (const v of visitors) {
      await Visitor.create(v);
    }

    console.log('Our Users & Visitors added Successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });