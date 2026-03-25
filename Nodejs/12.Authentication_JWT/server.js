//D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router/authRoutes')
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use('/', router);
const PORT = 3000;

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log(`Database Connected successfully`);
    app.listen(PORT, ()=>{
        console.log(`Data Base Connecturl: http://localhost:${PORT} `)
    })
})
.catch((error)=>{
    console.log(`Data Base Connection failed: ${error}`)
})