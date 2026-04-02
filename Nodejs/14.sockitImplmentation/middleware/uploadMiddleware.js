// /middlewares/uploadMiddleware.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
//  Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Storage Setup: Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'User_Management_Profiles', // Cloudinary te ei name er folder er moddhe sob upload hobe
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], //only image extentionsa
    transformation: [{ width: 500, height: 500, crop: 'limit' }], 
  },
});

//  Multer storage korlo
const upload = multer({ storage: storage });

module.exports = upload;