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
}, { timestamps: true });

visitorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

visitorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Visitor', visitorSchema);
