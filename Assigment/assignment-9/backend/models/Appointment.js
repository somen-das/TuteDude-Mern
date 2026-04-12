const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  purpose: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  passId: { type: String, unique: true, sparse: true },
  pdfPassId: { type: String, sparse: true, unique: true, },
  photoUrl: { type: String },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  checkStatus: { type: String, enum: ['Not Checked In', 'Checked In', 'Checked Out'], default: 'Not Checked In' } 
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
