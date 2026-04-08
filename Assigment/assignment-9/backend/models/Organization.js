const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  contactEmail: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Organization', orgSchema);
