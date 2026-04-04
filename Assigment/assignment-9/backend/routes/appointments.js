const express = require('express');
const router = express.Router();
const { getAppointments, updateAppointmentStatus, scanQR, getLogs } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAppointments);
router.put('/:id', protect, authorize('Employee', 'Admin'), updateAppointmentStatus);
router.post('/scan', protect, authorize('Security', 'Admin'), scanQR);
router.get('/logs', protect, authorize('Admin', 'Security'), getLogs);

module.exports = router;
