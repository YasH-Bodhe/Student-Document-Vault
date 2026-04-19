/**
 * Certificate PDF Generation Utility
 * Generates premium downloadable PDF certificates with QR code
 */

const generateCertificatePDF = (certificateData) => {
  // Generate QR code data URL using external API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://verify.vault.io/cert/${certificateData.certificateId}`)}`;
  
  const issueDate = new Date(certificateData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - ${certificateData.studentName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        @media print {
            body { margin: 0; padding: 0; }
            .certificate { page-break-after: always; box-shadow: none; }
        }
        html, body {
            width: 100%;
            height: 100%;
        }
        body {
            font-family: 'Segoe UI', 'Georgia', serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
            padding: 20px;
            color: #333;
        }
        .certificate {
            width: 1000px;
            max-width: 100%;
            aspect-ratio: 1.414 / 1;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #f0f5ff 100%);
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
            border: 2px solid #ddd;
        }

        /* Decorative Elements */
        .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .certificate::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .corner-decoration {
            position: absolute;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(102, 126, 234, 0.15);
        }

        .corner-tl {
            top: 20px;
            left: 20px;
            border-right: none;
            border-bottom: none;
        }

        .corner-br {
            bottom: 20px;
            right: 20px;
            border-left: none;
            border-top: none;
        }

        .content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
        }

        .header {
            margin-bottom: 20px;
        }

        .org-logo {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .org-tagline {
            font-size: 12px;
            color: #999;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .certificate-title {
            font-size: 72px;
            font-weight: 700;
            color: #667eea;
            margin: 30px 0 10px 0;
            letter-spacing: 2px;
        }

        .certificate-subtitle {
            font-size: 20px;
            color: #764ba2;
            font-style: italic;
            margin-bottom: 30px;
            font-weight: 300;
        }

        .info-section {
            margin: 20px 0;
        }

        .info-row {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 15px 0;
            gap: 20px;
        }

        .info-block {
            flex: 1;
        }

        .info-label {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            color: #999;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .info-value {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            word-break: break-all;
        }

        .info-value.student-name {
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
        }

        .info-value.course-name {
            font-size: 22px;
            color: #764ba2;
            font-style: italic;
        }

        .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 30px;
            border-top: 2px solid rgba(102, 126, 234, 0.2);
            padding-top: 20px;
        }

        .qr-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .qr-code {
            width: 120px;
            height: 120px;
            border: 3px solid #667eea;
            padding: 8px;
            background: white;
            margin-bottom: 10px;
        }

        .qr-label {
            font-size: 10px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .certificate-id {
            font-size: 11px;
            font-family: 'Courier New', monospace;
            color: #999;
            word-break: break-all;
            max-width: 250px;
        }

        .signature-section {
            display: flex;
            justify-content: space-around;
            flex: 1;
        }

        .signature {
            text-align: center;
        }

        .signature-line {
            width: 120px;
            border-top: 2px solid #333;
            margin: 30px 0 5px 0;
        }

        .signature-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }

        .signature-title {
            font-size: 11px;
            color: #999;
            font-style: italic;
        }

        .blockchain-badge {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 10px;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: bold;
            padding: 8px 12px;
            border: 1px solid #667eea;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="corner-decoration corner-tl"></div>
        <div class="corner-decoration corner-br"></div>

        <div class="content">
            <!-- Header -->
            <div class="header">
                <div class="org-logo">📚 Student Document Vault</div>
                <div class="org-tagline">Blockchain Verified Certificates</div>
            </div>

            <!-- Title -->
            <div>
                <div class="certificate-title">CERTIFICATE</div>
                <div class="certificate-subtitle">of Achievement</div>
            </div>

            <!-- Student Info -->
            <div class="info-section">
                <div style="font-size: 16px; color: #999; margin-bottom: 10px;">This is to certify that</div>
                <div class="info-value student-name">${certificateData.studentName}</div>
                <div style="font-size: 14px; color: #999; margin: 15px 0;">has successfully completed</div>
                <div class="info-value course-name">${certificateData.courseName}</div>
            </div>

            <!-- Date and Details -->
            <div class="info-row" style="justify-content: center; gap: 60px;">
                <div class="info-block">
                    <div class="info-label">Date Issued</div>
                    <div class="info-value">${issueDate}</div>
                </div>
                <div class="info-block">
                    <div class="info-label">Issuer</div>
                    <div class="info-value">${certificateData.issuerName}</div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer-section">
                <div class="qr-section">
                    <img src="${qrCodeUrl}" alt="QR Code" class="qr-code">
                    <div class="qr-label">Scan to Verify</div>
                </div>

                <div class="signature-section">
                    <div class="signature">
                        <div class="signature-line"></div>
                        <div class="signature-name">${certificateData.issuerName}</div>
                        <div class="signature-title">Authorized Issuer</div>
                    </div>
                </div>
            </div>

            <!-- Certificate ID -->
            <div style="margin-top: 10px; text-align: center;">
                <div class="info-label">Certificate ID</div>
                <div class="certificate-id">${certificateData.certificateId}</div>
            </div>
        </div>

        <div class="blockchain-badge">✓ Blockchain Verified</div>
    </div>
</body>
</html>
  `;

  return html;
};

module.exports = generateCertificatePDF;
