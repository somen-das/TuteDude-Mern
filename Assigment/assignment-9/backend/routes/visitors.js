const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, getHosts } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerVisitorSchema } = require('../validators/schemas');

router.post('/register', validate(registerVisitorSchema), registerVisitor);
router.get('/hosts', getHosts);
router.get('/', protect, getVisitors);

module.exports = router;
