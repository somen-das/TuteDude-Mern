const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { type: String, enum: ['Not Checked In', 'Checked In', 'Checked Out'], default: 'Not Checked In' }
}, { timestamps: true });

module.exports = mongoose.model('CheckLog', checkLogSchema);
