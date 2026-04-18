// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVault
 * @dev A secure smart contract for issuing, verifying, and revoking student certificates on blockchain
 * @author Yash Bodhe
 */

contract CertificateVault {
    // ===== STRUCTURES =====
    
    /**
     * @dev Certificate structure containing all certificate details
     */
    struct Certificate {
        bytes32 certificateId;      // Unique certificate hash
        address studentAddress;     // Ethereum address of student
        string studentName;         // Name of student
        string courseName;          // Name of course
        uint256 issueDate;          // Timestamp of issuance
        address issuerAddress;      // Admin/Issuer address
        string issuerName;          // Name of issuer
        bool isValid;               // Certificate validity status
        string certificateHash;     // IPFS hash or metadata hash
    }

    // ===== STATE VARIABLES =====
    
    address public admin;                                           // Admin addressadmin
    mapping(bytes32 => Certificate) public certificates;           // Certificate ID => Certificate data
    mapping(address => bytes32[]) public studentCertificates;      // Student address => Certificate IDs
    mapping(bytes32 => bool) public revokedCertificates;           // Revoked certificate tracking
    uint256 public certificateCount;                               // Total certificates issued

    // ===== EVENTS =====
    
    /**
     * @dev Emitted when a new certificate is issued
     */
    event CertificateIssued(
        bytes32 indexed certificateId,
        address indexed studentAddress,
        string studentName,
        string courseName,
        uint256 issueDate,
        address indexed issuerAddress
    );

    /**
     * @dev Emitted when a certificate is revoked
     */
    event CertificateRevoked(
        bytes32 indexed certificateId,
        address indexed studentAddress,
        uint256 revokeDate
    );

    /**
     * @dev Emitted when admin is changed
     */
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);

    // ===== MODIFIERS =====
    
    /**
     * @dev Ensures only admin can call the function
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    /**
     * @dev Validates certificate ID exists
     */
    modifier certificateExists(bytes32 _certificateId) {
        require(certificates[_certificateId].issueDate != 0, "Certificate does not exist");
        _;
    }

    // ===== CONSTRUCTOR =====
    
    /**
     * @dev Initialize contract with admin address
     */
    constructor() {
        admin = msg.sender;
    }

    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @dev Transfer admin rights to new address
     * @param _newAdmin New admin address
     */
    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminChanged(oldAdmin, _newAdmin);
    }

    /**
     * @dev Issue a new certificate to a student
     * @param _studentAddress Ethereum address of student
     * @param _studentName Full name of student
     * @param _courseName Name of course completed
     * @param _issuerName Name of issuer/institution
     * @param _certificateHash IPFS hash or metadata hash
     */
    function issueCertificate(
        address _studentAddress,
        string memory _studentName,
        string memory _courseName,
        string memory _issuerName,
        string memory _certificateHash
    ) external onlyAdmin returns (bytes32) {
        // Validating inputs
        require(_studentAddress != address(0), "Invalid student address");
        require(bytes(_studentName).length > 0, "Student name required");
        require(bytes(_courseName).length > 0, "Course name required");
        require(bytes(_issuerName).length > 0, "Issuer name required");
        require(bytes(_certificateHash).length > 0, "Certificate hash required");

        // Generate unique certificate ID
        bytes32 certificateId = keccak256(
            abi.encodePacked(
                _studentAddress,
                _studentName,
                _courseName,
                block.timestamp,
                certificateCount
            )
        );

        // Ensure certificate doesn't already exist
        require(certificates[certificateId].issueDate == 0, "Certificate already exists");

        // Create certificate
        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            studentAddress: _studentAddress,
            studentName: _studentName,
            courseName: _courseName,
            issueDate: block.timestamp,
            issuerAddress: msg.sender,
            issuerName: _issuerName,
            isValid: true,
            certificateHash: _certificateHash
        });

        // Add to student's certificates
        studentCertificates[_studentAddress].push(certificateId);
        certificateCount++;

        // Emit event
        emit CertificateIssued(
            certificateId,
            _studentAddress,
            _studentName,
            _courseName,
            block.timestamp,
            msg.sender
        );

        return certificateId;
    }

    /**
     * @dev Revoke an existing certificate
     * @param _certificateId ID of certificate to revoke
     */
    function revokeCertificate(bytes32 _certificateId)
        external
        onlyAdmin
        certificateExists(_certificateId)
    {
        Certificate storage cert = certificates[_certificateId];
        
        require(cert.isValid, "Certificate is already revoked or invalid");

        // Mark as revoked
        cert.isValid = false;
        revokedCertificates[_certificateId] = true;

        emit CertificateRevoked(_certificateId, cert.studentAddress, block.timestamp);
    }

    // ===== READ FUNCTIONS =====
    
    /**
     * @dev Verify a certificate's authenticity
     * @param _certificateId ID of certificate to verify
     * @return Certificate details and validity status
     */
    function verifyCertificate(bytes32 _certificateId)
        external
        view
        certificateExists(_certificateId)
        returns (Certificate memory)
    {
        return certificates[_certificateId];
    }

    /**
     * @dev Get all certificates for a specific student
     * @param _studentAddress Address of student
     * @return Array of certificate IDs belonging to student
     */
    function getCertificatesByStudent(address _studentAddress)
        external
        view
        returns (bytes32[] memory)
    {
        return studentCertificates[_studentAddress];
    }

    /**
     * @dev Get certificate count for a student
     * @param _studentAddress Address of student
     * @return Number of certificates
     */
    function getCertificateCountByStudent(address _studentAddress)
        external
        view
        returns (uint256)
    {
        return studentCertificates[_studentAddress].length;
    }

    /**
     * @dev Check if a certificate is valid and not revoked
     * @param _certificateId ID of certificate
     * @return Boolean indicating validity
     */
    function isCertificateValid(bytes32 _certificateId)
        external
        view
        returns (bool)
    {
        if (certificates[_certificateId].issueDate == 0) {
            return false; // Certificate doesn't exist
        }
        return certificates[_certificateId].isValid && !revokedCertificates[_certificateId];
    }

    /**
     * @dev Get certificate details by ID
     * @param _certificateId ID of certificate
     * @return Tuple of certificate details
     */
    function getCertificateDetails(bytes32 _certificateId)
        external
        view
        certificateExists(_certificateId)
        returns (
            string memory,
            string memory,
            address,
            uint256,
            bool
        )
    {
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.studentName,
            cert.courseName,
            cert.studentAddress,
            cert.issueDate,
            cert.isValid
        );
    }

    /**
     * @dev Get total number of certificates issued
     * @return Total certificate count
     */
    function getTotalCertificates() external view returns (uint256) {
        return certificateCount;
    }
}
