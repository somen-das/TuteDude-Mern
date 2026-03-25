// D:\SOMEN\Self Practice\Nodejs\10.MongoDBConnect\models\todoModel.js

const mongoose = require('mongoose');

// ১. Schema তৈরি (আমাদের ডেটার কড়া নিয়মকানুন)
const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lala name field is empty'], // required: true মানে ফ্রন্টএন্ড থেকে নাম পাঠাতেই হবে, নাহলে এরর দেবে!
        minLength:3,
        maxlength:18,
        match: [/^[a-zA-Z\s]+$/, "নামের মধ্যে কোনো স্পেশাল ক্যারেক্টার বা সংখ্যা (@, #, 123) দেওয়া যাবে না!"],
        validate: {
        validator: function(value) {
            // যদি নামের ভেতর admin লেখা থাকে, তাহলে false (আটকে দেবে)
            return !value.toLowerCase().includes('admin');
        },
        message: "খবরদার! নামের ভেতর 'admin' শব্দ ব্যবহার করা নিষেধ!"
    }
    },
    role: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: [true, 'Lala age field is empty']
    },
    id: {
        type: Number,
        required: true,
        unique: true // unique: true মানে পৃথিবীতে এই id আর দ্বিতীয় কারও হবে না!
    }
}, { 
    timestamps: true // ম্যাজিক! এটা দিলে MongoDB নিজে থেকেই কখন ডেটা সেভ হলো (createdAt) তা লিখে রাখবে।
});

// ২. Model তৈরি (এই Model হলো গার্ডের ম্যানেজার, একে দিয়েই আমরা ডেটাবেসে কাজ করব)
// 'Todo' হলো আপনার কালেকশনের নাম (MongoDB অটোমেটিক এটাকে বহুবচন করে 'todos' বানিয়ে নেবে)
const Todo = mongoose.model('Todo', todoSchema);

// ৩. Model টাকে এক্সপোর্ট করে দিলাম, যাতে কন্ট্রোলারে ব্যবহার করতে পারি
module.exports = Todo;