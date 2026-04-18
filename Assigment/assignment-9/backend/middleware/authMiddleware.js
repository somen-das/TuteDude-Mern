const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const ROLES = require('../constants/roles');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let recentUser;
    if(decoded.role === ROLES.VISITOR){
      recentUser = await Visitor.findById(decoded.id).select('-password');
    }else {
      recentUser = await User.findById(decoded.id).select('-password');
          }

    if(!recentUser){
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }
    
    req.user = recentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {

    let hasRole = false;
    roles.forEach((key)=> {
      if(req.user.role === key){
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
