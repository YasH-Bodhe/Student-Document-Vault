import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Initialize connection if MetaMask is already connected
  useEffect(() => {
    if (isMetaMaskAvailable()) {
      checkConnection();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (isMetaMaskAvailable()) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0].address);
        setChainId(Number(network.chainId));
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskAvailable()) {
      setError('MetaMask is not installed');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      // If not on Hardhat network, try to switch
      const targetChainId = 31337;
      if (Number(network.chainId) !== targetChainId) {
        const switchSuccess = await switchNetwork(targetChainId);
        if (!switchSuccess) {
          setError('Failed to switch to Hardhat network. Please manually add it in MetaMask.');
          setIsLoading(false);
          return false;
        }
      }

      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(31337);
      setIsConnected(true);

      return true;
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
  };

  // Switch to Sepolia testnet (or other networks)
  const switchNetwork = async (targetChainId) => {
    if (!isMetaMaskAvailable()) {
      setError('MetaMask is not installed');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (err) {
      if (err.code === 4902) {
        // Network not added, try to add it
        return await addNetwork(targetChainId);
      }
      setError(err.message);
      return false;
    }
  };

  // Add network (Hardhat or Sepolia)
  const addNetwork = async (chainId) => {
    let networkConfig = null;

    if (chainId === 31337) {
      // Hardhat local network
      networkConfig = {
        chainId: '0x7a69',
        chainName: 'Hardhat Local',
        rpcUrls: ['http://localhost:8545'],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
      };
    } else if (chainId === 11155111) {
      // Sepolia testnet
      networkConfig = {
        chainId: '0xaa36a7',
        chainName: 'Sepolia testnet',
        rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_KEY'],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia.etherscan.io'],
      };
    }

    if (!networkConfig) {
      setError(`Unsupported chain ID: ${chainId}`);
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnect,
    switchNetwork,
    isMetaMaskAvailable,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
