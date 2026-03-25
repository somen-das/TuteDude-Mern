// D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\models\userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "name is Required"],
    },
    email:{
        type:String,
        required:[true, 'Email field is required'],
        unique: [true, "This email is already Taken"]
    },
    password:{
        type:String,
        required:[true, 'Passsword field is required']
    },
    role:{
        type:String,
        default: 'user'
    },
    id:{
        type:String,
        unique:true
    }
},
{timestamps:true});

const UserModel = mongoose.model('UserModel', userSchema)

module.exports = UserModel;