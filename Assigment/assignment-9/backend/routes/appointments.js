const express = require('express');
const router = express.Router();
const { getAppointments, updateAppointmentStatus, scanQR, getLogs, downloadPass, deleteAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { updateAppointmentSchema } = require('../validators/schemas');

router.get('/', protect, getAppointments);
router.put('/:id', protect, authorize('Employee', 'Admin'), validate(updateAppointmentSchema), updateAppointmentStatus);
router.post('/scan', protect, authorize('Security', 'Admin'), scanQR);
router.get('/logs', protect, authorize('Admin', 'Security'), getLogs);
router.get('/download-pass/:pdfPassId', downloadPass);
router.delete('/:id',  deleteAppointment);

module.exports = router;
