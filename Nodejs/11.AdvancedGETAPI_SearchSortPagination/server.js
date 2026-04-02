// D:\SOMEN\Self Practice\Nodejs\11.AdvancedGETAPI_SearchSortPagination\server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./router/routes');
require('dotenv').config();
const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());


// middleware for testing start
const requestLogger = (req, res, next)=>{
    const time = new Date().toLocaleString();
    const apiHitMethod = req.method;
    const hitUrl = req.url;
    next();
}

// app.use(requestLogger);
// middleware for testing end

app.use('/', routes);

mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
            console.log(`Database Connected successfully`);
            app.listen(PORT, ()=>{
                console.log(`Server connect port on: http://localhost:${PORT}`)
            })
        }
    )
    .catch((error)=>{
        console.log(`Database connection Failed: ${error}`)
    })

