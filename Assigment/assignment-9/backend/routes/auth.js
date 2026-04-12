const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, editUser, deleteUser, editSingleUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerUserSchema, loginSchema } = require('../validators/schemas');

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/users', protect, authorize('Admin'), getUsers);
router.put('/users/:id', protect, authorize('Admin'), editUser);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);
router.put('/edit/:id', editSingleUser);

module.exports = router;
