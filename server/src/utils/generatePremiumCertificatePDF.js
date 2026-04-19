/**
 * Premium Certificate PDF Generator using PDFKit
 * Generates professional, print-ready certificates with QR codes
 */

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0,
        layout: 'landscape'
      });

      // Generate QR code as data URL
      const qrCodeDataURL = await QRCode.toDataURL(
        `https://verify.vault.io/cert/${certificateData.certificateId}`,
        { width: 200, margin: 1 }
      );

      // Store buffer chunks
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      // Page dimensions (landscape A4)
      const pageWidth = 842; // 297mm in points
      const pageHeight = 595; // 210mm in points

      // Draw gradient-like background using rectangles
      doc.fillColor('#ffffff').rect(0, 0, pageWidth, pageHeight).fill();
      doc.fillColor('#f8f9ff').rect(0, 0, pageWidth, pageHeight * 0.5).fill();

      // Top decorative bar
      doc.fillColor('#667eea').rect(0, 0, pageWidth, 15).fill();

      // Bottom decorative bar
      doc.fillColor('#667eea').rect(0, pageHeight - 15, pageWidth, 15).fill();

      // Set main text color
      doc.fillColor('#333333');

      // Header
      doc.font('Helvetica', 14).fillColor('#667eea').text('📚 Student Document Vault', 50, 40);
      doc.font('Helvetica', 9).fillColor('#999999').text('BLOCKCHAIN VERIFIED CERTIFICATES', 50, 57);

      // Main title
      doc.font('Helvetica-Bold', 58).fillColor('#667eea').text('CERTIFICATE', 50, 95, { width: 400, align: 'center' });

      // Subtitle
      doc.font('Helvetica-Oblique', 18).fillColor('#764ba2').text('of Achievement', 50, 160, { width: 400, align: 'center' });

      // Certificate content
      doc.font('Helvetica', 13).fillColor('#999999').text('This is to certify that', 50, 220, { width: 700, align: 'center' });

      // Student name
      doc.font('Helvetica-Bold', 32).fillColor('#667eea').text(certificateData.studentName, 50, 245, {
        width: 700,
        align: 'center',
        ellipsis: true
      });

      // Course completion text
      doc.font('Helvetica', 12).fillColor('#999999').text('has successfully completed', 50, 290, { width: 700, align: 'center' });

      // Course name
      doc.font('Helvetica-Oblique', 22).fillColor('#764ba2').text(certificateData.courseName, 50, 312, {
        width: 700,
        align: 'center',
        ellipsis: true
      });

      // Bottom section with QR, dates, and signature
      const bottomY = 410;

      // QR Code section (left)
      const qrImage = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
      doc.image(qrImage, 50, bottomY, { width: 90, height: 90 });
      doc.font('Helvetica', 8).fillColor('#999999').text('Scan to Verify', 50, bottomY + 95, { width: 90, align: 'center' });

      // Date Issued (center-left)
      const dateX = 200;
      const issueDate = new Date(certificateData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.font('Helvetica', 9).fillColor('#999999').text('DATE ISSUED', dateX, bottomY + 20, { width: 100, align: 'center' });
      doc.font('Helvetica-Bold', 12).fillColor('#333333').text(issueDate, dateX, bottomY + 35, { width: 100, align: 'center' });

      // Issued By (center-right)
      const issuerX = 360;
      doc.font('Helvetica', 9).fillColor('#999999').text('ISSUED BY', issuerX, bottomY + 20, { width: 120, align: 'center' });
      doc.font('Helvetica-Bold', 12).fillColor('#333333').text(certificateData.issuerName, issuerX, bottomY + 35, {
        width: 120,
        align: 'center',
        ellipsis: true
      });

      // Signature section (right)
      const sigX = 570;
      // Signature line
      doc.strokeColor('#333333').lineWidth(2).moveTo(sigX, bottomY + 45).lineTo(sigX + 100, bottomY + 45).stroke();
      doc.font('Helvetica-Bold', 10).fillColor('#333333').text(certificateData.issuerName, sigX, bottomY + 50, {
        width: 100,
        align: 'center',
        ellipsis: true
      });
      doc.font('Helvetica-Oblique', 8).fillColor('#999999').text('Authorized Issuer', sigX, bottomY + 68, { width: 100, align: 'center' });

      // Blockchain badge (bottom right)
      doc.fillColor('#667eea').strokeColor('#667eea').lineWidth(1)
        .rect(pageWidth - 130, pageHeight - 45, 110, 30).stroke();
      doc.font('Helvetica-Bold', 8).fillColor('#667eea').text('✓ BLOCKCHAIN VERIFIED', pageWidth - 130, pageHeight - 38, {
        width: 110,
        align: 'center'
      });

      // Certificate ID (bottom center)
      const certIDY = pageHeight - 35;
      doc.font('Helvetica', 7).fillColor('#999999').text('CERTIFICATE ID', 50, certIDY, { width: 700, align: 'center' });
      doc.font('Helvetica', 8).fillColor('#666666').text(certificateData.certificateId, 50, certIDY + 12, {
        width: 700,
        align: 'center',
        ellipsis: true
      });

      // Finalize the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;
