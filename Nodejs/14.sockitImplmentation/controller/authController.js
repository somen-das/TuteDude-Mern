//D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\controller\authController.js
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendWelcomeEmail = require('../utils/sendEmail');

const signupUser = async (req, res)=>{
    try{
        
        const userData = req.body;
        console.log('try', userData)
        userData.id = Date.now();
        console.log(Date.now())
        const {name, email, password, role} = req.body;
        const findUser = await UserModel.findOne({email});
        if (findUser){
            res.status(203).json({
                message:`User Is alredy registred by ${findUser.email} mail`
            })
            return
        } 
        
        const hasedpassword = await bcrypt.hash(password, 10);
        userData.password = hasedpassword;
        await UserModel.create(userData)
        await sendWelcomeEmail(email, name);
        res.status(200).json({
            message:`User created Successfully and email sent!`
        })
    } catch(error){
        console.log('catch')
        res.status(500).json({
            message:`Server Error`,
            error: error.message
        })
    }
}

const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body;
        const findUser = await UserModel.findOne({email});

        if(!findUser){
            res.status(404).json({message:`user not fount`})
            return
        }
        const passwordChecked = await bcrypt.compare(password, findUser.password)

    if(passwordChecked){
        const token = jwt.sign(
            { id: findUser.id, role: findUser.role, email:findUser.email, name:findUser.name,},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            message:`User login succesfully`,
            authToken:token           
        })
        return
    } else {
        res.status(401).json({
            message:`Password Not match`
        })
    return
    }
    } catch(error){

    }
}



module.exports = {signupUser, loginUser}