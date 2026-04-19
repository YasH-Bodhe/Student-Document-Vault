import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { FiCheck, FiShield, FiZap } from 'react-icons/fi';

const LandingPage = () => {
  const { connectWallet, isConnected, error, isLoading } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-600/40 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-72 h-72 bg-purple-900/30 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-slide-in">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text leading-tight">
              Student Document Vault
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
              Immutable blockchain-based certificate verification powered by Ethereum. Issue, verify, and showcase credentials with complete transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isConnected ? (
                <>
                  <Link to="/student" className="btn-primary px-8 py-4 text-lg">
                    📊 View Dashboard
                  </Link>
                  <Link to="/verify" className="btn-secondary px-8 py-4 text-lg">
                    ✓ Verify Certificate
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={connectWallet} 
                    disabled={isLoading}
                    className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '⏳ Connecting...' : '🦊 Connect MetaMask'}
                  </button>
                  <Link to="/verify" className="btn-secondary px-8 py-4 text-lg">
                    ✓ Verify Certificate
                  </Link>
                </>
              )}
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg max-w-md mx-auto animate-slide-in">
                <p className="text-sm"><strong>⚠️ Error:</strong> {error}</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="certificate-card">
              <p className="text-5xl font-bold gradient-text mb-3">100%</p>
              <p className="text-gray-300 font-semibold">Blockchain Verified</p>
              <p className="text-sm text-gray-400 mt-2">On Ethereum Network</p>
            </div>
            <div className="certificate-card">
              <p className="text-5xl font-bold gradient-text mb-3">∞</p>
              <p className="text-gray-300 font-semibold">Immutable Records</p>
              <p className="text-sm text-gray-400 mt-2">Tamper-Proof Storage</p>
            </div>
            <div className="certificate-card">
              <p className="text-5xl font-bold gradient-text mb-3">⚡</p>
              <p className="text-gray-300 font-semibold">Instant Verification</p>
              <p className="text-sm text-gray-400 mt-2">Real-time Authentication</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-5xl font-bold text-center mb-20 gradient-text">
            Why Choose Student Vault?
          </h2>

          <div className="bento-grid">
            {/* Feature 1 */}
            <div className="certificate-card">
              <div className="flex items-start gap-4 mb-6">
                <FiShield className="text-4xl text-purple-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Secure & Immutable</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Certificates are stored on the Ethereum blockchain, making them impossible to forge or tamper with. Your credentials are permanently secured.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="certificate-card">
              <div className="flex items-center gap-4 mb-4">
                <FiZap className="text-3xl text-yellow-500" />
                <h3 className="text-xl font-bold">Instant Verification</h3>
              </div>
              <p className="text-gray-400">
                Verify certificates instantly using QR codes or certificate IDs. No waiting, no intermediaries.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="certificate-card">
              <div className="flex items-center gap-4 mb-4">
                <FiCheck className="text-3xl text-green-500" />
                <h3 className="text-xl font-bold">Student Friendly</h3>
              </div>
              <p className="text-gray-400">
                Simple dashboard to view all your certificates and share them with employers or institutions.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Issue', desc: 'Admin issues certificate' },
              { step: '2', title: 'Store', desc: 'Stored on blockchain' },
              { step: '3', title: 'QR Code', desc: 'Unique QR generated' },
              { step: '4', title: 'Verify', desc: 'Instantly verified' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="glass p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold gradient-text mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="glass p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Certificates?</h2>
            <p className="text-gray-400 mb-8">
              Connect your MetaMask wallet to start managing your blockchain-verified certificates today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <>
                  <Link to="/student" className="btn-primary">Go to Dashboard</Link>
                  <Link to="/admin" className="btn-secondary">Admin Panel</Link>
                </>
              ) : (
                <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 text-center text-gray-500">
          <p>© 2024 Student Document Vault. Built with Ethereum & React.</p>
          <p className="text-sm mt-2">By Yash Bodhe</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
