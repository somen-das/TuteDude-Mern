const express = require('express');
const router = express.Router();
const { getAppointments, updateAppointmentStatus, scanQR, getLogs, downloadPass, deleteAppointment, getAppointmentsSearch,getAppointmentsFilter, getAppointmentsExport } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { updateAppointmentSchema } = require('../validators/schemas');

router.get('/', protect, getAppointments);
router.put('/:id', protect, authorize('Employee', 'Admin'), validate(updateAppointmentSchema), updateAppointmentStatus);
router.post('/scan', protect, authorize('Security', 'Admin'), scanQR);
router.get('/logs', protect, authorize('Admin', 'Security'), getLogs);
router.get('/download-pass/:pdfPassId', downloadPass);
router.delete('/:id',  deleteAppointment);
router.get('/search', protect, getAppointmentsSearch);
router.get('/filter', protect, getAppointmentsFilter);
router.get('/export', protect, getAppointmentsExport);

module.exports = router;
