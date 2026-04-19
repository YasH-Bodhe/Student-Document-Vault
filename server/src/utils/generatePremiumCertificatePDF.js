/**
 * Premium Certificate PDF Generator using PDFKit
 * Generates professional, print-ready certificates with QR codes
 * Modern dark-theme inspired design with premium aesthetics
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

      // Premium dark background
      doc.fillColor('#0f172a').rect(0, 0, pageWidth, pageHeight).fill();

      // Top gradient bar (Purple to Indigo)
      doc.fillColor('#8b5cf6').rect(0, 0, pageWidth, 20).fill();
      doc.fillColor('#6366f1').rect(0, 20, pageWidth, 8).fill();

      // Bottom decorative bar
      doc.fillColor('#6366f1').rect(0, pageHeight - 12, pageWidth, 12).fill();

      // Decorative corner elements
      doc.fillColor('#7c3aed').opacity(0.3).rect(pageWidth - 100, pageHeight - 100, 100, 100).fill();
      doc.fillColor('#8b5cf6').opacity(0.2).rect(0, 0, 80, 80).fill();

      // Reset opacity
      doc.opacity(1);

      // Header with institution name
      doc.font('Helvetica-Bold', 11).fillColor('#c4b5fd').text('STUDENT DOCUMENT VAULT', 50, 35);
      doc.font('Helvetica', 8).fillColor('#a78bfa').text('ETHEREUM BLOCKCHAIN VERIFIED', 50, 48);

      // Main title with premium styling
      doc.font('Helvetica-Bold', 72).fillColor('#ffffff').text('CERTIFICATE', 50, 75, { 
        width: 740, 
        align: 'center' 
      });

      // Subtitle
      doc.font('Helvetica-Oblique', 20).fillColor('#c4b5fd').text('of Professional Achievement', 50, 155, { 
        width: 740, 
        align: 'center' 
      });

      // Decorative line
      doc.strokeColor('#8b5cf6').lineWidth(2).moveTo(200, 185).lineTo(642, 185).stroke();

      // Certificate content
      doc.font('Helvetica', 12).fillColor('#cbd5e1').text('This certificate is proudly awarded to', 50, 215, { 
        width: 740, 
        align: 'center' 
      });

      // Student name - Large and prominent
      doc.font('Helvetica-Bold', 38).fillColor('#f0f9ff').text(certificateData.studentName, 50, 245, {
        width: 740,
        align: 'center',
        ellipsis: true
      });

      // Completion statement
      doc.font('Helvetica', 11).fillColor('#cbd5e1').text('for the successful completion of', 50, 305, { 
        width: 740, 
        align: 'center' 
      });

      // Course name - Styled
      doc.font('Helvetica-Bold', 24).fillColor('#e0e7ff').text(certificateData.courseName, 50, 330, {
        width: 740,
        align: 'center',
        ellipsis: true
      });

      // Bottom section with QR, dates, and signature
      const bottomY = 410;

      // QR Code section (left)
      const qrImage = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
      doc.image(qrImage, 40, bottomY + 5, { width: 85, height: 85 });
      
      // QR label with background
      doc.fillColor('#4c1d95').opacity(0.4).rect(40, bottomY + 92, 85, 18).fill();
      doc.opacity(1);
      doc.font('Helvetica-Bold', 8).fillColor('#c4b5fd').text('SCAN TO VERIFY', 40, bottomY + 96, { 
        width: 85, 
        align: 'center' 
      });

      // Date Issued (center-left)
      const dateX = 180;
      const issueDate = new Date(certificateData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.font('Helvetica', 8).fillColor('#94a3b8').text('ISSUED', dateX, bottomY + 20, { width: 100, align: 'center' });
      doc.font('Helvetica-Bold', 13).fillColor('#f0f9ff').text(issueDate, dateX, bottomY + 35, { width: 100, align: 'center' });

      // Issuer section (center)
      const issuerX = 360;
      doc.font('Helvetica', 8).fillColor('#94a3b8').text('ISSUED BY', issuerX, bottomY + 20, { width: 130, align: 'center' });
      doc.font('Helvetica-Bold', 13).fillColor('#f0f9ff').text(certificateData.issuerName, issuerX, bottomY + 35, {
        width: 130,
        align: 'center',
        ellipsis: true
      });

      // Signature section (right)
      const sigX = 570;
      // Signature line with style
      doc.strokeColor('#8b5cf6').lineWidth(1.5).moveTo(sigX, bottomY + 50).lineTo(sigX + 95, bottomY + 50).stroke();
      doc.font('Helvetica-Bold', 10).fillColor('#f0f9ff').text(certificateData.issuerName, sigX, bottomY + 55, {
        width: 95,
        align: 'center',
        ellipsis: true
      });
      doc.font('Helvetica', 7).fillColor('#94a3b8').text('Authorized Issuer Signature', sigX, bottomY + 72, { width: 95, align: 'center' });

      // Premium blockchain verified badge (bottom right)
      doc.fillColor('#8b5cf6').opacity(0.9).rect(pageWidth - 145, pageHeight - 50, 125, 38).fill();
      doc.opacity(1);
      doc.fillColor('#ddd6fe').lineWidth(0).rect(pageWidth - 145, pageHeight - 50, 125, 38).stroke();
      doc.font('Helvetica-Bold', 7).fillColor('#ffffff').text('✓ BLOCKCHAIN', pageWidth - 145, pageHeight - 42, {
        width: 125,
        align: 'center'
      });
      doc.font('Helvetica-Bold', 7).fillColor('#e0e7ff').text('VERIFIED', pageWidth - 145, pageHeight - 32, {
        width: 125,
        align: 'center'
      });

      // Certificate ID (bottom center)
      const certIDY = pageHeight - 20;
      doc.font('Helvetica', 6).fillColor('#64748b').text('CERTIFICATE ID', 50, certIDY - 8, { width: 740, align: 'center' });
      doc.font('Helvetica-Bold', 8).fillColor('#94a3b8').text(certificateData.certificateId, 50, certIDY, {
        width: 740,
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
