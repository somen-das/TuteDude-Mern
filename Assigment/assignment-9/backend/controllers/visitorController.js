const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


const registerVisitor = async (req, res) => {
  const { name, email, phone, password, confirmPassword, company, hostId, date, purpose, photoUrl } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }
    let visitor = await Visitor.findOne({ email });
    if (!visitor) {
      const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      visitor = await Visitor.create({ name, email, phone, password: hashedPassword, company, photoUrl: photoUrl, role: 'Visitor' });
    } else{
      return res.status(400).send('Visitor with this email already exists. Please log-in to book an appointment.');
    }
    await sendEmail({
      to: visitor.email,
      subject: `Registeration Received`,
      html: `Hi ${visitor.name},<BR><BR>Your registration request has been received successfully. Please log in to your dashboard to book an appointment with your host.`
    });

    res.status(201).json({ message: 'Visitor registered succesfully', visitor });
  } catch (error) {
    console.error("Reg Error", error);
    res.status(500).send("Internal server error during registration");
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const visitor = await Visitor.findOne({ email });
    if (visitor && (await visitor.matchPassword(password))) {
      res.json({
        _id: visitor.id,
        name: visitor.name,
        email: visitor.email,
        role: visitor.role,
        token: generateToken(visitor._id, visitor.role),
        visitor: visitor
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const appointmentVisitor = async (req, res) => {
  const { email, company, hostId, date, purpose } = req.body;
  
  try {
    const host = await User.findById(hostId);
    if (!host || host.role !== 'Employee') {
      return res.status(400).send('Invalid host selected');
    }

    let visitor = await Visitor.findOne({ email });
    
    if (visitor) {
      const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      date,
      purpose,
      photoUrl: visitor.photoUrl
    });

    await sendEmail({
      to: visitor.email,
      subject: `Visitor Pass Request Received - ${host.name}`,
      html: `Hi ${visitor.name},<br><br>Your request to visit ${host.name} on ${new Date(date).toLocaleString()} has been submitted successfully.<br>You will receive your Digital Pass once approved.`
    });

    await sendEmail({
      to: host.email,
      subject: `New Visitor Request: ${visitor.name}`,
      html: `Hello ${host.name},<br><br>You have a new visitor request from ${visitor.name} (${visitor.company || 'N/A'}) for the purpose of ${purpose} on ${new Date(date).toLocaleString()}.<br><br>Please log in to your dashboard to approve.`
    });
    res.status(201).json({ message: 'Visitor appointment created', appointment });

  } else {
      return res.status(404).json({
        message: 'Visitor not found. Please register before booking an appointment.'
      });
    }
    
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send(`Internal server error during registration ${error}`);
  }
};

const appointmentVisitorGet = async (req, res) => {
  const { email } = req.body;
  try{
    const visitor = await Visitor.findOne({ email });
    if (!visitor) {
      return res.status(404).send('Visitor not found');
    }
    const appointments = await Appointment.find({ visitorId: visitor._id }).populate('hostId', 'name email');
    res.status(200).json({ appointments });
  } catch(error){
    console.error("Error in fetching appointments:", error);
    res.status(500).send(`Internal server error during fetching appointments ${error}`);
  }
}

const getVisitors = async (req, res) => {
  try {
    const query = req.user || {};
    const visitors = await Visitor.find(query);
    if(!visitors){
      res.status(400).json({message:"visitor not found"})
      return;
    }
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHosts = async (req, res) => {
  try {
    const query = { role: 'Employee' };
    const hosts = await User.find(query).select('name department _id');
    if(!hosts){
      res.status(400).json({message: 'host not found'})
    }
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUsers = async (req, res) =>{
  const {name} = req.body;
  try{
    const visitor = await Visitor.findById(req.user.id);
    if(!visitor){
      return res.status(404).json({message:"Visitor Not Found"})
    }
    visitor.name = name || visitor.name;
    await visitor.save();

    res.json({message: "Your Profile has been updated", user:visitor})
  } catch(error){
    res.status(500).json({message:error.message})
  }
}


module.exports = {
  registerVisitor, loginUser, appointmentVisitor, appointmentVisitorGet, getVisitors, getHosts, editUsers
}