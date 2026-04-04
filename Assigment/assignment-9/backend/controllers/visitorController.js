const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.registerVisitor = async (req, res) => {
  const { name, email, phone, company, hostId, date, purpose } = req.body;
  try {
    let visitor = await Visitor.findOne({ email });
    if (!visitor) {
      visitor = await Visitor.create({ name, email, phone, company });
    }
    
    const host = await User.findById(hostId);
    if (!host || host.role !== 'Employee') {
      return res.status(400).json({ message: 'Invalid host selected' });
    }

    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      date,
      purpose
    });

    res.status(201).json({ message: 'Visitor registered and appointment requested', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({});
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHosts = async (req, res) => {
  try {
    const hosts = await User.find({ role: 'Employee' }).select('name department _id');
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
