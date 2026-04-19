import html2pdf from 'html2pdf.js';

export const generateAndDownloadCertificatePDF = async (certificateData) => {
  try {
    // Generate QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      `https://verify.vault.io/cert/${certificateData.certificateId}`
    )}`;

    // Format the issue date
    const issueDate = new Date(certificateData.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create a simpler HTML template that renders better to PDF
    const certificateHTML = `
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; }
          body { 
            font-family: Georgia, serif; 
            background: white; 
            margin: 0;
            padding: 0;
          }
          .certificate {
            width: 11in;
            height: 8.5in;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #f0f5ff 100%);
            padding: 50px 60px;
            position: relative;
            box-sizing: border-box;
            page-break-after: always;
            border: 3px solid #ddd;
          }
          
          .top-bar {
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            position: absolute;
            top: 0;
            left: 0;
          }
          
          .bottom-bar {
            width: 100%;
            height: 6px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            position: absolute;
            bottom: 0;
            left: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .logo {
            font-size: 16px;
            color: #667eea;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 2px;
          }
          
          .tagline {
            font-size: 10px;
            color: #999;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          
          .title {
            text-align: center;
            font-size: 54px;
            color: #667eea;
            font-weight: bold;
            letter-spacing: 2px;
            margin: 25px 0 5px 0;
          }
          
          .subtitle {
            text-align: center;
            font-size: 16px;
            color: #764ba2;
            font-style: italic;
            margin-bottom: 25px;
          }
          
          .content {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .label {
            font-size: 13px;
            color: #999;
            margin-bottom: 5px;
          }
          
          .name {
            font-size: 28px;
            color: #667eea;
            font-weight: bold;
            margin: 8px 0 15px 0;
          }
          
          .course {
            font-size: 20px;
            color: #764ba2;
            font-style: italic;
            margin: 8px 0;
          }
          
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            border-top: 2px solid rgba(102, 126, 234, 0.2);
            padding-top: 15px;
          }
          
          .qr-box {
            text-align: center;
            flex: 0 0 auto;
          }
          
          .qr-image {
            width: 90px;
            height: 90px;
            border: 2px solid #667eea;
            padding: 4px;
            background: white;
            margin-bottom: 6px;
          }
          
          .qr-text {
            font-size: 8px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .middle-info {
            flex: 1;
            display: flex;
            justify-content: center;
            gap: 100px;
            text-align: center;
          }
          
          .info-item {
            font-size: 11px;
          }
          
          .info-label {
            font-size: 8px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            font-weight: bold;
          }
          
          .info-value {
            font-size: 12px;
            color: #333;
            font-weight: 600;
          }
          
          .signature-box {
            flex: 0 0 auto;
            text-align: center;
          }
          
          .sig-line {
            width: 100px;
            border-top: 1.5px solid #333;
            margin-bottom: 4px;
          }
          
          .sig-name {
            font-size: 11px;
            font-weight: 600;
            color: #333;
          }
          
          .sig-title {
            font-size: 9px;
            color: #999;
            font-style: italic;
          }
          
          .badge {
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 8px;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: bold;
            padding: 6px 10px;
            border: 1px solid #667eea;
            border-radius: 3px;
            background: rgba(255,255,255,0.8);
          }
          
          .cert-id {
            text-align: center;
            font-size: 8px;
            color: #999;
            margin-top: 8px;
            font-family: monospace;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="top-bar"></div>
          <div class="bottom-bar"></div>
          
          <div class="header">
            <div class="logo">📚 Student Document Vault</div>
            <div class="tagline">Blockchain Verified Certificates</div>
          </div>
          
          <div class="title">CERTIFICATE</div>
          <div class="subtitle">of Achievement</div>
          
          <div class="content">
            <div class="label">This is to certify that</div>
            <div class="name">${certificateData.studentName}</div>
            <div class="label">has successfully completed</div>
            <div class="course">${certificateData.courseName}</div>
          </div>
          
          <div class="footer">
            <div class="qr-box">
              <img src="${qrCodeUrl}" class="qr-image" alt="QR Code">
              <div class="qr-text">Scan to Verify</div>
            </div>
            
            <div class="middle-info">
              <div class="info-item">
                <div class="info-label">Date Issued</div>
                <div class="info-value">${issueDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Issued By</div>
                <div class="info-value">${certificateData.issuerName}</div>
              </div>
            </div>
            
            <div class="signature-box">
              <div class="sig-line"></div>
              <div class="sig-name">${certificateData.issuerName}</div>
              <div class="sig-title">Authorized Issuer</div>
            </div>
          </div>
          
          <div class="cert-id">
            <strong>Certificate ID:</strong> ${certificateData.certificateId}
          </div>
          
          <div class="badge">✓ Blockchain Verified</div>
        </div>
      </body>
      </html>
    `;

    // Configure html2pdf options - simplified for better rendering
    const options = {
      margin: [0, 0, 0, 0],
      filename: `Certificate_${certificateData.studentName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: [11, 8.5], orientation: 'landscape' },
    };

    // Generate and download PDF
    html2pdf().set(options).from(certificateHTML).save();

    console.log('✅ Certificate PDF generated and downloaded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error generating certificate PDF:', error);
    throw error;
  }
};
