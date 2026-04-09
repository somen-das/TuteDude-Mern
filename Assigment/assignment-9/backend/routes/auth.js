const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerUserSchema, loginSchema } = require('../validators/schemas');

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/users', protect, authorize('Admin'), getUsers);

module.exports = router;
