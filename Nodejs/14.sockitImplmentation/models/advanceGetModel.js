// D:\SOMEN\Self Practice\Nodejs\11.AdvancedGETAPI_SearchSortPagination\models\advanceGetModel.js
const mongoose = require('mongoose');

const getAdvanceApiSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Name field is required'],
        minlength:3,
        maxLength:18,
        validate: {
            validator: (value)=>{
                return !value.toLowerCase().includes('admin')
            },
            message: 'admin name is Confidential use another name'
        }
    },
    age:{
        type: Number,
        required:[true, 'Age field is required']
    },
    role:{
        type: String,
        required: [true, 'Role is required']
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
}, 
{timestamps: true}
);

const GetAdvanceApi = mongoose.model('GetAdvanceModel', getAdvanceApiSchema)

module.exports = GetAdvanceApi;