import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useApi } from '../hooks/useApi';
import { useContract } from '../hooks/useContract';
import { formatDate, formatCertificateId } from '../utils/certificateUtils';
import { FiCheckCircle, FiXCircle, FiLoader, FiCopy, FiDownload, FiX } from 'react-icons/fi';
import QRCode from 'qrcode.react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Connect Wallet</h1>
          <p className="text-gray-400 mb-8">Please connect your MetaMask wallet to view your certificates</p>
          <div className="glass-premium p-8 rounded-2xl">
            <p className="text-lg">🔐 Your wallet is not connected</p>
            <p className="text-sm text-gray-400 mt-3">Use the "Connect MetaMask" button at the top to proceed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="mb-12 animate-slide-in">
        <h1 className="text-5xl font-bold mb-3 gradient-text">My Certificates</h1>
        <p className="text-lg text-gray-400">Your blockchain-verified credentials from {account?.substring(0, 6)}...{account?.substring(account.length - 4)}</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-premium p-12 rounded-2xl text-center">
          <FiLoader className="text-5xl animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-lg">Loading your certificates...</p>
        </div>
      )}

      {/* Certificates Grid */}
      {!loading && certificates.length > 0 ? (
        <div className="bento-grid">
          {certificates.map((cert) => (
            <div key={cert.certificateId} className="certificate-card group cursor-pointer" onClick={() => setSelectedCert(cert)}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold group-hover:text-purple-400 transition mb-1">{cert.studentName}</h3>
                  <p className="text-sm text-gray-400">{cert.courseName}</p>
                </div>
                
                {/* QR Code on Right */}
                <div className="flex-shrink-0 bg-white p-2 rounded-lg">
                  <QRCode value={`https://verify.vault.io/cert/${cert.certificateId}`} size={80} level="H" includeMargin={true} />
                </div>

                {cert.isValid ? (
                  <FiCheckCircle className="text-green-400 text-3xl flex-shrink-0" />
                ) : (
                  <FiXCircle className="text-red-400 text-3xl flex-shrink-0" />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-300"><span className="font-semibold">Issued:</span> {formatDate(cert.createdAt || cert.issueDate)}</p>
                <p className="text-xs text-gray-300"><span className="font-semibold">By:</span> {cert.issuerName}</p>
                <p className="text-xs text-gray-400 font-mono break-all"><span className="font-semibold">ID:</span> {cert.certificateId.substring(0, 16)}...</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cert.isValid ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                  {cert.isValid ? '✓ Valid' : '✗ Revoked'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-300">
                  {cert.verificationCount || cert.verifications || 0}x Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="glass-premium p-16 rounded-2xl text-center">
          <p className="text-2xl font-semibold gradient-text">📄 No certificates yet</p>
          <p className="text-gray-400 mt-2">Your issued certificates will appear here</p>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4" onClick={() => setSelectedCert(null)}>
          <div className="glass-premium rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">{selectedCert.studentName}</h2>
              <button onClick={() => setSelectedCert(null)} className="btn-icon text-white hover:text-gray-200">
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Course</p>
                <p className="text-white font-semibold text-lg mt-2">{selectedCert.courseName}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Issue Date</p>
                <p className="text-white font-semibold text-lg mt-2">{formatDate(selectedCert.createdAt || selectedCert.issueDate)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Issued By</p>
                <p className="text-white font-semibold text-lg mt-2">{selectedCert.issuerName}</p>
              </div>

              {/* QR Code in Modal */}
              <div className="flex justify-center p-4 bg-white/5 rounded-lg border border-white/10">
                <QRCode value={`https://verify.vault.io/cert/${selectedCert.certificateId}`} size={120} level="H" includeMargin={true} />
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Certificate ID</p>
                <div className="flex items-center gap-2 mt-3">
                  <p className="text-white font-mono text-sm break-all bg-white/5 p-3 rounded-lg flex-1 border border-white/10">{selectedCert.certificateId}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedCert.certificateId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition transform hover:scale-110"
                  >
                    <FiCopy className="text-white" />
                  </button>
                </div>
                {copied && <p className="text-xs text-green-400 mt-2">✓ Copied to clipboard</p>}
              </div>

              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Status</p>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold mt-3 ${selectedCert.isValid ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                  {selectedCert.isValid ? '✓ Valid Certificate' : '✗ Revoked Certificate'}
                </span>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/10">
                <button 
                  onClick={() => {
                    downloadCertificate(selectedCert.certificateId);
                    setSelectedCert(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 rounded-lg font-semibold transition text-white transform hover:scale-105 hover:shadow-lg"
                >
                  <FiDownload />
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold transition bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StudentDashboard;
