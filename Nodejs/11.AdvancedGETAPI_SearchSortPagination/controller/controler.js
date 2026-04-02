//D:\SOMEN\Self Practice\Nodejs\11.AdvancedGETAPI_SearchSortPagination\controller\controler.js
const express = require('express');
const mongoose = require('mongoose');
const GetAdvanceModel = require('../models/advanceGetModel');


const seedData = async (req, res) => {
    try {
        const dummyUsers = [
            { name: "Somen Das", role: "Frontend Developer", age: 28, id: 101 },
            { name: "Rahul Sharma", role: "Backend Developer", age: 25, id: 102 },
            { name: "Amit Roy", role: "UI UX Designer", age: 22, id: 103 },
            { name: "Priya Saha", role: "Frontend Developer", age: 26, id: 104 },
            { name: "Bikram Sen", role: "Project Manager", age: 35, id: 105 },
            { name: "Neha Gupta", role: "QA Engineer", age: 24, id: 106 },
            { name: "Aman Verma", role: "Full Stack Developer", age: 29, id: 107 },
            { name: "Sneha Das", role: "Backend Developer", age: 27, id: 108 },
            { name: "Rohan Paul", role: "DevOps Engineer", age: 31, id: 109 },
            { name: "Kiran Ray", role: "Frontend Developer", age: 23, id: 110 },
            { name: "Suman Ghosh", role: "Data Scientist", age: 30, id: 111 },
            { name: "Pooja Das", role: "UI UX Designer", age: 25, id: 112 },
            { name: "Arif Khan", role: "Backend Developer", age: 28, id: 113 },
            { name: "Tanmoy", role: "Frontend Developer", age: 21, id: 114 },
            { name: "Aditi", role: "HR Manager", age: 32, id: 115 }
        ];

        await GetAdvanceModel.insertMany(dummyUsers);
        res.status(201).json({ message: "15 Dummy Users Inserted Successfully! 🚀" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// const getData = async (req, res)=>{
//     try{
//         const data = await GetAdvanceModel.find();
//         console.log(data);
//         res.status(200).json(data);
//     } catch(error){
//         console.log('Get APi try', error.message);
//         res.status(500).json({
//             error: `Server Error ${error.message}`
//         })
//     }
// }

const getData = async (req, res) => {
    try {
        const { search, sort, limit=5 } = req.query;
        const page = Number(req.query.page) || 1
        const dataLimit = Number(limit);
        const skipdata = (page-1) * dataLimit;
        let queryObject = {};

        if (search) {
            // queryObject.name = { $regex: search, $options: 'i' };
            queryObject = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } }
                ]
            };
            const searchNumber = Number(search); 

            if (!isNaN(searchNumber)) {
                queryObject.$or.push({ age: searchNumber });
            }
        }
        const totalDbDataCount = await GetAdvanceModel.countDocuments(queryObject);
        const apiData =  GetAdvanceModel.find(queryObject);
        if(sort){
            const sortData = sort.split(',').join(' ');
            apiData.sort(sortData);
        }

        const data = await apiData.skip(skipdata).limit(dataLimit);
        res.status(200).json({
            totalData: totalDbDataCount,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            error: `Server Errorsss ${error.message}`
        });
    }
}

const postData = async (req, res)=>{
    try{
        // console.log('post api try');
        const newAddData = req.body;
        newAddData.id = Date.now();
        await GetAdvanceModel.create(newAddData);
        const totalCount = await GetAdvanceModel.countDocuments();
        res.status(201).json({
            message: `Task Created successfully in MongoDB! 🚀`,
            totalData: totalCount
        })
    } catch(error){
        res.status(500).json({error:`server error ${error.message}`})
    }
}

const editData = async (req, res) =>{
    try{
        const targetId = req.query.id;
        const reqEdirData = req.body;

        const updateUser = await GetAdvanceModel.findOneAndUpdate(
            {id: targetId},
            reqEdirData,
            { new: true, runValidators: true }
        )
        if(!updateUser){
            res.status(404).json({
                message: `User not found`
            })
        }
        res.status(200).json({ message: "Data Updated Successfully in MongoDB!" });
    } catch(error){
        res.status(500).json({
            message: `Server error ${error.message}`
        })
    }
}

const deleteData = async (req, res)=>{
    try{
        const targetId = req.query.id;

        const deleteUser = await GetAdvanceModel.findOneAndDelete(
            {id:targetId}
        )

        if(!deleteUser){
            res.status(404).json({message: `User Not Fount`})
        }

        res.status(200).json({message:`User Delete Successfully`})

    } catch(error){
        res.status(500).json({
            message: `Server error ${error.message}`
        })
    }
}

const multipleDataDelete = async (req, res)=>{
    try{
        const deleteUsersId = req.body.ids;
        console.log(deleteUsersId);
        
        if (!deleteUsersId || deleteUsersId.length <= 0){
            res.status(404).json({messsage: `Users not found`})
        }
        const multipleDelete = await GetAdvanceModel.deleteMany(
                {id : {$in:deleteUsersId}}
        )
        res.status(200).json({ message: `${multipleDelete.deletedCount} User(s) deleted successfully from MongoDB!` });

    } catch(error){
        res.status(500).json({
            error: `Server Error ${error.message}`
        })
    }
}



module.exports = {seedData, getData, postData, editData, deleteData, multipleDataDelete};
