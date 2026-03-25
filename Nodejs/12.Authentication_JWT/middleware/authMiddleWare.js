const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "Access Denied! No token provided or invalid format." 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decodedUser;
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            message: "Invalid or Expired Token!" 
        });
    }
};

module.exports = { authCheck };