//D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\router\authRoutes.js
const express = require('express');
const {signupUser, loginUser} = require('../controller/authController');
const {seedData, getData, postData, editData, deleteData, multipleDataDelete, uploadFiles, smartUploadFiles} = require('../controller/userController');
const {authCheck} = require('../middleware/authMiddleWare')

const upload = require('../middleware/uploadMiddleware');
const uploadSmart = require('../middleware/reduceFileUpload')

const router = express.Router();

router.post('/user-signup', signupUser);
router.post('/user-login', loginUser);
router.post('/my-profile', authCheck, (req, res) => {
    res.status(200).json({
        message: "Welcome to your Secret Profile! ",
        user_info: req.user 
    });
});

router.post('/seedData', seedData)
router.get('/get-advance-data', getData);
router.post('/post-advance-data', postData);
router.delete('/delete-advance-data', deleteData);
router.put('/edit-advance-data', editData);
router.delete('/multipleDelete-advance-data', multipleDataDelete);

//image upload
router.post('/upload-test', upload.single('profilePic'), uploadFiles);

// image reduce then upload
router.post('/upload-smart', uploadSmart.single('profilePic'), smartUploadFiles)

module.exports = router;