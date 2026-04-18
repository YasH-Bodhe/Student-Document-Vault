import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../utils/certificateUtils';
import { FiLoader } from 'react-icons/fi';

const CertificateDetailPage = () => {
  const { certificateId } = useParams();
  const { getCertificateDetails, getVerificationDetails } = useApi();
  
  const [certificate, setCertificate] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (certificateId) {
      fetchCertificateDetails();
    }
  }, [certificateId]);

  const fetchCertificateDetails = async () => {
    setLoading(true);
    setError('');

    const certResult = await getCertificateDetails(certificateId);
    const verifyResult = await getVerificationDetails(certificateId);

    if (certResult?.data) {
      setCertificate(certResult.data);
    } else {
      setError('Certificate not found');
    }

    if (verifyResult?.verification) {
      setVerification(verifyResult.verification);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiLoader className="text-5xl animate-spin mx-auto mb-4 text-purple-500" />
        <p>Loading certificate details...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Certificate Not Found</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      <div className="glass p-12 rounded-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Certificate Details</h1>
          <p className="text-gray-400">{certificate.studentName}</p>
        </div>

        {/* Certificate Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400">Student Name</label>
              <p className="text-xl font-semibold">{certificate.studentName}</p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-400">Course</label>
              <p className="text-xl font-semibold">{certificate.courseName}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400">Issued Date</label>
              <p className="text-xl font-semibold">{formatDate(certificate.issueDate)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400">Issuer</label>
              <p className="text-xl font-semibold">{certificate.issuerName}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400">Status</label>
              <p className={`text-xl font-semibold ${certificate.isValid ? 'text-green-400' : 'text-red-400'}`}>
                {certificate.isValid ? '✓ Valid' : '✗ Revoked'}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400">Verifications</label>
              <p className="text-xl font-semibold">{certificate.verificationCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-8">
          <label className="text-sm font-semibold text-gray-400 block mb-2">Certificate ID</label>
          <code className="text-sm font-mono break-all leading-relaxed">
            {certificate.certificateId}
          </code>
        </div>

        {/* Verification Status */}
        {verification && (
          <div className={`p-6 rounded-lg border ${verification.isValid ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            <h3 className="font-semibold mb-2">Blockchain Verification</h3>
            <p className={verification.isValid ? 'text-green-300' : 'text-red-300'}>
              {verification.isValid ? '✓ Verified on blockchain' : '✗ Not found on blockchain'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateDetailPage;
