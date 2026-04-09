const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const visitorRoutes = require('./routes/visitors');
const appointmentRoutes = require('./routes/appointments');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/uploadRoutes');
const badgeRoutes = require('./routes/badgeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/badges', badgeRoutes);

if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
