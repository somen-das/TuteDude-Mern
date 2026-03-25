// D:\SOMEN\Self Practice\Nodejs\10.MongoDB_schema\controller\controler.js
const Todo = require('../models/todoModel'); // ১. আমাদের বানানো মডেলটাকে ডেকে আনলাম

// ==========================================
// ১. GET Data (সব ডেটা পড়ে আনা)
// ==========================================
const getData = async (req, res) => {
    try {
        // ম্যাজিক ১: fs.readFile এর বদলে মাত্র ১ লাইনে সব ডেটা হাজির!
        const allData = await Todo.find(); 
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// ==========================================
// ২. POST Data (নতুন ডেটা সেভ করা)
// ==========================================
const postData = async (req, res) => {
    try {
        const newTaskAdd = req.body;
        newTaskAdd.id = Date.now(); // আগের মতোই ইউনিক আইডি দিলাম

        // ম্যাজিক ২: ডেটাবেসে সেভ করার জন্য মাত্র ১ লাইন!
        await Todo.create(newTaskAdd); 
        
        // মোট কয়টা ডেটা আছে সেটা গোনার মেথড
        const totalCount = await Todo.countDocuments();

        res.status(201).json({
            message: `Task Created successfully in MongoDB! 🚀`,
            totalData: totalCount
        });
    } catch (error) {
        // যদি ফ্রন্টএন্ড থেকে কেউ ভুল ডেটা পাঠায়, Schema তাকে এখানেই আটকে দিয়ে এরর দেখাবে!
        console.log('error', error)
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// ৩. EDIT Data (PUT - ডেটা আপডেট করা)
// ==========================================
const editData = async (req, res) => {
    try {
        const targetId = Number(req.query.id);
        const reqEditData = req.body;

        // ম্যাজিক ৩: খুঁজে বের করে আপডেট করার জন্য ১ লাইন!
        // findOneAndUpdate(কাকে খুঁজছি, কী আপডেট করব, {new: true})
        const updatedUser = await Todo.findOneAndUpdate(
            { id: targetId }, 
            reqEditData, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: "Data Updated Successfully in MongoDB!" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

// ==========================================
// ৪. DELETE Data (ডেটা মোছা)
// ==========================================
const deleteData = async (req, res) => {
    try {
        const targetId = Number(req.query.id);

        // ম্যাজিক ৪: ডিলিট করার জন্য ১ লাইন!
        const deletedUser = await Todo.findOneAndDelete({ id: targetId });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User Not Found' });
        }
        res.status(200).json({ message: 'User deleted successfully from MongoDB!' });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

// ==========================================
// ৫. MULTIPLE DELETE (একসাথে অনেক ডেটা মোছা)
// ==========================================
const multipleDeleteData = async (req, res) => {
    try {
        const { ids } = req.body; 
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Please provide an array of IDs" });
        }

        // ম্যাজিক ৫: অ্যারের ভেতরের সব আইডি একবারে ডিলিট করার ব্রহ্মাস্ত্র: $in
        const result = await Todo.deleteMany({ id: { $in: ids } });

        res.status(200).json({ message: `${result.deletedCount} User(s) deleted successfully from MongoDB!` });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

// সবগুলো ফাংশন এক্সপোর্ট করে দিলাম
module.exports = { getData, postData, editData, deleteData, multipleDeleteData };