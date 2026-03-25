//D:\SOMEN\Self Practice\Nodejs\9.MVC_Structure_backend\server.js

const express = require('express');
const cors = require('cors');
const PORT = 3000;
const routes = require('./Routes/todoRoutes')
const app = express();

app.use(cors()); // now enable for all ports

app.use(express.json());  // now every time after create not to declere the file type

app.use('/', routes);

app.listen(PORT, ()=>{
    console.log(`My server is running ports on rock on: http://localhost${PORT}`)
})