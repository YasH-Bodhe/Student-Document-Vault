import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useApi } from '../hooks/useApi';
import { useContract } from '../hooks/useContract';
import QRCode from 'qrcode.react';
import { FiDownload, FiLoader, FiCheck, FiCopy, FiX } from 'react-icons/fi';

const AdminDashboard = () => {
  const { account, isConnected } = useWallet();
  const { getAdminDashboard, downloadCertificate } = useApi();
  const { contract, issueCertificate: issueViaContract, loading: contractLoading, error: contractError } = useContract(import.meta.env.VITE_CONTRACT_ADDRESS);
  const { storeCertificateMetadata } = useApi();
  
  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    courseName: '',
    issuerName: 'YASH BODHE',
    certificateHash: '',
  });

  const [issueLoading, setIssueLoading] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState(null);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isConnected) {
      fetchDashboard();
    }
  }, [isConnected]);

  const fetchDashboard = async () => {
    const result = await getAdminDashboard(account);
    if (result) {
      setDashboard(result.dashboard);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setIssueLoading(true);
    setError('');
    setIssueSuccess(null);

    try {
      // Validate and normalize address
      let checksumAddress;
      try {
        checksumAddress = ethers.getAddress(formData.studentAddress.trim().toLowerCase());
      } catch (err) {
        setError('Invalid Ethereum address');
        setIssueLoading(false);
        return;
      }

      // Call smart contract directly - THIS TRIGGERS METAMASK!
      console.log('🔐 Calling smart contract to issue certificate...');
      const receipt = await issueViaContract(
        checksumAddress,
        formData.studentName,
        formData.courseName,
        formData.issuerName,
        formData.certificateHash
      );

      if (receipt) {
        // Save certificate metadata to backend database
        const metadataPayload = {
          certificateId: receipt.certificateId,
          studentAddress: checksumAddress,
          studentName: formData.studentName,
          courseName: formData.courseName,
          issuerAddress: account,
          issuerName: formData.issuerName,
          certificateHash: formData.certificateHash,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          blockchainTxHash: receipt.transactionHash,
          qrCodeData: `https://verify.vault/${receipt.certificateId}`,
        };
        
        console.log('💾 Saving certificate metadata to backend...');
        await storeCertificateMetadata(metadataPayload);
        console.log('✅ Certificate metadata saved to backend!');
        
        setIssueSuccess({
          success: true,
          certificateId: receipt.certificateId || 'Issued',
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        });
        
        console.log('✅ Certificate issued on blockchain!');
        console.log('📝 Certificate ID:', receipt.certificateId);
        console.log('📝 Transaction:', receipt.transactionHash);
        
        setFormData({
          studentAddress: '',
          studentName: '',
          courseName: '',
          issuerName: 'YASH BODHE',
          certificateHash: '',
        });

        // Refresh dashboard
        setTimeout(fetchDashboard, 2000);
      } else {
        setError(contractError || 'Failed to issue certificate');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIssueLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Admin Panel</h1>
        <p className="text-gray-600 mb-8">Please connect your MetaMask wallet to admin account</p>
        <p className="text-gray-500 text-sm">(Authorized Admin: 0xf39F...2266)</p>
      </div>
    );
  }

  // Check if connected account is admin
  const isAdmin = account?.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Access Denied</h1>
        <p className="text-red-500 mb-4">❌ Only authorized admins can access this panel</p>
        <p className="text-gray-600">Connected: {account?.substring(0, 10)}...</p>
        <p className="text-gray-500 text-sm mt-4">Authorized Admin: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</p>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadCertificate = async (certificate) => {
    try {
      console.log('📥 Downloading premium certificate PDF...', certificate.certificateId);
      await downloadCertificate(certificate.certificateId);
      console.log('✅ Certificate PDF downloaded successfully!');
      setError('');
    } catch (err) {
      console.error('❌ Download failed:', err);
      setError('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400">Manage student certificates on blockchain</p>
        </div>

        {/* Dashboard Stats */}
        {dashboard && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="glass p-6 rounded-xl">
              <p className="text-3xl font-bold gradient-text mb-2">{dashboard.database?.totalCertificates}</p>
              <p className="text-gray-400">Total Certificates</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-3xl font-bold text-green-400 mb-2">{dashboard.database?.validCertificates}</p>
              <p className="text-gray-400">Valid Certificates</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-3xl font-bold text-red-400 mb-2">{dashboard.database?.revokedCertificates}</p>
              <p className="text-gray-400">Revoked Certificates</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-3xl font-bold text-blue-400 mb-2">{dashboard.database?.uniqueStudents}</p>
              <p className="text-gray-400">Unique Students</p>
            </div>
          </div>
        )}

        {/* Issue Certificate Form */}
        <div className="glass p-8 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Issue New Certificate</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {issueSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-xl" />
                  <span>✅ Certificate issued on blockchain! 🎉</span>
                </div>
                <button 
                  onClick={() => setIssueSuccess(null)}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* CERTIFICATE ID - HIGHLIGHTED */}
                <div className="bg-blue-500/30 p-4 rounded border-2 border-blue-400 shadow-lg">
                  <p className="text-xs text-blue-200 mb-2 font-bold">🆔 CERTIFICATE ID (Use this to verify):</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-mono font-bold break-all text-blue-100">{issueSuccess.certificateId}</p>
                    <button 
                      onClick={() => copyToClipboard(issueSuccess.certificateId)}
                      className="flex-shrink-0 hover:text-blue-200 transition"
                      title="Copy Certificate ID"
                    >
                      <FiCopy className="text-2xl" />
                    </button>
                  </div>
                  {copied && <p className="text-sm mt-2 text-blue-200">✓ Certificate ID copied to clipboard!</p>}
                </div>

                {/* Transaction Hash - Secondary */}
                {issueSuccess.transactionHash && (
                  <div className="bg-white/5 p-3 rounded border border-white/10">
                    <p className="text-xs text-gray-300 mb-1">✓ Blockchain Transaction Hash:</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-mono break-all">{issueSuccess.transactionHash}</p>
                      <button 
                        onClick={() => copyToClipboard(issueSuccess.transactionHash)}
                        className="flex-shrink-0 hover:text-blue-300 transition"
                        title="Copy TX Hash"
                      >
                        <FiCopy className="text-lg" />
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Block Number */}
                {issueSuccess.blockNumber && (
                  <div className="bg-white/5 p-3 rounded border border-white/10">
                    <p className="text-xs text-gray-300 mb-1">📦 Block Number:</p>
                    <p className="text-sm font-mono">{issueSuccess.blockNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleIssueCertificate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Student Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">Student Ethereum Address</label>
                <input
                  type="text"
                  name="studentAddress"
                  value={formData.studentAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Student Full Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="Blockchain Development 101"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Issuer Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Issuer Name</label>
                <input
                  type="text"
                  name="issuerName"
                  value={formData.issuerName}
                  onChange={handleInputChange}
                  placeholder="Institution Name"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Certificate Hash */}
            <div>
              <label className="block text-sm font-semibold mb-2">Certificate Hash (IPFS/Metadata)</label>
              <input
                type="text"
                name="certificateHash"
                value={formData.certificateHash}
                onChange={handleInputChange}
                placeholder="QmXxxx... or metadata hash"
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={issueLoading || !contract}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {issueLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
              {issueLoading ? 'Confirm in MetaMask...' : '🦊 Sign & Issue Certificate'}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">💡 MetaMask popup will appear on your screen</p>
          </form>
        </div>

        {/* Recent Certificates */}
        {dashboard?.recentCertificates && dashboard.recentCertificates.length > 0 && (
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Recent Certificates</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboard.recentCertificates.map((cert) => (
                <div 
                  key={cert._id} 
                  onClick={() => setSelectedCert(cert)}
                  className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-white/10 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold hover:text-purple-400 transition">{cert.studentName}</h3>
                      <p className="text-sm text-gray-400">{cert.courseName}</p>
                      <p className="text-xs text-gray-500 mt-2 font-mono break-all">{cert.certificateIdDisplay || cert.certificateId}</p>
                      <p className="text-xs text-gray-600 mt-1">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${cert.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {cert.isValid ? 'Valid' : 'Revoked'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <p className="text-gray-400 text-sm">Certificate ID</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-white font-mono text-sm break-all bg-white/5 p-3 rounded flex-1">{selectedCert.certificateId}</p>
                    <button 
                      onClick={() => copyToClipboard(selectedCert.certificateId)}
                      className="bg-blue-600 hover:bg-blue-700 p-3 rounded transition"
                    >
                      <FiCopy className="text-white" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Issue Date</p>
                  <p className="text-white font-semibold">{new Date(selectedCert.issueDate).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
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
                      handleDownloadCertificate(selectedCert);
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
    </div>
  );
};

export default AdminDashboard;
