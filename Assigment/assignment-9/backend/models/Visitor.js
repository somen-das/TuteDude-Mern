const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: { type: String },
  photoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
