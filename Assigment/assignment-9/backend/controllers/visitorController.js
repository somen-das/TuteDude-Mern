const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const { sendEmail } = require('../utils/emailService');

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

    // 1. Email to Visitor
    await sendEmail({
      to: visitor.email,
      subject: `Visitor Pass Request Received - ${host.name}`,
      html: `
        <h2>Hi ${visitor.name},</h2>
        <p>Your request to visit <strong>${host.name}</strong> on <strong>${new Date(date).toLocaleString()}</strong> has been submitted successfully.</p>
        <p>You will receive your Digital Pass with a QR Code once the host approves your request.</p>
      `
    });

    // 2. Alert Email to Host
    await sendEmail({
      to: host.email,
      subject: `New Visitor Request: ${visitor.name}`,
      html: `
        <h2>Hello ${host.name},</h2>
        <p>You have a new visitor request pending approval.</p>
        <ul>
          <li><strong>Visitor:</strong> ${visitor.name} (${visitor.company || 'N/A'})</li>
          <li><strong>Purpose:</strong> ${purpose}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
        </ul>
        <p>Please log in to your PassManager dashboard to approve or reject this request.</p>
      `
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
