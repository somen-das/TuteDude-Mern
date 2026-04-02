import http from 'http';

const server = http.createServer((req,res)=>{
    // req Details
    // console.log(req.url);
    // console.log(req.method);
    // console.log(req.headers);


    //res
    // res.setHeader('content-type', 'json')
    res.setHeader('content-type', 'text/html')
    // res.write('<h1>Hi I am Somen</h1>')
    res.write(
        `
        <html>
            <head>
                <title>NodeJs</title>
            </head>
            <body>
                <h1>Hi My self Somen Das</h1>
            </body>
        </html>
        `
    )


    //Exiting out of event loop (stop event loop)
    // process.exit()
})

const PORT = 8000;

server.listen(PORT, ()=>{
    console.log(`My server running on http://localhost:${PORT} Port`)
})


// Http methods ===> {GET, POST, PUT(For Edit), PATCH(For Edit), DELETE }

// http Status Code ==> {
// Informational responses (100 – 199)
// Successful responses (200 – 299)
// Redirection messages (300 – 399)
// Client error responses (400 – 499)
// Server error responses (500 – 599)
// }