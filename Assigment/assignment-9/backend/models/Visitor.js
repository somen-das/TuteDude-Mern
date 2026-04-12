const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {v4: uuidv4 } = require('uuid');
const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Visitor'], default: 'Visitor' },
  company: { type: String },
  photoUrl: { type: String },
  // _id: { type: String, default: uuidv4, unique: true }
}, { timestamps: true });


visitorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Visitor', visitorSchema);
