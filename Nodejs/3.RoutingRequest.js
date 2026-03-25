const http = require('http');

const server = http.createServer((req, res)=>{
    console.log('resresresres', {req,res})
    if(req.url === '/'){
        res.write(`<h1>This is home page</h1>`);
        res.end();
    } else if(req.url.toLocaleLowerCase() === '/products'){
        res.write(`<h1>This is Products page</h1>`)
        res.write(`<h1>This is Products page</h1>`)
        res.write(`<h1>This is Products page</h1>`)
        res.end();
    } else if(req.url.toLocaleLowerCase() === '/about-us') {
        res.write(`<h1>This is About page</h1>`)
        res.end();
    } else{
        res.write(`<h1>This is Default page</h1>`)
        res.end();
    }
    
})

const PORT = 8000;

server.listen(PORT,()=>{
    console.log(`My server Port is: http://localhost:${PORT}`)
})