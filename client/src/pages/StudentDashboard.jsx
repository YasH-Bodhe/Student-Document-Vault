import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useApi } from '../hooks/useApi';
import { useContract } from '../hooks/useContract';
import { formatDate, formatCertificateId } from '../utils/certificateUtils';
import { FiCheckCircle, FiXCircle, FiLoader, FiCopy, FiDownload, FiX } from 'react-icons/fi';

const StudentDashboard = () => {
  const { account, isConnected } = useWallet();
  const { getStudentCertificates, getCertificateDetails, downloadCertificate } = useApi();
  const { contract } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      fetchCertificates();
    }
  }, [account, isConnected]);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await getStudentCertificates(account);
      if (response?.data) {
        setCertificates(response.data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Connect Wallet</h1>
        <p className="text-gray-600 mb-8">Please connect your MetaMask wallet to view your certificates</p>
        <div className="glass p-8 rounded-xl">
          <p>🔐 Your wallet is not connected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Certificates</h1>
        <p className="text-gray-600">Your blockchain-verified certificates from {account?.substring(0, 6)}...</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass p-12 rounded-xl text-center">
          <FiLoader className="text-4xl animate-spin mx-auto mb-4 text-purple-500" />
          <p>Loading your certificates...</p>
        </div>
      )}

      {/* Certificates Grid */}
      {!loading && certificates.length > 0 ? (
        <div className="bento-grid">
          {certificates.map((cert) => (
            <div key={cert.certificateId} className="certificate-card group cursor-pointer" onClick={() => setSelectedCert(cert)}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition">{cert.studentName}</h3>
                  <p className="text-sm text-gray-500">{cert.courseName}</p>
                </div>
                {cert.isValid ? (
                  <FiCheckCircle className="text-green-500 text-2xl" />
                ) : (
                  <FiXCircle className="text-red-500 text-2xl" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm"><span className="font-semibold">Issued:</span> {formatDate(cert.createdAt || cert.issueDate)}</p>
                <p className="text-sm"><span className="font-semibold">By:</span> {cert.issuerName}</p>
                <p className="text-sm font-mono text-xs break-all"><span className="font-semibold">ID:</span> <br/>{cert.certificateId}</p>
              </div>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cert.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {cert.isValid ? 'Valid' : 'Revoked'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                  Verified: {cert.verificationCount || cert.verifications || 0}x
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="glass p-12 rounded-xl text-center">
          <p className="text-lg text-gray-600">📄 No certificates found</p>
          <p className="text-sm text-gray-500 mt-2">Your issued certificates will appear here</p>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4" onClick={() => setSelectedCert(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto border border-purple-500/30" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{selectedCert.studentName}</h2>
              <button onClick={() => setSelectedCert(null)} className="hover:bg-white/20 p-2 rounded-lg transition">
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Course</p>
                <p className="text-white font-semibold">{selectedCert.courseName}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Issue Date</p>
                <p className="text-white font-semibold">{formatDate(selectedCert.createdAt || selectedCert.issueDate)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Issued By</p>
                <p className="text-white font-semibold">{selectedCert.issuerName}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Certificate ID</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-white font-mono text-sm break-all bg-white/5 p-3 rounded flex-1">{selectedCert.certificateId}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedCert.certificateId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded transition"
                  >
                    <FiCopy className="text-white" />
                  </button>
                </div>
                {copied && <p className="text-xs text-green-400 mt-1">✓ Copied to clipboard</p>}
              </div>

              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold mt-2 ${selectedCert.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {selectedCert.isValid ? '✓ Valid' : '✗ Revoked'}
                </span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    downloadCertificate(selectedCert.certificateId);
                    setSelectedCert(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition text-white"
                >
                  <FiDownload />
                  Download
                </button>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition bg-white/10 hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
