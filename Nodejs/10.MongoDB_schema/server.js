//D:\SOMEN\Self Practice\Nodejs\10.MongoDBConnect\server.js

const express = require('express');
const cors = require('cors');
const routes = require('./router/routes.js')
const mongoose = require('mongoose');
require('dotenv').config();  // eta amra tokhon use kori jokhon node version 20 er niche and env theke data tante hoy tokhon

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use('/',routes);

mongoose.connect(process.env.MONGO_DB_URL)
.then(()=>{
    console.log(`Database Connected successfully`);
    app.listen(PORT, ()=>{
        `My 1st MongoDB connected server start port on: http://localhost:${PORT}`
    });

}) .catch((error)=>{
    console.log(`DataBase Connection Failed:`, error);
})
