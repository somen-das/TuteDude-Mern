const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

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
    console.log('appointmentsappointmentsappointments==>', appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  console.log("Updating status to:", status); 

  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('visitorId')
      .populate('hostId');
      
    if (!appointment) {
      console.log("Appointment not found in DB");
      return res.status(404).send('Appointment not found');
    }
    
    if (req.user.role === 'Employee') {
        if (appointment.hostId._id.toString() !== req.user._id.toString()) {
            console.log("Employee unauthorized to edit this appointment");
            return res.status(403).send('Not authorized to update this appointment');
        }
    }

    appointment.status = status;
    
    let attachments = [];

    if (status === 'Approved') {
      if (!appointment.passId) {
        console.log("Generating pass ID and QR code...");
        const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
        appointment.passId = randomBytes;
        
        const qrDataURL = await QRCode.toDataURL(appointment.passId);
        
        const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");
        
        attachments.push({
            filename: 'pass-qr-code.png',
            content: base64Data,
            encoding: 'base64'
        });
        console.log("QR code generated and attached");
      }
    }
    
    await appointment.save();
    console.log("Appointment saved in DB");

    if (status === 'Approved') {
      console.log("Sending approval email");
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Pass Approved! ID: ${appointment.passId}`,
        html: `Hi ${appointment.visitorId.name},<br><br>Your visit to ${appointment.hostId.name} is approved. Your digital pass ID is ${appointment.passId}.<br><br>Please see the attached QR code.`,
        attachments: attachments
      });
    }

    if (status === 'Rejected') {
      console.log("Sending rejection email");
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Visit Request Rejected`,
        html: `Hi ${appointment.visitorId.name},<br><br>Your request to visit ${appointment.hostId.name} was rejected. Please contact them directly for more info.`
      });
    }

    res.json(appointment);
  } catch (error) {
    console.log("Status update error:", error);
    res.status(500).send('Internal server error');
  }
};

exports.scanQR = async (req, res) => {
  const { passId } = req.body;
  console.log("Scanning pass ID:", passId);
  
  try {
    const appointment = await Appointment.findOne({ passId }).populate('visitorId').populate('hostId');
    
    if (!appointment) {
      console.log("Pass ID not found");
      return res.status(404).send('Invalid Pass ID');
    }
    
    if (appointment.status !== 'Approved') {
      console.log("Pass is not approved");
      return res.status(400).send('This pass is not approved or has expired');
    }

    let log = await CheckLog.findOne({ appointmentId: appointment._id });
    
    if (!log) {
      console.log("No log found. Checking in visitor.");
      log = await CheckLog.create({ 
        appointmentId: appointment._id, 
        checkInTime: new Date(), 
        status: 'Checked In',
        organization: appointment.organization
      });
      
      console.log("Sending arrival email to host");
      await sendEmail({
        to: appointment.hostId.email,
        subject: `Visitor Arrived: ${appointment.visitorId.name}`,
        html: `Hi ${appointment.hostId.name},<br><br>Your visitor ${appointment.visitorId.name} has just checked in.`
      });

      return res.json({ message: 'Checked In Successfully', passId: passId, status: 'Checked In' });
    }
    
    if (log.status === 'Checked In') {
      console.log("Log found with Checked In status. Checking out visitor.");
      log.checkOutTime = new Date();
      log.status = 'Checked Out';
      
      await log.save();

      console.log("Sending checkout email to visitor");
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Thanks for visiting!`,
        html: `Hi ${appointment.visitorId.name},<br><br>You have successfully checked out. Have a great day!`
      });

      return res.json({ message: 'Checked Out Successfully', passId: passId, status: 'Checked Out' });
    }
    
    console.log("Visitor already checked out");
    return res.status(400).send('Already Checked Out');
    
  } catch (error) {
    console.log("Scan error:", error);
    res.status(500).send("Error scanning QR code");
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
