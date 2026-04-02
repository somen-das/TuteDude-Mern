
const express = require('express');
const cors = require('cors');
const PORT = 3000;
const routes = require('./Routes/todoRoutes')
const app = express();

app.use(cors()); 

app.use(express.json());  

app.use('/', routes);

app.listen(PORT, ()=>{
    console.log(`My server is running ports on rock on: http://localhost${PORT}`)
})