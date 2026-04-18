const Appointment = require('../models/Appointment');
const Visitor = require('../models/Visitor')
const QRCode = require('qrcode');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const { generatePassPDF } = require('../utils/pdfGenerator');

const getAppointments = async (req, res) => {

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

const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('visitorId')
      .populate('hostId');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    appointment.status = status;
    let attachments = [];

    if (status === 'Approved') {

      if (!appointment.passId) {

        const randomBytes = crypto.randomBytes(4).toString('hex').toUpperCase();
        appointment.passId = randomBytes;
      }
      if (!appointment.pdfPassId) {

        appointment.pdfPassId = `PDF-${appointment.passId}`;
      }
      if (appointment?.passId) {

        const qrDataURL = await QRCode.toDataURL(appointment.passId);
        const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");
        const pdfBuffer = await generatePassPDF(appointment, base64Data);

        attachments.push({
          filename: `Pass-${appointment.passId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        });
      }
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Pass Approved! ID: ${appointment.passId}`,
        html: `Hi ${appointment.visitorId.name},<br><br>Your visit to ${appointment.hostId.name} is approved. Your digital pass ID is ${appointment.passId}.<br><br>Please see the attached QR code.`,
        attachments: attachments
      });
      await appointment.save();
      return res.json({ message: 'Status updated', appointment });
    } else if (status === 'Rejected') {
      await appointment.deleteOne();
      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Visit Request Rejected`,
        html: `Hi ${appointment.visitorId.name},<br><br>Your request to visit ${appointment.hostId.name} was rejected. Please contact them directly for more info.`
      });
      res.json({ message: 'Appointment rejected and deleted' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};

const downloadPass = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ pdfPassId: req.params.pdfPassId })
      .populate('visitorId')
      .populate('hostId');
    if (!appointment) {
      return res.status(404).json({ message: 'Pass not found' });
    }

    const qrDataURL = await QRCode.toDataURL(appointment.passId);
    const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");

    const pdfBuffer = await generatePassPDF(appointment, base64Data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Pass-${appointment.passId}.pdf`);

    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF Download Error:", error);
    res.status(500).json({message:"Error generating PDF"});
  }
};

const scanQR = async (req, res) => {
  const { passId } = req.body;

  try {
    const appointment = await Appointment.findOne({ passId }).populate('visitorId').populate('hostId');

    if (!appointment) {
      return res.status(404).json({ message: 'Invalid Pass ID Okay !' });
    }

    if (appointment.status !== 'Approved') {
      return res.status(400).json({ message: 'This pass is not approved or has expired' });
    }

    if (!appointment.checkStatus || appointment.checkStatus === 'Not Checked In') {
      await Appointment.updateMany(
        { passId: passId },
        {
          checkInTime: new Date(),
          checkStatus: 'Checked In'
        }
      );

      await sendEmail({
        to: appointment.hostId.email,
        subject: `Visitor Arrived: ${appointment.visitorId.name}`,
        html: `Hi ${appointment.hostId.name},<br><br>Your visitor ${appointment.visitorId.name} has just checked in.`
      });

      return res.json({ message: 'Checked In Successfully', passId: passId, appointment: appointment, status: 'Checked In' });
    }

    if (appointment.checkStatus === 'Checked In') {
      await Appointment.updateMany(
        { passId: passId },
        {
          checkOutTime: new Date(),
          checkStatus: 'Checked Out'
        }
      );

      await appointment.save();

      await sendEmail({
        to: appointment.visitorId.email,
        subject: `Thanks for visiting!`,
        html: `Hi ${appointment.visitorId.name},<br><br>You have successfully checked out. Have a great day!`
      });

      return res.json({ message: 'Checked Out Successfully', passId: passId, appointment: appointment, status: 'Checked Out' });
    }

    return res.status(400).json({ message: 'Already Checked Out' });

  } catch (error) {
    res.status(500).json({ message: "Error scanning QR code" });
  }
};

const getLogs = async (req, res) => {
  try {

    let query = { checkStatus: { $exists: true, $ne: null } };

    if (req.user && req.user.role === 'Employee') {
      query.hostId = req.user._id;
    }


    const logs = await Appointment.find(query)
      .populate('visitorId', 'name email phone company')
      .populate('hostId', 'name department')
      .sort({ updatedAt: -1 });

    res.json(logs);
  } catch (error) {
    console.error("GetLogs Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const getAppointmentsSearch = async (req, res) => {
  try {
    const { search } = req.query;

    let appointments = await Appointment.find()
      .populate('visitorId')
      .populate('hostId', 'name department');

    let filteredData = appointments;

    if (search) {
      const searchData = search.toLowerCase();

      filteredData = appointments.filter(app =>
        app.visitorId?.name?.toLowerCase().includes(searchData) ||
        app.hostId?.name?.toLowerCase().includes(searchData) ||
        app.purpose?.toLowerCase().includes(searchData)
      );
    }

    res.status(200).json({
      data: filteredData,
      length: filteredData.length
    });

  } catch (error) {
    res.status(500).json({
      error: `Server Error ${error.message}`
    });
  }
};


const getAppointmentsFilter = async (req, res) => {
  try {
    const { status } = req.query;

    let appointments = await Appointment.find()
      .populate('visitorId')
      .populate('hostId', 'name department');

    let filteredData = appointments;

    if (status) {
      const statusValue = status.toLowerCase();
      filteredData = appointments.filter((appointment) => {
        return appointment.status?.toLowerCase().includes(statusValue);
      });
    }
    res.status(200).json({
      data: filteredData,
      length: filteredData.length
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error filtering appointments',
      error: error.message
    });
  }
};



const getAppointmentsExport = async (req, res) => {
  try {
    let query = {};

    const appointments = await Appointment.find(query)
      .populate('visitorId')
      .populate('hostId', 'name department');

    let csv = 'Visitor Name,Visitor Email,Host Name,Department,Date,Status,Purpose\n';

    appointments.forEach(app => {
      csv += `${app.visitorId?.name || ''},`;
      csv += `${app.visitorId?.email || ''},`;
      csv += `${app.hostId?.name || ''},`;
      csv += `${app.hostId?.department || ''},`;
      csv += `${new Date(app.date).toLocaleString()},`;
      csv += `${app.status || ''},`;
      csv += `${app.purpose || ''}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('allAppointments.csv');
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  updateAppointmentStatus,
  scanQR,
  getLogs,
  downloadPass,
  deleteAppointment,
  getAppointmentsSearch,
  getAppointmentsFilter,
  getAppointmentsExport
};