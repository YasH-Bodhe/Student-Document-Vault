import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { FiCheck, FiShield, FiZap } from 'react-icons/fi';

const LandingPage = () => {
  const { connectWallet, isConnected, error, isLoading } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl bottom-20 right-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-slide-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              Student Document Vault
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Secure blockchain-based certificate verification powered by Ethereum
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isConnected ? (
                <>
                  <Link to="/student" className="btn-primary">
                    View Dashboard
                  </Link>
                  <Link to="/verify" className="btn-secondary">
                    Verify Certificate
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={connectWallet} 
                    disabled={isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                  <Link to="/verify" className="btn-secondary">
                    Verify Certificate
                  </Link>
                </>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-sm"><strong>Error:</strong> {error}</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="glass p-6 rounded-xl">
              <p className="text-4xl font-bold gradient-text mb-2">100%</p>
              <p className="text-gray-400">Blockchain Verified</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-4xl font-bold gradient-text mb-2">Immutable</p>
              <p className="text-gray-400">Tamper-Proof Records</p>
            </div>
            <div className="glass p-6 rounded-xl">
              <p className="text-4xl font-bold gradient-text mb-2">Instant</p>
              <p className="text-gray-400">Real-time Verification</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Why Choose Student Vault?
          </h2>

          <div className="bento-grid">
            {/* Feature 1 */}
            <div className="certificate-card">
              <div className="flex items-center gap-4 mb-4">
                <FiShield className="text-3xl text-purple-500" />
                <h3 className="text-xl font-bold">Secure & Immutable</h3>
              </div>
              <p className="text-gray-400">
                Certificates are stored on the Ethereum blockchain, making them impossible to forge or tamper with.
              </p>
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
