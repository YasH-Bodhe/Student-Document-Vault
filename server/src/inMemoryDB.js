/**
 * In-Memory Database with JSON File Persistence for Student Document Vault
 * Stores data in both RAM (for speed) and JSON file (for persistence)
 */

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../database.json');

class InMemoryDB {
  constructor() {
    this.certificates = {};
    this.users = {};
    this.certificateId = 1;
    
    // Load data from file on startup
    this.loadFromFile();
  }

  /**
   * Load data from JSON file
   */
  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        this.certificates = parsed.certificates || {};
        this.users = parsed.users || {};
        this.certificateId = parsed.certificateId || 1;
        console.log('✅ Database loaded from file:', Object.keys(this.certificates).length, 'certificates');
      } else {
        console.log('📄 No existing database file found, starting fresh');
        this.saveToFile();
      }
    } catch (error) {
      console.error('❌ Error loading database from file:', error.message);
      console.log('⚠️  Starting with empty database');
    }
  }

  /**
   * Save data to JSON file
   */
  saveToFile() {
    try {
      const data = {
        certificates: this.certificates,
        users: this.users,
        certificateId: this.certificateId,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('❌ Error saving database to file:', error.message);
    }
  }

  // Certificate operations
  saveCertificate(data) {
    // Use provided certificateId or generate one
    const id = data.certificateId || `cert-${this.certificateId++}`;
    const certificate = {
      certificateId: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      isValid: true,
      verificationCount: 0,
    };
    this.certificates[id] = certificate;
    this.saveToFile(); // 💾 Persist to file
    return certificate;
  }

  getCertificateById(id) {
    return this.certificates[id] || null;
  }

  getCertificatesByStudent(studentAddress) {
    return Object.values(this.certificates).filter(
      (cert) => cert.studentAddress.toLowerCase() === studentAddress.toLowerCase()
    );
  }

  getAllCertificates() {
    return Object.values(this.certificates);
  }

  revokeCertificate(certificateId) {
    if (this.certificates[certificateId]) {
      this.certificates[certificateId].isValid = false;
      this.certificates[certificateId].updatedAt = new Date();
      this.saveToFile(); // 💾 Persist to file
      return true;
    }
    return false;
  }

  updateCertificate(certificateId, data) {
    if (this.certificates[certificateId]) {
      this.certificates[certificateId] = {
        ...this.certificates[certificateId],
        ...data,
        updatedAt: new Date(),
      };
      this.saveToFile(); // 💾 Persist to file
      return this.certificates[certificateId];
    }
    return null;
  }

  // Statistics
  getStats() {
    const certs = Object.values(this.certificates);
    return {
      totalCertificates: certs.length,
      validCertificates: certs.filter((c) => c.isValid).length,
      revokedCertificates: certs.filter((c) => !c.isValid).length,
      uniqueStudents: new Set(certs.map((c) => c.studentAddress.toLowerCase())).size,
    };
  }

  getRecentCertificates(limit = 10) {
    return Object.values(this.certificates)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
}

// Export singleton instance
module.exports = new InMemoryDB();
