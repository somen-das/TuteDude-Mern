const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/Visitor');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No token found in header");
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('visitor', decoded)
    if(decoded.role === 'Visitor'){
      const visitor = await Visitor.findById(decoded.id).select('-password');
      if ( !visitor) {
      console.log("Visitor not found for this token222");
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
      req.user = visitor;
    }else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user ) {
      console.log("User not found for this token222");
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
       req.user = user
    }
    
    
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    let hasRole = false;
    for (let i = 0; i < roles.length; i++) {
        if (req.user.role === roles[i]) {
            hasRole = true;
            break;
        }
    }
    
    if (hasRole) {
      next();
    } else {
      console.log("User does not have permission");
      res.status(403).json({ message: 'Access denied. You do not have permission to do this.' });
    }
  };
};

module.exports = { protect, authorize };
