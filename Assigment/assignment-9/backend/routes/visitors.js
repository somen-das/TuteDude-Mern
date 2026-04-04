const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, getHosts } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerVisitor);
router.get('/hosts', getHosts);
router.get('/', protect, getVisitors);

module.exports = router;
