const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const authRoutes = require('./routes/auth');
const visitorRoutes = require('./routes/visitors');
const appointmentRoutes = require('./routes/appointments');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// if any env url is missing then showing error
const envVariables = ['MONGODB_URI','JWT_SECRET','FRONTEND_URL', 'EMAIL_USER', 'EMAIL_PASS', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'CLOUDINARY_CLOUD_NAME']

envVariables.forEach((key)=>{
  if(!process.env[key]){
    console.error(`FATAL ERROR: Missing environment variable: ${key}`);
    process.exit(1);
  }
})

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api', limiter);
app.use(express.json());

// cors only use for my frontend url
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}))


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// my all Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);


// 404 errror  when no route found
app.use((req, res)=>{
  res.status(404).json({message:'No route found'})
})
// error handling
app.use(errorHandler);

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
