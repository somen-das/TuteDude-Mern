// D:\SOMEN\Self Practice\Nodejs\9.MVC_Structure_backend\Controller\todoController.js

const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../Data/new-todo-data.json')
// Get/GET logic

const getHomeRoute = (req,res)=>{
    res.send('Hello brother! welcome to my 1st express server ');
}

const getTodos = (req, res)=>{
    fs.readFile(dataFilePath, 'utf8', (err, data)=>{
            if (err || !data){
                return res.status(200).json([]);
            }
            res.status(200).json(JSON.parse(data));
        })
}


// Post/POST logic

const postTodos = (req, res)=>{
const newTaskAdd = req.body;
    newTaskAdd.id = Date.now();

    fs.readFile(dataFilePath, 'utf8', (err, data)=>{
        let allData = [];
        if(!err && data){
            allData = JSON.parse(data);
        }
        allData.push(newTaskAdd);


            fs.writeFile(dataFilePath, JSON.stringify(allData, null, 2), (writeErr)=>{
                if(writeErr){
                    res.status(500).json({error:`Error the file`});
                }
                res.status(200).json({
                    message: `File Created successfully`,
                    totalData: allData.length
                });
            })

    })
}


// Edit/PUT logic

const editTodos = (req, res)=>{
    const fullUrl = `${req.headers.host}${req.url}`;
        const fetchFullUrl = new URL(fullUrl)
        // const targetId = fetchFullUrl.searchParams.get('id')
        const targetId = req.query.id;
        console.log('taegetIdtaegetId', targetId)
        const reqEditData = req.body;

        // console.log('reqEditDatareqEditDatareqEditData', {reqEditData, targetId})
        fs.readFile(dataFilePath, 'utf8', (err, data)=>{
            let allData = JSON.parse(data);
            if(!err && data){
                const findUserIndex = allData.findIndex(res =>
                res.id === Number(targetId) 
                );

                if(findUserIndex == -1){
                    res.status(500).json({
                        message:'user not found'
                    })
                }

                allData[findUserIndex].name = reqEditData.name ? reqEditData.name : allData[findUserIndex].name
                allData[findUserIndex].role = reqEditData.role ? reqEditData.role : allData[findUserIndex].role
                allData[findUserIndex].age = reqEditData.age ? reqEditData.age : allData[findUserIndex].age

                console.log(allData)
                fs.writeFile(dataFilePath, JSON.stringify(allData, null, 2), (writeErr)=>{
                    if(writeErr){
                        return res.status(500).json({
                            error : 'somthing wrong'
                        })
                        
                    }
                    res.status(200).json({
                        message: "Data Update Successfully",
                    })
                })
            }
        })
}


// Delete/DELETE logic

const deleteTodos = (req, res)=>{
    const host = req.headers.host;
        const fullUrl = host+req.url;
        const urlparams = new URL(fullUrl);
        const targetId = urlparams.searchParams.get('id');
        console.log(targetId);

        fs.readFile(dataFilePath, 'utf8', (err, data)=>{
            const allData = JSON.parse(data);
            if(!err && data){
                const findData = allData.find(res=> res.id == targetId)
                const filterData = allData.filter(res => res.id !== Number(targetId) )
                if(findData){
                    fs.writeFile(dataFilePath, JSON.stringify(filterData, null, 2), (err)=>{
                        if(err){
                            res.status(500).json({
                                error:'somethings went wrong'
                            })
                        }
                        res.status(200).json({
                            message: 'User delete successfully',
                            totalUser: filterData.length
                        })
                    })
                }else{
                    res.status(500).json({
                                error:'User Not Found'
                            })
                }
            }
        })
}


// Multiple delete Logic

const multipleDelete = (req, res)=>{
    const { ids } = req.body; 
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Please provide an array of IDs" });
        }

        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err || !data) return res.status(404).json({ error: 'File not found' });

            const allData = JSON.parse(data);
            const initialLength = allData.length;

            const filterData = allData.filter(res => !ids.includes(res.id));

            if (initialLength === filterData.length) {
                return res.status(404).json({ error: 'No matching users found to delete' });
            }

            fs.writeFile(dataFilePath, JSON.stringify(filterData, null, 2), (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ error: 'Something went wrong' });
                }
                res.status(200).json({
                    message: `${initialLength - filterData.length} User(s) deleted successfully`,
                    remainingUsers: filterData.length
                });
            });
        });
}


module.exports = {
getHomeRoute, getTodos, postTodos, editTodos, deleteTodos, multipleDelete
};
