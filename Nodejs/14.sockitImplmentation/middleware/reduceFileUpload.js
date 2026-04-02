// /middlewares/uploadMiddleware.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

//  Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Storage Setup: Cloudinary te memory ram e save hobe reduce houya porjonto
const storage = multer.memoryStorage();

// Multer
const upload = multer({ storage: storage });

module.exports = upload;