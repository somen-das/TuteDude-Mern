const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/Visitor');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let currentUser;
    if(decoded.role === 'Visitor'){
      currentUser = await Visitor.findById(decoded.id).select('-password');
    }else {
      currentUser = await User.findById(decoded.id).select('-password');
          }

    if(!currentUser){
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }
    
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {

    let hasRole = false;
    roles.forEach((res)=> {
      if(req.user.role === res){
        hasRole = true;
      }
    })
    
    if (hasRole) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. You do not have permission to do this.' });
    }
  };
};

module.exports = { protect, authorize };
