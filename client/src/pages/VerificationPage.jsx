import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { formatDate, formatCertificateId } from '../utils/certificateUtils';
import { FiCheckCircle, FiXCircle, FiLoader, FiSearch } from 'react-icons/fi';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const { verifyCertificateById, verifyCertificateViaQR } = useApi();
  
  const [certificateId, setCertificateId] = useState(searchParams.get('certId') || '');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto verify if certificate ID is in URL
  useEffect(() => {
    if (searchParams.get('certId')) {
      verifyCert();
    }
  }, []);

  const verifyCert = async (e) => {
    if (e) e.preventDefault();

    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    const result = await verifyCertificateById(certificateId);
    
    if (result) {
      setVerificationResult(result);
    } else {
      setError('Certificate verification failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Verify Certificate</h1>
          <p className="text-lg text-gray-400">Check the authenticity of any blockchain-verified certificate</p>
        </div>

        {/* Search Form */}
        <div className="glass-premium p-8 rounded-2xl mb-8">
          <form onSubmit={verifyCert} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">Certificate ID or Hash</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Paste certificate ID to verify..."
                  className="input-modern flex-1"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 px-8 py-3"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
                  <span className="hidden sm:inline">Verify</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-premium p-12 rounded-2xl text-center">
            <FiLoader className="text-6xl animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-lg">Verifying on Ethereum blockchain...</p>
          </div>
        )}

        {/* Result - Valid Certificate */}
        {!loading && verificationResult && verificationResult.isValid && (
          <div className="glass-premium p-8 rounded-2xl border-2 border-green-500/50 animate-fade-in">
            <div className="flex items-center gap-6 mb-8">
              <FiCheckCircle className="text-7xl text-green-400 flex-shrink-0" />
              <div>
                <h2 className="text-4xl font-bold text-green-400">Certificate Valid</h2>
                <p className="text-gray-400 text-lg mt-1">✓ This is an authentic, blockchain-verified certificate</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Student Name</label>
                  <p className="text-xl font-semibold mt-2">{verificationResult.certificate?.studentName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Course Name</label>
                  <p className="text-xl font-semibold mt-2">{verificationResult.certificate?.courseName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Issue Date</label>
                  <p className="text-xl font-semibold mt-2">{formatDate(verificationResult.certificate?.issueDate)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Issuer</label>
                  <p className="text-xl font-semibold mt-2">{verificationResult.certificate?.issuerName}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">
                <strong>Certificate ID:</strong>
              </p>
              <code className="bg-white/5 px-4 py-3 rounded-lg font-mono text-xs break-all border border-white/10 block">
                {verificationResult.certificate?.certificateId}
              </code>
            </div>
          </div>
        )}

        {/* Result - Invalid Certificate */}
        {!loading && verificationResult && !verificationResult.isValid && (
          <div className="glass-premium p-8 rounded-2xl border-2 border-red-500/50 animate-fade-in">
            <div className="flex items-center gap-6 mb-8">
              <FiXCircle className="text-7xl text-red-400 flex-shrink-0" />
              <div>
                <h2 className="text-4xl font-bold text-red-400">Certificate Invalid</h2>
                <p className="text-gray-400 text-lg mt-1">This certificate could not be verified</p>
              </div>
            </div>

            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-red-200 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <span><strong>Verification Failed:</strong> This certificate is either fake, revoked, or does not exist on the blockchain. Do not trust this credential.</span>
              </p>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!verificationResult && !loading && (
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="certificate-card">
              <h3 className="text-2xl font-bold mb-6 gradient-text">How to Verify</h3>
              <ol className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>Enter the certificate ID in the search box above</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Or scan the QR code from the certificate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span>The system checks the Ethereum blockchain</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500/30 text-purple-300 rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <span>View instant results with full details</span>
                </li>
              </ol>
            </div>

            <div className="certificate-card">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Security Features</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Immutable Blockchain Records</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Real-time Verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>QR Code Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span>Ethereum Backed</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
