import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { account, connectWallet, disconnect, isConnected } = useWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className={`sticky top-0 z-50 ${isDarkMode ? 'glass-dark' : 'glass'} border-b ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl">🔐</div>
            <div>
              <h1 className="font-bold text-xl gradient-text">Student Vault</h1>
              <p className="text-xs opacity-70">Blockchain Certificates</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/student" className="hover:text-primary transition">Dashboard</Link>
            <Link to="/verify" className="hover:text-primary transition">Verify</Link>
            <Link to="/admin" className="hover:text-primary transition">Admin</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-600'}`}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Wallet Connect Button */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold transition ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg'} text-white`}
                >
                  {formatAddress(account)}
                </button>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 rounded-lg font-semibold transition bg-red-500/20 text-red-500 hover:bg-red-500/30"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-2 rounded-lg font-semibold btn-primary transition"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
            <Link to="/" className="block py-2 hover:text-primary">Home</Link>
            <Link to="/student" className="block py-2 hover:text-primary">Dashboard</Link>
            <Link to="/verify" className="block py-2 hover:text-primary">Verify</Link>
            <Link to="/admin" className="block py-2 hover:text-primary">Admin</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
