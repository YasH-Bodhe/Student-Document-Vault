import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import CERTIFICATE_ABI from '../contracts/CertificateVault_ABI.js';

export const useContract = (contractAddress) => {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (provider && contractAddress) {
      try {
        if (!Array.isArray(CERTIFICATE_ABI) || CERTIFICATE_ABI.length === 0) {
          throw new Error('Invalid ABI format');
        }
        const instance = new ethers.Contract(contractAddress, CERTIFICATE_ABI, provider);
        console.log('✅ Contract instance created with ABI length:', CERTIFICATE_ABI.length);
        
        // Log what functions are in the contract interface
        const functions = Object.keys(instance.interface.functions || {});
        console.log('📋 Available functions in contract interface:', functions);
        
        const hasIssueCertificate = functions.some(f => f.includes('issueCertificate'));
        console.log('🔍 Has issueCertificate function:', hasIssueCertificate);
        
        setContract(instance);
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError(err.message);
      }
    }
  }, [provider, contractAddress]);

  const verifyCertificate = async (certificateId) => {
    if (!contract) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const cert = await contract.verifyCertificate(certificateId);
      const isValid = await contract.isCertificateValid(certificateId);
      return { ...cert, isValid };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStudentCertificates = async (studentAddress) => {
    if (!contract) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const certIds = await contract.getCertificatesByStudent(studentAddress);
      return certIds;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async (studentAddress, studentName, courseName, issuerName, certificateHash) => {
    if (!signer || !contract) {
      setError('Signer not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Attempting to issue certificate with params:', {
        studentAddress,
        studentName,
        courseName,
        issuerName,
        certificateHashPrefix: certificateHash?.substring(0, 10) + '...'
      });
      
      const contractWithSigner = contract.connect(signer);
      console.log('✅ Contract connected with signer');
      
      const tx = await contractWithSigner.issueCertificate(
        studentAddress,
        studentName,
        courseName,
        issuerName,
        certificateHash
      );
      console.log('✅ Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('📦 Certificate issue receipt:', receipt);
      
      // Parse the CertificateIssued event to extract the certificate ID
      let certificateId = null;
      if (receipt && receipt.logs && receipt.logs.length > 0) {
        console.log(`📋 Parsing ${receipt.logs.length} logs from receipt`);
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed && parsed.name === 'CertificateIssued') {
              certificateId = parsed.args.certificateId;
              console.log('✅ Certificate ID from event:', certificateId);
              break;
            }
          } catch (e) {
            // Ignore parsing errors for logs that aren't from our contract
          }
        }
      } else {
        console.warn('⚠️ No logs found in receipt');
      }
      
      return {
        receipt,
        certificateId,
        transactionHash: receipt.hash || tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (err) {
      console.error('❌ Certificate issuance failed:', err);
      const errorMsg = err.reason || err.message || 'Unknown error occurred';
      setError(errorMsg);
      console.error('Full error details:', {
        name: err.name,
        message: err.message,
        reason: err.reason,
        code: err.code,
        shortString: err.shortString
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async (certificateId) => {
    if (!signer || !contract) {
      setError('Signer not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.revokeCertificate(certificateId);
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err.message || 'Failed to revoke certificate');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    error,
    verifyCertificate,
    getStudentCertificates,
    issueCertificate,
    revokeCertificate,
  };
};
