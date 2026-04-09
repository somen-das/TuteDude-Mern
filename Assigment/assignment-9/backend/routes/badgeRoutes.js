const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('visitorId')
      .populate('hostId');

    if (!appointment) {
      console.log("Appointment not found for badge");
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'Approved') {
      console.log("Cannot generate badge for unapproved appointment");
      return res.status(400).json({ message: 'Badge can only be generated for approved appointments' });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=badge-${appointment.visitorId.name}.pdf`);

    doc.pipe(res);

    doc.fontSize(25).text('VISITOR PASS', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(18).text(`Name: ${appointment.visitorId.name}`);
    
    if (appointment.visitorId.company) {
        doc.fontSize(14).text(`Company: ${appointment.visitorId.company}`);
    } else {
        doc.fontSize(14).text(`Personal Visit`);
    }

    doc.moveDown();
    doc.fontSize(14).text(`Host: ${appointment.hostId.name}`);
    
    const dateStr = new Date(appointment.date).toLocaleDateString();
    doc.text(`Date: ${dateStr}`);

    if (appointment.passId) {
        doc.moveDown();
        doc.text(`Pass ID: ${appointment.passId}`);
        
        const qrBuffer = await QRCode.toBuffer(appointment.passId);
        
        doc.moveDown();
        doc.image(qrBuffer, { width: 150 });
    }

    doc.end();

  } catch (error) {
    console.log('PDF Generation Error:', error);
    res.status(500).json({ message: 'Error generating badge' });
  }
});

module.exports = router;
