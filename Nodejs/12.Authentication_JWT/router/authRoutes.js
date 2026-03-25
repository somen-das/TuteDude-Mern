//D:\SOMEN\Self Practice\Nodejs\12.Authentication_JWT\router\authRoutes.js
const express = require('express');

const {signupUser, loginUser} = require('../controller/authController');
const {authCheck} = require('../middleware/authMiddleWare')

const router = express.Router();

router.post('/user-signup', signupUser);
router.post('/user-login', loginUser);
router.post('/my-profile', authCheck, (req, res) => {
    res.status(200).json({
        message: "Welcome to your Secret Profile! 🎉",
        user_info: req.user 
    });
});


module.exports = router;