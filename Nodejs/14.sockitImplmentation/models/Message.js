// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true }); // timestamps দিলে কখন মেসেজ পাঠিয়েছে সেই সময়টা অটো সেভ হবে

module.exports = mongoose.model('Message', messageSchema);