



const PDFDocument = require('pdfkit');
const axios = require('axios');

const generatePassPDF = (appointment, qrBase64) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A6', margin: 20 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.rect(0, 0, doc.page.width, 50).fill('#2c3e50'); 
    doc.fillColor('#ffffff').fontSize(16).text('VISITOR PASS', 0, 18, { align: 'center' });

    let photoY = 70;
    if (appointment.visitorId && appointment.visitorId.photoUrl) {
      try {
        const response = await axios.get(appointment.visitorId.photoUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'utf-8');
        
        doc.image(imageBuffer, 25, photoY, { width: 60, height: 60 });
        
        doc.lineWidth(1).strokeColor('#2c3e50').rect(25, photoY, 60, 60).stroke();
      } catch (err) {
        console.log("Photo load error, skipping...");
      }
    }

    doc.fillColor('#333333').fontSize(10);
    const textX = 100; 
    
    doc.font('Helvetica-Bold').text(`Name:`, textX, photoY);
    doc.font('Helvetica').text(`${appointment.visitorId.name}`, textX + 40, photoY);

    doc.font('Helvetica-Bold').text(`Host:`, textX, photoY + 15);
    doc.font('Helvetica').text(`${appointment.hostId.name}`, textX + 40, photoY + 15);

    doc.font('Helvetica-Bold').text(`Date:`, textX, photoY + 30);
    doc.font('Helvetica').text(`${new Date(appointment.date).toLocaleDateString()}`, textX + 40, photoY + 30);

    doc.font('Helvetica-Bold').text(`Pass ID:`, textX, photoY + 45);
    doc.fillColor('#e74c3c').text(`${appointment.passId}`, textX + 45, photoY + 45);

    doc.moveTo(20, 145).lineTo(doc.page.width - 20, 145).strokeColor('#cccccc').stroke();

    doc.image(Buffer.from(qrBase64, 'base64'), (doc.page.width / 2) - 40, 160, {
      width: 80,
      height: 80
    });

    doc.fontSize(8).fillColor('#95a5a6').text('Please keep this pass visible at all times', 0, 260, { align: 'center' });

    doc.end();
  });
};

module.exports = { generatePassPDF };