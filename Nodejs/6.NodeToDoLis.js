const http = require('http');

const server = http.createServer((req,res)=>{

})


const PORT = 8000;
server.listen(PORT, ()=>{
    console.log(`My server start in port: ${PORT}`)
})