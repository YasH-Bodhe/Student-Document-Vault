import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';

// Simple ABI for certificate functions (extract from compiled contract)
const CERTIFICATE_ABI = [
  'function verifyCertificate(bytes32 _certificateId) external view returns (tuple(bytes32 certificateId, address studentAddress, string studentName, string courseName, uint256 issueDate, address issuerAddress, string issuerName, bool isValid, string certificateHash))',
  'function isCertificateValid(bytes32 _certificateId) external view returns (bool)',
  'function getCertificatesByStudent(address _studentAddress) external view returns (bytes32[])',
  'function getCertificateCountByStudent(address _studentAddress) external view returns (uint256)',
  'function issueCertificate(address _studentAddress, string memory _studentName, string memory _courseName, string memory _issuerName, string memory _certificateHash) external returns (bytes32)',
  'function revokeCertificate(bytes32 _certificateId) external',
];

export const useContract = (contractAddress) => {
  const { provider, signer } = useWallet();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (provider && contractAddress) {
      try {
        const instance = new ethers.Contract(contractAddress, CERTIFICATE_ABI, provider);
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
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.issueCertificate(
        studentAddress,
        studentName,
        courseName,
        issuerName,
        certificateHash
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (err) {
      setError(err.message || 'Failed to issue certificate');
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
