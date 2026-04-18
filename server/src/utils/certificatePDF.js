/**
 * Certificate PDF Generation Utility
 * Generates downloadable PDF certificates
 */

const generateCertificatePDF = (certificateData) => {
  // This is a simple HTML template that can be printed to PDF
  // In production, use a library like puppeteer or pdfkit
  
  // Generate QR code data URL using external API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://verify.vault.io/cert/${certificateData.certificateId}`)}`;
  
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
        html, body {
            width: 100%;
            height: 100%;
        }
        body {
            font-family: 'Georgia', serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            padding: 20px;
        }
        .certificate {
            width: 8.5in;
            height: 11in;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 60px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
            page-break-after: always;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        .certificate::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
        }
        .content {
            position: relative;
            z-index: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .header {
            border-top: 3px solid rgba(255,255,255,0.3);
            border-bottom: 3px solid rgba(255,255,255,0.3);
            padding: 20px 0;
        }
        .logo {
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.9;
        }
        .title {
            font-size: 48px;
            font-weight: bold;
            margin: 40px 0 20px 0;
            letter-spacing: 1px;
        }
        .subtitle {
            font-size: 18px;
            font-style: italic;
            margin: 20px 0;
            opacity: 0.95;
        }
        .info {
            font-size: 16px;
            line-height: 2.5;
            margin: 30px 0;
        }
        .info-label {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
        }
        .info-value {
            font-size: 20px;
            font-weight: bold;
            margin-top: 5px;
        }
        .footer {
            border-top: 2px solid rgba(255,255,255,0.3);
            padding-top: 20px;
            font-size: 12px;
            margin-top: 20px;
        }
        .signature {
            display: flex;
            justify-content: space-around;
            margin-top: 40px;
            font-size: 12px;
        }
        .sig-box {
            border-top: 1px solid rgba(255,255,255,0.5);
            padding-top: 10px;
            width: 120px;
        }
        .blockchain-info {
            font-size: 10px;
            word-break: break-all;
            margin-top: 10px;
            opacity: 0.8;
            background: rgba(0,0,0,0.1);
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .certificate {
                box-shadow: none;
                width: 100%;
                height: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="content">
            <div class="header">
                <div class="logo">🎓 Student Document Vault</div>
            </div>
            
            <div>
                <div class="title">Certificate of Achievement</div>
                <div class="subtitle">Blockchain-Verified Certificate</div>
            </div>
            
            <div class="info">
                <div>This is to certify that</div>
                <div class="info-value">${certificateData.studentName}</div>
                <div style="margin-top: 20px;">has successfully completed</div>
                <div class="info-value" style="color: #ffd700;">${certificateData.courseName}</div>
                <div style="margin-top: 20px;">Issued by</div>
                <div class="info-value">${certificateData.issuerName}</div>
            </div>
            
            <div>
                <div style="margin-bottom: 20px; font-size: 14px;">
                    Date: ${new Date(certificateData.issueDate || certificateData.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 10px; margin-bottom: 10px; opacity: 0.8;">Scan to Verify Certificate:</div>
                    <img src="${qrCodeUrl}" style="width: 150px; height: 150px; margin: 0 auto; display: block;">
                </div>
                
                ${certificateData.blockchainTxHash ? `
                    <div class="blockchain-info">
                        <strong>Blockchain Verified</strong><br>
                        Transaction: ${certificateData.blockchainTxHash.substring(0, 20)}...<br>
                        Certificate ID: ${certificateData.certificateId.substring(0, 32)}...
                    </div>
                ` : ''}
                
                <div class="signature">
                    <div class="sig-box">
                        <div style="font-style: italic; margin-bottom: 5px;">Authorizer</div>
                        <div style="font-size: 10px; opacity: 0.7;">Admin Account</div>
                    </div>
                    <div class="sig-box">
                        <div style="font-style: italic; margin-bottom: 5px;">Verified</div>
                        <div style="font-size: 10px; opacity: 0.7;">Blockchain</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                🔗 Verify this certificate at: https://verify.vault.io/cert/${certificateData.certificateId}
            </div>
        </div>
    </div>
</body>
</html>
  `;
  
  return html;
};

module.exports = { generateCertificatePDF };
