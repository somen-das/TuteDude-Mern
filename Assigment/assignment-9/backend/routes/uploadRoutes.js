const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png)!'));
    }
  }
});

router.post('/', protect, upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
