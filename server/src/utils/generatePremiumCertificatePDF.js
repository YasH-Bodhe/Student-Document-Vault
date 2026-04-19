/**
 * Premium Certificate PDF Generator using PDFKit
 * Classic Prestige Theme — Ivory + Burgundy/Wine Red
 * Fixed: Ethereum badge & Cert ID no longer overlap, uniform date sizing
 */

const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const W = 841;
      const H = 595;

      const doc = new PDFDocument({ size: [W, H], margin: 0 });

      const qrCodeDataURL = await QRCode.toDataURL(
        `https://verify.vault.io/cert/${certificateData.certificateId}`,
        { width: 180, margin: 1, color: { dark: '#6B1A2A', light: '#FAF6EE' } }
      );

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const C = {
        ivory:        '#FAF6EE',
        burgundy:     '#6B1A2A',
        burgundyMid:  '#8B2535',
        burgundyLight:'#B05060',
        burgundyPale: '#E8C8CE',
        burgundyFaint:'#F5E0E3',
        inkDark:      '#2C1A1E',
        inkMid:       '#5A3A40',
        inkLight:     '#9A7A80',
        inkFaint:     '#C4AAAE',
      };

      const CX   = W / 2;
      const B1   = 12, B2 = 18;
      const dPad = 110;

      // ── BACKGROUND ──
      doc.fillColor(C.ivory).rect(0, 0, W, H).fill();
      for (let i = 5; i >= 1; i--) {
        doc.fillColor(C.burgundyPale).opacity(0.04 * i)
          .ellipse(CX, H / 2, 360 * (i / 5), 240 * (i / 5)).fill();
      }
      doc.opacity(1);

      // ── BORDERS ──
      doc.strokeColor(C.burgundy).lineWidth(1.5)
        .rect(B1, B1, W - B1 * 2, H - B1 * 2).stroke();
      doc.strokeColor(C.burgundyLight).lineWidth(0.5)
        .rect(B2, B2, W - B2 * 2, H - B2 * 2).stroke();

      // ── CORNER ORNAMENTS ──
      function corner(ox, oy, sx, sy) {
        doc.save().translate(ox, oy).scale(sx, sy);
        doc.strokeColor(C.burgundy).lineWidth(1.2);
        doc.moveTo(0, 24).lineTo(0, 0).lineTo(24, 0).stroke();
        doc.moveTo(4, 4).lineTo(10, 10).lineTo(4, 16).lineTo(-2, 10).closePath()
          .fillColor(C.burgundy).fill();
        doc.restore();
      }
      corner(B2,     B2,      1,  1);
      corner(W - B2, B2,     -1,  1);
      corner(B2,     H - B2,  1, -1);
      corner(W - B2, H - B2, -1, -1);

      // ── TOP BAND ──
      doc.fillColor(C.burgundy).rect(B1 + 1.5, B1 + 1.5, W - (B1 + 1.5) * 2, 52).fill();
      doc.fillColor(C.ivory).opacity(0.07);
      for (let x = 30; x < W - 30; x += 18) doc.circle(x, B1 + 27, 1.5).fill();
      doc.opacity(1);

      // Y logo
      const lx = CX - 160, ly = B1 + 27, armR = 12;
      doc.strokeColor(C.ivory).lineWidth(1.8).lineCap('round').opacity(0.85);
      doc.moveTo(lx - armR, ly - 8).lineTo(lx, ly).stroke();
      doc.moveTo(lx + armR, ly - 8).lineTo(lx, ly).stroke();
      doc.moveTo(lx, ly).lineTo(lx, ly + 14).stroke();
      doc.opacity(1);
      doc.fillColor(C.ivory).circle(lx, ly, 3).fill();

      doc.font('Helvetica-Bold').fontSize(9).fillColor(C.ivory)
        .text('YASH BODHE', 0, B1 + 16, { width: W, align: 'center', characterSpacing: 4 });
      doc.font('Helvetica').fontSize(7).fillColor(C.ivory).opacity(0.65)
        .text('D O C U M E N T   V A U L T', 0, B1 + 30, { width: W, align: 'center' });
      doc.opacity(1);

      // ── BODY ──
      const BODY_TOP = B1 + 55;

      const Z1 = BODY_TOP + 16;
      doc.font('Helvetica').fontSize(8).fillColor(C.inkLight)
        .text('C  E  R  T  I  F  I  C  A  T  E   O  F', 0, Z1, { width: W, align: 'center' });

      const Z2 = Z1 + 14;
      doc.font('Helvetica-Bold').fontSize(52).fillColor(C.burgundy)
        .text('ACHIEVEMENT', 0, Z2, { width: W, align: 'center', characterSpacing: 5 });

      const Z3 = Z2 + 60;
      doc.font('Helvetica-Oblique').fontSize(10.5).fillColor(C.burgundyLight)
        .text('with Blockchain Verification', 0, Z3, { width: W, align: 'center' });

      const D1 = Z3 + 20;
      doc.strokeColor(C.burgundyPale).lineWidth(0.7)
        .moveTo(dPad, D1).lineTo(CX - 20, D1).stroke();
      doc.strokeColor(C.burgundyPale).lineWidth(0.7)
        .moveTo(CX + 20, D1).lineTo(W - dPad, D1).stroke();
      doc.fillColor(C.burgundy).circle(CX, D1, 3.5).fill();
      doc.strokeColor(C.burgundy).lineWidth(0.7).circle(CX, D1, 7).stroke();
      doc.fillColor(C.burgundy).circle(CX - 14, D1, 1.5).fill();
      doc.fillColor(C.burgundy).circle(CX + 14, D1, 1.5).fill();

      const Z4 = D1 + 16;
      doc.font('Helvetica').fontSize(9.5).fillColor(C.inkLight)
        .text('This certificate is proudly presented to', 0, Z4, { width: W, align: 'center' });

      const Z5 = Z4 + 16;
      doc.font('Helvetica-BoldOblique').fontSize(36).fillColor(C.inkDark)
        .text(certificateData.studentName, 0, Z5, { width: W, align: 'center' });

      const Z6 = Z5 + 47;
      doc.font('Helvetica').fontSize(9.5).fillColor(C.inkLight)
        .text('for the successful completion of', 0, Z6, { width: W, align: 'center' });

      const Z7 = Z6 + 15;
      doc.font('Helvetica-Bold').fontSize(16).fillColor(C.burgundy)
        .text(certificateData.courseName, 0, Z7, { width: W, align: 'center', characterSpacing: 0.4 });

      const D2 = Z7 + 34;
      doc.strokeColor(C.burgundyPale).lineWidth(0.7)
        .moveTo(dPad, D2).lineTo(W - dPad, D2).stroke();

      // ── FOOTER ──
      // Layout: [DATE 48..210] gap [SIG center] gap [QR 693..793]
      // Center column for signature: 310..530 (220px wide)
      // Ethereum badge + Cert ID go BELOW signature, stacked, no overlap

      const FOOT_Y = D2 + 14;

      // ── LEFT: Date block ──
      const DATE_X = 48;
      const DATE_W = 162;
      const DATE_H = 72;

      const issueDate = new Date(certificateData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      const parts = issueDate.split(' ');
      const month = (parts[0] || '').toUpperCase();
      const day   = (parts[1] || '').replace(',', '');
      const year  = parts[2] || '';
      // Full date string for uniform-size rendering
      const fullDateStr = `${day}  ${month}  ${year}`;

      doc.roundedRect(DATE_X, FOOT_Y, DATE_W, DATE_H, 5)
        .fillColor(C.burgundyFaint).fill();
      doc.roundedRect(DATE_X, FOOT_Y, DATE_W, DATE_H, 5)
        .strokeColor(C.burgundyPale).lineWidth(0.8).stroke();
      // Left accent bar
      doc.fillColor(C.burgundy).roundedRect(DATE_X, FOOT_Y, 4, DATE_H, 2).fill();

      // Label
      doc.font('Helvetica-Bold').fontSize(7).fillColor(C.burgundyMid)
        .text('DATE OF ISSUE', DATE_X + 12, FOOT_Y + 11, { characterSpacing: 2 });

      // Uniform large date — all same font size, same weight, same color
      doc.font('Helvetica-Bold').fontSize(18).fillColor(C.burgundy)
        .text(fullDateStr, DATE_X + 12, FOOT_Y + 30, { width: DATE_W - 20 });

      // ── CENTER: Signature (top of center col) ──
      const SIG_X = 310;
      const SIG_W = 220;
      const SIG_LINE_Y = FOOT_Y + 8;

      doc.strokeColor(C.inkFaint).lineWidth(0.8)
        .moveTo(SIG_X, SIG_LINE_Y).lineTo(SIG_X + SIG_W, SIG_LINE_Y).stroke();
      doc.font('Helvetica-Bold').fontSize(13).fillColor(C.inkDark)
        .text(certificateData.issuerName, SIG_X, SIG_LINE_Y + 8, { width: SIG_W, align: 'center' });
      doc.font('Helvetica-Oblique').fontSize(9).fillColor(C.inkLight)
        .text('Authorized Issuer', SIG_X, SIG_LINE_Y + 26, { width: SIG_W, align: 'center' });

      // ── Ethereum badge (below signature, separate row) ──
      const EB_W = 160;
      const EB_X = SIG_X + (SIG_W - EB_W) / 2;
      const EB_Y = SIG_LINE_Y + 42;   // clearly below "Authorized Issuer"
      doc.roundedRect(EB_X, EB_Y, EB_W, 18, 3).fillColor(C.burgundyFaint).fill();
      doc.roundedRect(EB_X, EB_Y, EB_W, 18, 3).strokeColor(C.burgundyPale).lineWidth(0.7).stroke();
      doc.fillColor(C.burgundyMid).circle(EB_X + 12, EB_Y + 9, 4).fill();
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C.burgundy)
        .text('ETHEREUM VERIFIED', EB_X + 22, EB_Y + 5, { width: EB_W - 26, characterSpacing: 0.5 });

      // ── Certificate ID (below Ethereum badge, own row) ──
      const ID_Y = EB_Y + 24;
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor(C.inkLight)
        .text('CERTIFICATE ID', SIG_X, ID_Y, { width: SIG_W, align: 'center', characterSpacing: 1.5 });

      const shortId = certificateData.certificateId.length > 28
        ? certificateData.certificateId.substring(0, 12) + '…' + certificateData.certificateId.slice(-10)
        : certificateData.certificateId;
      doc.font('Helvetica').fontSize(8).fillColor(C.inkMid)
        .text(shortId, SIG_X, ID_Y + 11, { width: SIG_W, align: 'center' });

      // ── RIGHT: QR code ──
      const QR_SIZE = 88;
      const QR_X    = W - 48 - QR_SIZE;
      const QR_Y    = FOOT_Y - 4;

      doc.roundedRect(QR_X - 6, QR_Y - 6, QR_SIZE + 12, QR_SIZE + 12, 5)
        .fillColor(C.burgundyFaint).fill();
      doc.roundedRect(QR_X - 6, QR_Y - 6, QR_SIZE + 12, QR_SIZE + 12, 5)
        .strokeColor(C.burgundyPale).lineWidth(0.8).stroke();

      const qrImage = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
      doc.image(qrImage, QR_X, QR_Y, { width: QR_SIZE, height: QR_SIZE });

      doc.font('Helvetica-Bold').fontSize(6.5).fillColor(C.inkLight)
        .text('SCAN TO VERIFY', QR_X - 6, QR_Y + QR_SIZE + 8,
          { width: QR_SIZE + 12, align: 'center', characterSpacing: 1 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;