const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const crypto = require('crypto');
const QRCode = require('qrcode');

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
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
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    if (req.user.role === 'Employee' && appointment.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    if (status === 'Approved' && !appointment.passId) {
      appointment.passId = crypto.randomBytes(8).toString('hex');
    }
    
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scanQR = async (req, res) => {
  const { passId } = req.body;
  try {
    const appointment = await Appointment.findOne({ passId }).populate('visitorId').populate('hostId', 'name');
    if (!appointment) return res.status(404).json({ message: 'Invalid Pass' });
    if (appointment.status !== 'Approved') return res.status(400).json({ message: 'Pass is not approved' });

    let log = await CheckLog.findOne({ appointmentId: appointment._id });
    if (!log) {
      log = await CheckLog.create({ appointmentId: appointment._id, checkInTime: new Date(), status: 'Checked In' });
      return res.json({ message: 'Checked In Successfully', appointment, log });
    } else if (log.status === 'Checked In') {
      log.checkOutTime = new Date();
      log.status = 'Checked Out';
      await log.save();
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
    const logs = await CheckLog.find({})
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
