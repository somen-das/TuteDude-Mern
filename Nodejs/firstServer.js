// creating a first Node Sarver


// import http protocal
const http = require('http');

// function aSimpleServer(req, res){
//     console.log(req);
// }

const app = http.createServer((req, res)=>{
    console.log(req);
});


// port num
const PORT = 8000
app.listen(PORT, ()=>{
    console.log(`my server port is running ${PORT}`)
});