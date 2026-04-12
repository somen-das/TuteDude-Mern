const express = require('express');
const router = express.Router();
const { registerVisitor, loginUser, appointmentVisitor, appointmentVisitorGet, getVisitors, getHosts } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerVisitorSchema, loginSchema, appointmentVisitorSchema } = require('../validators/schemas');

router.post('/register', validate(registerVisitorSchema), registerVisitor);
router.post('/login', validate(loginSchema), loginUser);
router.post('/appointment', validate(appointmentVisitorSchema), appointmentVisitor);
router.post('/visitor-appointments', appointmentVisitorGet);
router.get('/hosts', getHosts);
// router.get('/', protect, getVisitors);

module.exports = router;
