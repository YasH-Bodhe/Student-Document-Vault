import QRCode from 'qrcode.react';

/**
 * Generate a professional certificate template
 */
export const generateCertificateTemplate = (studentName, courseName, issueDate, issuerName, certificateId) => {
  return `
    <div style="width: 100%; max-width: 900px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; color: white; font-family: 'Georgia', serif; position: relative; overflow: hidden;">
      
      <!-- Watermark -->
      <div style="position: absolute; top: 20px; right: 30px; opacity: 0.8; font-size: 24px; font-weight: bold;">
        🔐 YASH BODHE
      </div>

      <!-- Certificate Content -->
      <div style="text-align: center; position: relative; z-index: 1;">
        
        <!-- Title -->
        <h1 style="font-size: 48px; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
          CERTIFICATE OF ACHIEVEMENT
        </h1>

        <div style="border-bottom: 3px solid rgba(255,255,255,0.5); margin: 30px 0;"></div>

        <!-- Body Text -->
        <p style="font-size: 18px; margin: 20px 0; opacity: 0.95;">
          This is to certify that
        </p>

        <h2 style="font-size: 36px; margin: 20px 0; font-weight: bold; text-decoration: underline;">
          ${studentName}
        </h2>

        <p style="font-size: 18px; margin: 20px 0;">
          has successfully completed and demonstrated exceptional proficiency in
        </p>

        <h3 style="font-size: 28px; margin: 20px 0; font-style: italic;">
          ${courseName}
        </h3>

        <p style="font-size: 16px; margin: 30px 0;">
          Issued on: <strong>${new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
        </p>

        <div style="margin: 40px 0;">
          <p style="font-size: 16px; margin: 10px 0;">By</p>
          <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">${issuerName}</p>
          <div style="border-bottom: 2px solid rgba(255,255,255,0.7); width: 250px; margin: 20px auto;"></div>
          <p style="font-size: 12px; opacity: 0.9; margin-top: 10px;">Authorized Signatory</p>
        </div>

        <!-- Certificate ID -->
        <div style="margin-top: 40px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
          <p style="font-size: 12px; margin: 0; opacity: 0.9;">Certificate ID:</p>
          <p style="font-size: 14px; font-family: 'Courier New', monospace; word-break: break-all;">${certificateId}</p>
        </div>

        <!-- Blockchain Verification Note -->
        <div style="margin-top: 20px; font-size: 12px; opacity: 0.9;">
          Verified on Ethereum Blockchain • Immutable & Tamper-Proof
        </div>

      </div>
    </div>
  `;
};

/**
 * Generate QR code for certificate verification
 */
export const generateQRCodeURL = (certificateId, baseUrl = 'http://localhost:5173') => {
  return `${baseUrl}/verify?certId=${certificateId}`;
};

/**
 * Download certificate as image
 */
export const downloadCertificate = (certificateId, studentName) => {
  const element = document.getElementById(`certificate-${certificateId}`);
  if (!element) return;

  const canvas = document.querySelector(`#certificate-${certificateId} canvas`);
  if (!canvas) return;

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `certificate-${studentName}-${certificateId}.png`;
  link.click();
};

/**
 * Copy certificate ID to clipboard
 */
export const copyCertificateID = async (certificateId) => {
  try {
    await navigator.clipboard.writeText(certificateId);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Format certificate ID for display
 */
export const formatCertificateId = (certificateId) => {
  if (!certificateId) return '';
  return `${certificateId.substring(0, 10)}...${certificateId.substring(certificateId.length - 10)}`;
};

/**
 * Format Ethereum address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};
