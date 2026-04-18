/**
 * In-Memory Database for Student Document Vault
 * No MongoDB needed - everything stored in RAM
 */

class InMemoryDB {
  constructor() {
    this.certificates = {};
    this.users = {};
    this.certificateId = 1;
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
