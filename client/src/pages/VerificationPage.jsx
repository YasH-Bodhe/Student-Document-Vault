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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Verify Certificate</h1>
          <p className="text-gray-400">Check the authenticity of any certificate</p>
        </div>

        {/* Search Form */}
        <div className="glass p-8 rounded-2xl mb-8">
          <form onSubmit={verifyCert} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Certificate ID or Hash</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate ID to verify..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSearch />}
                  Verify
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass p-12 rounded-2xl text-center">
            <FiLoader className="text-5xl animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-lg">Verifying certificate...</p>
          </div>
        )}

        {/* Result - Valid Certificate */}
        {!loading && verificationResult && verificationResult.isValid && (
          <div className="glass p-8 rounded-2xl border-2 border-green-500/50 animate-fade-in">
            <div className="flex items-center mb-6">
              <FiCheckCircle className="text-6xl text-green-400 mr-4" />
              <div>
                <h2 className="text-3xl font-bold gradient-text">Certificate Valid</h2>
                <p className="text-gray-400">This is an authentic, verified certificate</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-400">Student Name</label>
                  <p className="text-lg font-semibold">{verificationResult.certificate?.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400">Course Name</label>
                  <p className="text-lg font-semibold">{verificationResult.certificate?.courseName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-400">Issue Date</label>
                  <p className="text-lg font-semibold">{formatDate(verificationResult.certificate?.issueDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-400">Issuer</label>
                  <p className="text-lg font-semibold">{verificationResult.certificate?.issuerName}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">
                <strong>Certificate ID:</strong><br />
                <code className="bg-black/20 px-2 py-1 rounded font-mono text-xs break-all">
                  {verificationResult.certificate?.certificateId}
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Result - Invalid Certificate */}
        {!loading && verificationResult && !verificationResult.isValid && (
          <div className="glass p-8 rounded-2xl border-2 border-red-500/50 animate-fade-in">
            <div className="flex items-center mb-6">
              <FiXCircle className="text-6xl text-red-400 mr-4" />
              <div>
                <h2 className="text-3xl font-bold text-red-400">Certificate Invalid</h2>
                <p className="text-gray-400">This certificate is fake, revoked, or does not exist</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
              <p className="text-red-200">
                ⚠️ <strong>Warning:</strong> This certificate could not be verified on the blockchain. Do not trust this certificate.
              </p>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!verificationResult && !loading && (
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="glass p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 gradient-text">How to Verify</h3>
              <ol className="space-y-2 text-gray-300 text-sm">
                <li>1. Enter the certificate ID in the search box above</li>
                <li>2. Or use a QR code scanner to scan the certificate</li>
                <li>3. The system will check the blockchain</li>
                <li>4. Results show if the certificate is authentic</li>
              </ol>
            </div>

            <div className="glass p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 gradient-text">Security Features</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ Blockchain verified</li>
                <li>✓ Immutable records</li>
                <li>✓ Instant verification</li>
                <li>✓ QR code support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
