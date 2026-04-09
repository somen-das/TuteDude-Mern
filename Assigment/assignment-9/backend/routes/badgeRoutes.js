const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('visitorId')
      .populate('hostId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'Approved') {
      return res.status(400).json({ message: 'Badge can only be generated for approved appointments' });
    }

    const doc = new PDFDocument({
        size: [250, 400],
        margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=badge-${appointment.visitorId.name}.pdf`);

    doc.pipe(res);

    doc.rect(0, 0, 250, 400).fill('#f9fafb');
    
    doc.rect(0, 0, 250, 60).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(16).text('VISITOR PASS', 0, 20, { align: 'center' });

    doc.fillColor('#0f172a').fontSize(20).text(appointment.visitorId.name, 0, 80, { align: 'center' });
    doc.fontSize(12).fillColor('#64748b').text(appointment.visitorId.company || 'Personal Visit', 0, 105, { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(10).fillColor('#000000').text(`Host: ${appointment.hostId.name}`, { align: 'center' });
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`, { align: 'center' });

    if (appointment.passId) {
        const qrBuffer = await QRCode.toBuffer(appointment.passId);
        doc.image(qrBuffer, 75, 180, { width: 100 });
        doc.moveDown(9);
        doc.fontSize(10).text(`ID: ${appointment.passId}`, { align: 'center' });
    }

    doc.rect(0, 360, 250, 40).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(10).text('Please wear this badge at all times', 0, 375, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating badge' });
    }
  }
});

module.exports = router;
