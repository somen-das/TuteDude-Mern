const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res)=>{
    const {url,method} = req;
    // console.log('my url and method:', {method, url});

    if(url === '/todo-data-get' && method === 'GET'){
        fs.readFile('new-todo-data.json', 'utf8', (err, data)=>{
            if(err && !data){
                fs.writeFile('new-todo-data.json', JSON.stringify([], null, 2), (err)=>{
                    if(err){
                        res.writeHead(500, {'Content-Type':'text/plain'})
                        res.end('internal server error')
                        return;
                    }
                    res.writeHead(204, {'Content-Type':'text/plain'});
                    res.end();
                    return;
                })
            } else if(data){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data)
                return;
            }
        })
    } else if(url === '/todo-data-post' && method === 'POST'){
        let newdata = '';
        
        req.on('data', (commingData)=>{
            newdata += commingData.toString();
        })

        req.on('end', ()=>{
            try{
                const recivedData = JSON.parse(newdata);
                // console.log('recivedDatarecivedData',recivedData)
                fs.readFile('new-todo-data.json', 'utf8', (err, data)=>{
                    let newSetdata = [];
                    let uniqueId = ''
                    if(!err && data){
                        newSetdata = JSON.parse(data);
                    }
                    recivedData.id = Date.now();
                    newSetdata.push(recivedData);
                    
                    fs.writeFile('new-todo-data.json', JSON.stringify(newSetdata, null, 2), (writeErr)=>{
                        if(writeErr){
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: "Error saving file" }));
                            return;
                        }

                        res.writeHead(200, {'Content-type':'application/json'})
                        res.end(JSON.stringify({
                            message: "data added successfully",
                            totatData:newSetdata.length
                        }))
                        return;
                    })
                })
            } catch(error){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        })


    } else if(url.startsWith('/todo-data-edit') && method === 'PUT'){
        const mainUrl = `http://${req.headers.host}${url}`;
        const fullUrl = new URL(mainUrl)
        const targetId =  fullUrl.searchParams.get('id');
        const targetName =  fullUrl.searchParams.get('name');
        const targetRole =  fullUrl.searchParams.get('role');
        const targetAge =  fullUrl.searchParams.get('age');

        let newData = '';
        req.on('data', (commingdata)=>{
            newData += commingdata.toString();
        })

        req.on('end', ()=>{
            try{
                const parsedNewData = JSON.parse(newData);
                fs.readFile('new-todo-data.json', 'utf8', (err, data)=>{
            if(err){
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "File not found!" }));
                return;
            }
            
            const allData = JSON.parse(data);
            const userIndex = allData.findIndex(res => res.id === Number(targetId));
                    
            if (userIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "User not found!" }));
                    return;
                }

                allData[userIndex].name = parsedNewData.name ? parsedNewData.name : allData[userIndex].name;
                allData[userIndex].role = parsedNewData.role ? parsedNewData.role : allData[userIndex].role;
                allData[userIndex].age = parsedNewData.age ? parsedNewData.age : allData[userIndex].age;


            fs.writeFile('new-todo-data.json', JSON.stringify(allData, null, 2), (writeErr) => {
                    if (writeErr) {
                      res.writeHead(500, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ error: "Error saving updated file" }));
                      return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "User Update successfully!" }));
                  });
        })
            } catch(error){
                 res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        })

        // if(!targetId){
        //     res.writeHead(400, {'Content-Type':'application/json'});
        //     res.end(JSON.stringify({ error: "Please provide an ID in the URL" }));
        //     return;
        // }
        
        // fs.readFile('new-todo-data.json', 'utf8', (err, data)=>{
        //     if(err){
        //         res.writeHead(404, { 'Content-Type': 'application/json' });
        //         res.end(JSON.stringify({ error: "File not found!" }));
        //         return;
        //     }
            
        //     const allData = JSON.parse(data);
        //     const recentLength = allData.length;
        //     const userIndex = allData.findIndex(res => res.id === Number(targetId));
                    
        //     if (userIndex === -1) {
        //             res.writeHead(404, { 'Content-Type': 'application/json' });
        //             res.end(JSON.stringify({ error: "User not found!" }));
        //             return;
        //         }

        //         allData[userIndex].name = targetName ? targetName : allData[userIndex].name;
        //         allData[userIndex].role = targetRole ? targetRole : allData[userIndex].role;
        //         allData[userIndex].age = targetAge ? targetAge : allData[userIndex].age;


        //     fs.writeFile('new-todo-data.json', JSON.stringify(allData, null, 2), (writeErr) => {
        //             if (writeErr) {
        //               res.writeHead(500, { 'Content-Type': 'application/json' });
        //               res.end(JSON.stringify({ error: "Error saving updated file" }));
        //               return;
        //             }
        //             res.writeHead(200, { 'Content-Type': 'application/json' });
        //             res.end(JSON.stringify({ message: "User Update successfully!" }));
        //           });
        // })


    }else if(url.startsWith('/todo-data-delete') && method === 'DELETE'){
        const mainUrl = `http://${req.headers.host}${url}`;
        const fullUrl = new URL(mainUrl)
        const targetId =  fullUrl.searchParams.get('id');
        // console.log('mainUrl===>', {mainUrl, fullUrl, targetId});

        if(!targetId){
            res.writeHead(400, {'Context-Type':'application/json'});
            res.end(JSON.stringify({ error: "Please provide an ID in the URL" }));
            return;
        }

        fs.readFile('new-todo-data.json', 'utf8', (err, data)=>{
            if(err){
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "File not found!" }));
                return;
            }

            const allData = JSON.parse(data);
            const recentLength = allData.length;
            
            const filterAllData = allData.filter(res=> res.id !== Number(targetId));
            console.log('filterAllData', filterAllData);

            if (recentLength === filterAllData.length) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "User not found with this ID!" }));
                return;
            }

            fs.writeFile('new-todo-data.json', JSON.stringify(filterAllData, null, 2), (writeErr) => {
                    if (writeErr) {
                      res.writeHead(500, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ error: "Error saving updated file" }));
                      return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "User deleted successfully!" }));
                  });
        })

    } else{
        res.writeHead(404, {'content-disposition-Type': 'plain/text'})
        res.end('This is a Wrong route! :(')
    }

})




const PORT = 3000;

server.listen(PORT, ()=>{
    console.log(`My server is running PORT is : http://localhost:${PORT}`);
})
