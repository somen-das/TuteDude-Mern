const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const { sendEmail } = require('../utils/emailService');

exports.registerVisitor = async (req, res) => {
  const { name, email, phone, company, hostId, date, purpose } = req.body;
  
  try {
    const host = await User.findById(hostId);
    if (!host || host.role !== 'Employee') {
      console.log('Host validation failed');
      return res.status(400).send('Invalid host selected');
    }

    let visitor = await Visitor.findOne({ email });
    if (!visitor) {
      visitor = await Visitor.create({ name, email, phone, company, organization: host.organization });
    }
    
    const appointment = await Appointment.create({
      visitorId: visitor._id,
      hostId: host._id,
      date,
      purpose,
      organization: host.organization
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

    res.status(201).json({ message: 'Visitor registered', appointment });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).send("Internal server error during registration");
  }
};

exports.getVisitors = async (req, res) => {
  try {
    const query = req.user && req.user.organization ? { organization: req.user.organization } : {};
    const visitors = await Visitor.find(query);
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHosts = async (req, res) => {
  try {
    const query = { role: 'Employee' };
    if (req.user && req.user.organization) query.organization = req.user.organization;
    const hosts = await User.find(query).select('name department _id');
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
