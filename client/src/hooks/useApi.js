import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Certificate endpoints
  const getStudentCertificates = async (studentAddress) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/certificates/student/${studentAddress}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch certificates');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCertificateDetails = async (certificateId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/certificates/${certificateId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch certificate details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const storeCertificateMetadata = async (metadata) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/certificates/metadata', metadata);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to store metadata');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verification endpoints
  const verifyCertificateById = async (certificateId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/verify/certificate', { certificateId });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyCertificateViaQR = async (qrCodeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/verify/qr', { qrCodeData });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'QR verification failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getVerificationDetails = async (certificateId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/verify/${certificateId}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch verification details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin endpoints
  const issueCertificate = async (certificateData, adminAddress) => {
    setLoading(true);
    setError(null);
    try {
      const config = {};
      if (adminAddress) {
        config.headers = { 'x-admin-address': adminAddress };
      }
      const response = await apiClient.post('/admin/issue-certificate', certificateData, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue certificate');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async (certificateId, adminAddress) => {
    setLoading(true);
    setError(null);
    try {
      const config = {};
      if (adminAddress) {
        config.headers = { 'x-admin-address': adminAddress };
      }
      const response = await apiClient.post('/admin/revoke-certificate', { certificateId }, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to revoke certificate');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAdminDashboard = async (adminAddress) => {
    setLoading(true);
    setError(null);
    try {
      const config = {};
      if (adminAddress) {
        config.headers = { 'x-admin-address': adminAddress };
      }
      const response = await apiClient.get('/admin/dashboard', config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (certificateId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/admin/generate-qr', { certificateId });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      console.log('🔗 Full Certificate ID:', certificateId);
      console.log('📊 ID length:', certificateId.length);
      
      const encodedId = encodeURIComponent(certificateId);
      const url = `/certificates/${encodedId}/download`;
      
      console.log('🌐 Request URL:', url);
      
      const response = await apiClient.get(url, {
        responseType: 'blob'
      });
      
      console.log('📦 Response received:', response.status, response.headers['content-type']);
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `Certificate_${certificateId.substring(0, 8)}_${new Date().getFullYear()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      console.log('✅ PDF downloaded successfully');
      return true;
    } catch (err) {
      console.error('❌ Download error:', err.response?.status, err.response?.statusText, err.message);
      setError(err.response?.data?.error || 'Failed to download certificate');
      return null;
    }
  };

  return {
    loading,
    error,
    getStudentCertificates,
    getCertificateDetails,
    storeCertificateMetadata,
    verifyCertificateById,
    verifyCertificateViaQR,
    getVerificationDetails,
    issueCertificate,
    revokeCertificate,
    getAdminDashboard,
    generateQRCode,
    downloadCertificate,
  };
};
