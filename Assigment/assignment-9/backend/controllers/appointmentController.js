const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.organization) query.organization = req.user.organization;
    if (req.user.role === 'Employee') {
      query.hostId = req.user._id;
    }
    const appointments = await Appointment.find(query)
      .populate('visitorId')
      .populate('hostId', 'name department')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    let appointment = await Appointment.findById(req.params.id)
      .populate('visitorId')
      .populate('hostId');
      
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    if (req.user.role === 'Employee' && appointment.hostId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    let qrDataURL = null;
    let attachments = [];

    if (status === 'Approved' && !appointment.passId) {
      appointment.passId = crypto.randomBytes(8).toString('hex');
      qrDataURL = await QRCode.toDataURL(appointment.passId);
      
      const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");
      attachments.push({
          filename: 'qrcode.png',
          content: base64Data,
          encoding: 'base64',
          cid: 'qrcode-image' 
      });
    }
    
    await appointment.save();

    if (status === 'Approved') {
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Your Visitor Pass is Approved - Pass ID: ${appointment.passId}`,
        html: `
          <h2>Request Approved!</h2>
          <p>Hi ${appointment.visitorId.name}, your request to visit <strong>${appointment.hostId.name}</strong> on ${new Date(appointment.date).toLocaleString()} has been approved.</p>
          <div style="padding: 20px; background: #f0f0f0; display: inline-block; border-radius: 8px;">
            <h3>Your Digital Pass: ${appointment.passId}</h3>
            <p>Please present this QR code at the security desk upon arrival.</p>
            <img src="cid:qrcode-image" alt="QR Code" style="width: 200px; height: 200px;" />
          </div>
        `,
        attachments
      });
    } else if (status === 'Rejected') {
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Visitor Request Update`,
        html: `
          <h2>Request Rejected</h2>
          <p>Hi ${appointment.visitorId.name}, unfortunately your request to visit <strong>${appointment.hostId.name}</strong> has been rejected by the host.</p>
          <p>Please reach out to your contact directly if this is an error.</p>
        `
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scanQR = async (req, res) => {
  const { passId } = req.body;
  try {
    const appointment = await Appointment.findOne({ passId }).populate('visitorId').populate('hostId');
    if (!appointment) return res.status(404).json({ message: 'Invalid Pass' });
    if (appointment.status !== 'Approved') return res.status(400).json({ message: 'Pass is not approved' });

    let log = await CheckLog.findOne({ appointmentId: appointment._id });
    
    if (!log) {
      log = await CheckLog.create({ 
        appointmentId: appointment._id, 
        checkInTime: new Date(), 
        status: 'Checked In',
        organization: appointment.organization
      });
      
      await sendEmail({
        to: appointment.hostId.email,
        subject: `Your Visitor has Arrived!`,
        html: `
          <h2>Visitor Checked In</h2>
          <p>Hi ${appointment.hostId.name},</p>
          <p>Your visitor <strong>${appointment.visitorId.name}</strong> has just checked in at the Front Desk.</p>
        `
      });

      return res.json({ message: 'Checked In Successfully', appointment, log });
    } else if (log.status === 'Checked In') {
      log.checkOutTime = new Date();
      log.status = 'Checked Out';
      await log.save();

      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Checkout Confirmed - Thank you for visiting`,
        html: `
          <h2>Thanks for Visiting!</h2>
          <p>Hi ${appointment.visitorId.name}, you have successfully checked out from your meeting with ${appointment.hostId.name}.</p>
          <p>We hope you had a great time.</p>
        `
      });

      return res.json({ message: 'Checked Out Successfully', appointment, log });
    } else {
      return res.status(400).json({ message: 'Already Checked Out', appointment, log });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const query = req.user && req.user.organization ? { organization: req.user.organization } : {};
    const logs = await CheckLog.find(query)
      .populate({
        path: 'appointmentId',
        populate: [
          { path: 'visitorId' },
          { path: 'hostId', select: 'name' }
        ]
      }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
