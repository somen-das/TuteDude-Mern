const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const { sendEmail } = require('../utils/emailService');
const ROLE = reuquire('../constants/roles.js');
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    
    let orgId = null;
  

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ 
        name, 
        email, 
        password, 
        role, 
        department, 
    });
    
    if (user) {
      
      await sendEmail({
        to: user.email,
        subject: `Welcome to PassManager - ${role} Account Created`,
        html: `
          <h2>Welcome, ${user.name}!</h2>
          <p>An administrator has created a <strong>${user.role}</strong> account for you in the Visitor Pass Management System.</p>
          <p>You can login using this email and the password provided to you by the admin.</p>
        `
      });

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = req.user &&  {};
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editUser = async (req, res) => {
  const {id} = req.params;
  const {name, email, role} = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email, role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot delete themselves' });
    }

    await userToDelete.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editSingleUser = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  try {
    if (role === ROLE.VISITOR) {
      const visitor = await Visitor.findById(id);
      if (!visitor) return res.status(404).json({ message: "Visitor Not Found" });

      visitor.name = name || visitor.name;
      await visitor.save();
      return res.json({ message: "Your Profile has been updated", user: visitor });

    } else if (["Admin", "Employee", "Security"].includes(role)) {
      const findUser = await User.findById(id);
      if (!findUser) return res.status(404).json({ message: "User Not Found" });

      findUser.name = name || findUser.name;
      await findUser.save();
      
      const userResponse = findUser.toObject();
      delete userResponse.password;

      return res.json({ message: "Your Profile has been updated", user: userResponse });
    }
  } catch (error) {
    console.error('Error in editSingleUser:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};
