//D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\server.js
const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/Message');

//for sockiet er jonno start 
const http = require('http')
const { Server } = require('socket.io');
//for sockiet er jonno end

const cors = require('cors');
const router = require('./router/authRoutes')
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use('/', router);
const PORT = 3000;

// socket er jonno
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3001", 
        origin: "*", 
        methods: ["GET", "POST"]
    }
});
//  The Socket Connection

io.on('connection', (socket) => {
    console.log(' New User Connected! Socket ID:', socket.id);

    // Frontend theke message shonar jonno 'on'
    socket.on('client_message', (data) => {
        console.log('Frontend theke eseche:', data);

        // Frontend ke reply pathanor jonno 'emit'
        socket.emit('server_message', 'Hello Somen! Socket Connection 100% Successful! 🎉');
    });

    // User ber hoye gele
    socket.on('disconnect', () => {
        console.log(' User Disconnected:', socket.id);
    });
});

io.on('connection', (socket) => {
    console.log('🟢 New User Connected! Socket ID:', socket.id);

    // 🌟 Day 2: WhatsApp Chat Logic
    // ফ্রন্টএন্ড থেকে যখনই কেউ চ্যাট মেসেজ পাঠাবে, সার্ভার সেটা শুনবে
    socket.on('send_chat_message', (messageData) => {
        console.log('New Message Arrived:', messageData);

        // 🌟 The Broadcast Magic (io.emit): 
        // সার্ভার এবার সেই মেসেজটা কানেক্ট থাকা "সবাইকে" পাঠিয়ে দেবে
        io.emit('receive_chat_message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('🔴 User Disconnected:', socket.id);
    });
});

app.get('/get-chat-history', async (req, res) => {
    try {
        // পুরনো সব মেসেজ সময়ের ক্রমানুসারে (oldest first) তুলে আনবে
        const messages = await Message.find().sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// 🌟 ২. সকেটের ভেতরে সেভ করার লজিক
io.on('connection', (socket) => {
    console.log('🟢 New User Connected:', socket.id);

    socket.on('send_chat_message', async (messageData) => {
        try {
            // ক. আগে মেসেজটা MongoDB তে সেভ করবো
            const newMessage = new Message({
                senderId: messageData.senderId,
                text: messageData.text
            });
            await newMessage.save(); // ডেটাবেসে পার্মানেন্ট সেভ হয়ে গেল!

            // খ. সেভ হওয়ার পর সবাইকে (Loudspeaker) পাঠিয়ে দেব
            io.emit('receive_chat_message', newMessage); 
            
        } catch (error) {
            console.log("Message Save Error:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 User Disconnected:', socket.id);
    });
});

// socket end


mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log(`Database Connected successfully`);
    server.listen(PORT, ()=>{
        console.log(`Data Base Connecturl: http://localhost:${PORT} `)
    })
})
.catch((error)=>{
    console.log(`Data Base Connection failed: ${error}`)
})