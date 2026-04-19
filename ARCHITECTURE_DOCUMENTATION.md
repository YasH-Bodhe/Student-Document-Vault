# Student Document Vault - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [System Components](#system-components)
5. [Workflow & Data Flow](#workflow--data-flow)
6. [Setup & Installation](#setup--installation)
7. [API Documentation](#api-documentation)
8. [Smart Contract Functions](#smart-contract-functions)
9. [File Structure](#file-structure)
10. [How to Use](#how-to-use)

---

## Project Overview

**Student Document Vault** is a blockchain-based certificate verification system that allows educational institutions to issue tamper-proof, verifiable certificates to students. The system combines:

- **Ethereum Blockchain** for immutable certificate storage
- **Smart Contracts** for certificate logic and verification
- **Express.js Backend** for API and PDF generation
- **React Frontend** with modern UI for certificate management
- **JSON-based Persistence** for database storage

### Key Features
✅ Issue certificates on Ethereum blockchain  
✅ Verify certificates with QR codes  
✅ Download professional PDF certificates  
✅ Student dashboard to view received certificates  
✅ Admin dashboard for certificate management  
✅ Real-time blockchain verification  
✅ Beautiful, modern UI with dark theme  
✅ Responsive design for all devices  

---

## Technology Stack

### **Blockchain Layer**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Hardhat** | ^2.18.0 | Local Ethereum development environment |
| **Solidity** | ^0.8.19 | Smart contract language |
| **OpenZeppelin** | ^4.9.3 | Secure contract utilities |
| **ethers.js** | ^6.7.0 | Blockchain interaction library |

### **Backend Layer**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express.js** | ^4.18.2 | REST API framework |
| **Node.js** | 16+ | JavaScript runtime |
| **PDFKit** | ^0.18.0 | PDF document generation |
| **QRCode** | ^1.5.4 | QR code generation |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |
| **Morgan** | ^1.10.0 | HTTP request logging |
| **JWT** | ^9.0.0 | Authentication tokens |
| **bcryptjs** | ^2.4.3 | Password hashing |

### **Frontend Layer**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^18.2.0 | UI framework |
| **Vite** | ^5.0.0 | Build tool & dev server |
| **Tailwind CSS** | ^3.3.4 | Utility-first CSS framework |
| **React Router** | ^6.17.0 | Client-side routing |
| **ethers.js** | ^6.7.0 | Wallet connection |
| **axios** | ^1.5.0 | HTTP client |
| **QRCode React** | ^1.0.1 | QR code display |
| **Zustand** | ^4.4.1 | State management |

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
│              (React + Vite + Tailwind CSS)                  │
├─────────────────────────────────────────────────────────────┤
│  Landing Page │ Student Dashboard │ Admin Dashboard │ Verify │
│  (Port 5173)                                                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS REST API
                         │ (Axios)
┌────────────────────────▼────────────────────────────────────┐
│                      BACKEND LAYER                          │
│              (Express.js + Node.js)                         │
├─────────────────────────────────────────────────────────────┤
│  Certificate API                                            │
│  - Issue Certificates    ├─ PDF Generation (PDFKit)         │
│  - Download PDFs         ├─ QR Code Generation              │
│  - Verify Certificates   ├─ Database Operations             │
│  - Admin Operations      └─ File Persistence (database.json)│
│  (Port 5000)                                                │
└────────────────────────┬────────────────────────────────────┘
                         │ ethers.js
                         │ Web3 Connection
┌────────────────────────▼────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                         │
│              (Ethereum + Solidity Smart Contract)           │
├─────────────────────────────────────────────────────────────┤
│  CertificateVault Smart Contract                           │
│  - issueCertificate()                                       │
│  - verifyCertificate()                                      │
│  - revokeCertificate()                                      │
│  - getCertificateDetails()                                  │
│  (Hardhat Local Network: 127.0.0.1:8545)                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Database
                         ▼
                  database.json
            (Persistent JSON Storage)
```

### Data Flow Diagram

```
CERTIFICATE ISSUANCE FLOW:
────────────────────────────
Admin Input → Backend Validation → Smart Contract Call
    ↓              ↓                    ↓
  Form        Check Data         Blockchain
  Data        Consistency        Transaction
    ↓              ↓                    ↓
Send to    Emit Event → Database Store → PDF Generated
Admin      + DB Save    database.json   + QR Code
Dashboard

CERTIFICATE VERIFICATION FLOW:
──────────────────────────────
QR Code Scan → Backend API → Smart Contract Query → Verification Result
    ↓            ↓              ↓                      ↓
  URL        Parse ID      verifyCertificate()   Display Status
Extracted   Call Backend   (Check Blockchain)   + Certificate Details

CERTIFICATE DOWNLOAD FLOW:
──────────────────────────
Download Request → Backend Lookup → PDF Generation → Send to Client
      ↓              ↓                   ↓               ↓
Get Cert ID    Find in DB         PDFKit + QR       Browser
               + Blockchain       Creates PDF       Downloads
```

---

## System Components

### 1. **Frontend Components**

#### Landing Page (`client/src/pages/LandingPage.jsx`)
- Welcome screen with system overview
- Quick links to student/admin dashboards
- Feature showcase
- Responsive design with gradient backgrounds

#### Student Dashboard (`client/src/pages/StudentDashboard.jsx`)
- Displays all certificates received by connected wallet
- Shows certificate cards with:
  - Student name
  - Course name
  - Issue date
  - QR code (scannable for verification)
  - Download button
- Real-time blockchain data fetch
- Dark/light theme support

#### Admin Dashboard (`client/src/pages/AdminDashboard.jsx`)
- Issue new certificates
- Form with fields:
  - Student Name
  - Student Ethereum Address
  - Course Name
  - Issuer Name
- View all issued certificates
- Pagination for certificate list
- Recently issued certificates display
- Download certificates

#### Verification Page (`client/src/pages/VerificationPage.jsx`)
- QR code scanner or URL input
- Verify certificate validity
- Show certificate details:
  - Student info
  - Course info
  - Blockchain verification status
  - Issue date

#### Certificate Detail Page (`client/src/pages/CertificateDetailPage.jsx`)
- Full certificate details view
- Download PDF option
- Share certificate
- Blockchain verification proof

### 2. **Backend Components**

#### Express Server (`server/src/app.js`)
- CORS configuration for localhost:5173
- JSON body parsing (50MB limit)
- Morgan logging middleware
- Blockchain initialization
- Route mounting

#### Routes

**Certificates Routes** (`server/src/routes/certificates.js`)
```
POST   /api/certificates/issue          - Issue new certificate
GET    /api/certificates/:id/download   - Download certificate PDF
GET    /api/certificates/student/:addr  - Get student's certificates
GET    /api/certificates/:id            - Get certificate details
```

**Verification Routes** (`server/src/routes/verification.js`)
```
GET    /api/verify/:certificateId       - Verify certificate on blockchain
GET    /api/verify/student/:address     - Get all certificates for student
```

**Admin Routes** (`server/src/routes/admin.js`)
```
POST   /api/admin/issue                 - Admin issue certificate
GET    /api/admin/certificates          - List all certificates
GET    /api/admin/stats                 - System statistics
```

#### Controllers

**Certificate Controller** (`server/src/controllers/certificateController.js`)
- Handle certificate operations
- Call smart contract functions
- Process blockchain responses

**Admin Controller** (`server/src/controllers/adminController.js`)
- Admin-only operations
- Batch certificate operations
- Statistics and reporting

**Verification Controller** (`server/src/controllers/verificationController.js`)
- Query smart contract for verification
- Return verification status
- Cross-reference with database

#### Database Layer (`server/src/inMemoryDB.js`)
- In-memory database with JSON persistence
- Methods:
  ```javascript
  loadFromFile()              // Load from database.json on startup
  saveToFile()                // Persist to database.json
  saveCertificate(data)       // Add new certificate
  getCertificate(id)          // Retrieve certificate
  updateCertificate(id, data) // Update certificate
  revokeCertificate(id)       // Revoke certificate
  getAllCertificates()        // List all certificates
  ```

#### PDF Generation (`server/src/utils/generatePremiumCertificatePDF.js`)
- Professional A4 landscape certificate
- **Design Features:**
  - Gold & Navy Blue color scheme
  - Cream background
  - Decorative corner ornaments
  - Student name prominently displayed
  - Course information highlighted
  - QR code with frame (scannable for verification)
  - Ethereum verified badge
  - Certificate ID
  - Issuer signature area
- **Colors:**
  - Navy Dark: `#0f3460`
  - Navy Mid: `#16213e`
  - Gold: `#d4af37`
  - Cream: `#f7f6f1`

### 3. **Blockchain Components**

#### CertificateVault Smart Contract (`blockchain/contracts/CertificateVault.sol`)

**Data Structures:**
```solidity
struct Certificate {
    bytes32 certificateId;      // Unique hash
    address studentAddress;     // Student's wallet
    string studentName;         // Student name
    string courseName;          // Course name
    uint256 issueDate;          // Unix timestamp
    address issuerAddress;      // Admin address
    string issuerName;          // Admin name
    bool isValid;               // Active status
    string certificateHash;     // Metadata hash
}
```

**State Variables:**
```solidity
address public admin                           // Admin address
mapping(bytes32 => Certificate) certificates   // Certificate storage
mapping(address => bytes32[]) studentCerts    // Student → Certificates
mapping(bytes32 => bool) revokedCertificates  // Revocation tracking
uint256 public certificateCount                // Total issued
```

**Key Functions:**

```solidity
// Issue a new certificate
function issueCertificate(
    address _studentAddress,
    string memory _studentName,
    string memory _courseName,
    string memory _issuerName
) public onlyAdmin returns (bytes32)
// Emits: CertificateIssued event

// Verify certificate authenticity
function verifyCertificate(bytes32 _certificateId) 
public view returns (bool)
// Returns: true if valid and not revoked

// Get full certificate details
function getCertificateDetails(bytes32 _certificateId) 
public view returns (Certificate memory)
// Returns: Full certificate structure

// Get all certificates for a student
function getStudentCertificates(address _studentAddress) 
public view returns (bytes32[] memory)
// Returns: Array of certificate IDs

// Revoke a certificate (permanent)
function revokeCertificate(bytes32 _certificateId) 
public onlyAdmin
// Emits: CertificateRevoked event
```

**Events:**
```solidity
event CertificateIssued(
    bytes32 certificateId,
    address studentAddress,
    string studentName,
    string courseName,
    uint256 issueDate,
    address issuerAddress
)

event CertificateRevoked(
    bytes32 certificateId,
    address studentAddress,
    uint256 revokeDate
)
```

---

## Workflow & Data Flow

### Complete Certificate Lifecycle

#### 1. **ISSUANCE WORKFLOW**

```
Step 1: Admin Login
└─ Connect MetaMask wallet
└─ Verify admin privileges

Step 2: Fill Certificate Form
├─ Student Name
├─ Student Ethereum Address
├─ Course Name
└─ Issuer Name

Step 3: Submit to Backend
└─ POST /api/certificates/issue
└─ Backend validates all fields

Step 4: Blockchain Transaction
├─ Call CertificateVault.issueCertificate()
├─ Generate unique certificate ID (bytes32)
├─ Store on Ethereum blockchain
└─ Emit CertificateIssued event

Step 5: Backend Storage
├─ Save certificate to database.json
├─ Store metadata (name, date, etc.)
└─ Link student wallet to certificate

Step 6: Confirmation
├─ Transaction receipt received
├─ Certificate ID returned
├─ QR code generated
└─ Display success message
```

#### 2. **VERIFICATION WORKFLOW**

```
Step 1: Scan QR Code / Enter Certificate ID
└─ URL: verify.vault.io/cert/{certificateId}
└─ Or: Manual certificate ID entry

Step 2: Send Verification Request
└─ GET /api/verify/{certificateId}

Step 3: Blockchain Query
├─ verifyCertificate() call
├─ Check if certificate exists
├─ Check if not revoked
└─ Retrieve certificate details

Step 4: Database Cross-Check
├─ Verify metadata matches
├─ Check issue date
└─ Validate student info

Step 5: Display Results
├─ Green checkmark if VALID
├─ Red X if INVALID/REVOKED
├─ Show certificate details
├─ Show blockchain proof
└─ Option to download
```

#### 3. **DOWNLOAD WORKFLOW**

```
Step 1: User Clicks "Download"
└─ GET /api/certificates/{certificateId}/download

Step 2: Backend Preparation
├─ Look up certificate in database.json
├─ Fetch blockchain details
├─ Validate certificate exists
└─ Prepare certificate data

Step 3: PDF Generation
├─ PDFKit creates document
├─ A4 landscape layout
├─ Add decorative elements
├─ Generate QR code with verification URL
├─ Insert student information
├─ Add issuer signature area
└─ Render Ethereum verified badge

Step 4: Send to Client
├─ Set Content-Type: application/pdf
├─ Set Content-Disposition: attachment
├─ Send PDF buffer
└─ Browser downloads file

Step 5: File Saved
└─ Certificate_{StudentName}_{CourseId}.pdf
```

### Data Structure Examples

#### Certificate Data (database.json)
```json
{
  "certificates": {
    "0x13a8f7f5eaaa212cb7bd66884f0b0616dc47ade61e91c71e69105b0da52cd141": {
      "certificateId": "0x13a8f7f5eaaa212cb7bd66884f0b0616dc47ade61e91c71e69105b0da52cd141",
      "studentName": "Vedaant Ambre",
      "studentAddress": "0x8ba1f109551bd432803012645ac136ddd64dba72",
      "courseName": "Advanced Blockchain Development",
      "issuerName": "Tech Academy",
      "createdAt": "2024-04-19T10:30:00Z",
      "isValid": true,
      "blockchainVerified": true
    }
  },
  "users": {},
  "certificateId": 5,
  "lastUpdated": "2024-04-19T10:30:00Z"
}
```

#### API Response (Certificate Details)
```json
{
  "success": true,
  "certificate": {
    "certificateId": "0x13a8f7f5eaaa212cb7bd66884f0b0616dc47ade61e91c71e69105b0da52cd141",
    "studentName": "Vedaant Ambre",
    "courseName": "Advanced Blockchain Development",
    "issueDate": 1713607800,
    "issuerName": "Tech Academy",
    "isValid": true,
    "verified": true
  }
}
```

---

## Setup & Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MetaMask browser extension
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/YasH-Bodhe/Student-Document-Vault.git
cd student-document-vault
```

### Step 2: Install Dependencies
```bash
npm run setup
# This installs dependencies for:
# - Root project
# - blockchain/
# - server/
# - client/
```

### Step 3: Start Hardhat Local Network
```bash
cd blockchain
npx hardhat node
# Runs on: http://127.0.0.1:8545
# Creates 20 test accounts with 10000 ETH each
```

### Step 4: Deploy Smart Contract
```bash
# In a new terminal
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
# Outputs contract address (e.g., 0x0165878A...)
# ABI saved to scripts/CertificateVault_ABI.json
```

### Step 5: Start Backend Server
```bash
# In a new terminal
cd server
npm run dev
# Runs on: http://localhost:5000
```

### Step 6: Start Frontend Development Server
```bash
# In a new terminal
cd client
npm run dev
# Runs on: http://localhost:5173
```

### Or Use Quick Start Script
```bash
# From root directory
./start-all.bat   # Windows
./start-all.sh    # Mac/Linux

# This starts all three components in separate terminals
```

### Environment Variables

**Backend** (`server/.env`)
```env
PORT=5000
CONTRACT_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
HARDHAT_RPC_URL=http://127.0.0.1:8545
```

**Frontend** (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Certificate Endpoints

#### 1. Issue Certificate
```http
POST /certificates/issue
Content-Type: application/json

{
  "studentName": "Vedaant Ambre",
  "studentAddress": "0x8ba1f109551bd432803012645ac136ddd64dba72",
  "courseName": "Advanced Blockchain",
  "issuerName": "Tech Academy"
}

Response 200:
{
  "success": true,
  "certificateId": "0x13a8f7f5eaaa212cb7bd66884f0b0616dc47ade61e91c71e69105b0da52cd141",
  "txHash": "0x...",
  "message": "Certificate issued successfully"
}
```

#### 2. Download Certificate PDF
```http
GET /certificates/{certificateId}/download

Response 200:
Content-Type: application/pdf
Content-Disposition: attachment; filename="Certificate.pdf"

[Binary PDF Data]
```

#### 3. Get Certificate Details
```http
GET /certificates/{certificateId}

Response 200:
{
  "success": true,
  "certificate": {
    "certificateId": "0x13a8f7f5...",
    "studentName": "Vedaant Ambre",
    "courseName": "Advanced Blockchain",
    "issueDate": 1713607800,
    "issuerName": "Tech Academy",
    "studentAddress": "0x8ba1f109...",
    "isValid": true
  }
}
```

#### 4. Get Student Certificates
```http
GET /certificates/student/{walletAddress}

Response 200:
{
  "success": true,
  "certificates": [
    { "certificateId": "0x...", "courseName": "..." },
    { "certificateId": "0x...", "courseName": "..." }
  ]
}
```

### Verification Endpoints

#### 1. Verify Certificate
```http
GET /verify/{certificateId}

Response 200:
{
  "success": true,
  "valid": true,
  "certificate": {
    "certificateId": "0x...",
    "studentName": "Vedaant Ambre",
    "courseName": "Advanced Blockchain",
    "verified": true,
    "blockchainConfirmed": true
  }
}
```

#### 2. Get Student's All Certificates
```http
GET /verify/student/{walletAddress}

Response 200:
{
  "success": true,
  "certificates": [...]
}
```

### Admin Endpoints

#### 1. Issue Certificate (Admin)
```http
POST /admin/issue
Headers: Authorization: Bearer {token}

{
  "studentName": "...",
  "studentAddress": "...",
  "courseName": "...",
  "issuerName": "..."
}
```

#### 2. Get All Certificates
```http
GET /admin/certificates
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "certificates": [...]
}
```

#### 3. System Statistics
```http
GET /admin/stats

Response 200:
{
  "totalCertificates": 42,
  "uniqueStudents": 38,
  "issuedToday": 3
}
```

---

## Smart Contract Functions

### Function Reference

#### issueCertificate()
```solidity
function issueCertificate(
    address _studentAddress,
    string memory _studentName,
    string memory _courseName,
    string memory _issuerName
) public onlyAdmin returns (bytes32)
```
- **Access**: Admin only
- **Returns**: Certificate ID (bytes32)
- **Emits**: `CertificateIssued` event
- **Effect**: Creates certificate on blockchain

#### verifyCertificate()
```solidity
function verifyCertificate(bytes32 _certificateId) 
public view returns (bool)
```
- **Access**: Public
- **Returns**: `true` if valid and not revoked
- **Effect**: Queries blockchain, no state change

#### getCertificateDetails()
```solidity
function getCertificateDetails(bytes32 _certificateId) 
public view returns (Certificate memory)
```
- **Access**: Public
- **Returns**: Full certificate structure
- **Includes**: All certificate metadata

#### getStudentCertificates()
```solidity
function getStudentCertificates(address _studentAddress) 
public view returns (bytes32[] memory)
```
- **Access**: Public
- **Returns**: Array of certificate IDs for student
- **Usage**: Get all certificates for a wallet

#### revokeCertificate()
```solidity
function revokeCertificate(bytes32 _certificateId) 
public onlyAdmin
```
- **Access**: Admin only
- **Effect**: Marks certificate as revoked
- **Emits**: `CertificateRevoked` event
- **Note**: Permanent action, cannot be undone

---

## File Structure

```
student-document-vault/
├── blockchain/                          # Solidity Smart Contracts
│   ├── contracts/
│   │   └── CertificateVault.sol        # Main contract
│   ├── scripts/
│   │   ├── deploy.js                   # Deployment script
│   │   ├── deployment.json             # Deployment config
│   │   └── CertificateVault_ABI.json   # Contract ABI
│   ├── hardhat.config.js               # Hardhat configuration
│   └── package.json
│
├── server/                              # Express Backend
│   ├── src/
│   │   ├── app.js                      # Express app
│   │   ├── inMemoryDB.js               # Database layer
│   │   ├── controllers/
│   │   │   ├── certificateController.js
│   │   │   ├── verificationController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── certificates.js
│   │   │   ├── verification.js
│   │   │   └── admin.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js       # Auth checks
│   │   ├── models/
│   │   │   ├── Certificate.js
│   │   │   └── User.js
│   │   └── utils/
│   │       ├── generatePremiumCertificatePDF.js  # PDF generator
│   │       └── certificatePDF.js
│   ├── database.json                   # Persistent storage
│   └── package.json
│
├── client/                              # React Frontend
│   ├── src/
│   │   ├── App.jsx                     # Main app
│   │   ├── main.jsx
│   │   ├── index.css                   # Global styles
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── VerificationPage.jsx
│   │   │   └── CertificateDetailPage.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── WalletContext.jsx       # Wallet state
│   │   ├── hooks/
│   │   │   ├── useApi.js               # API calls
│   │   │   └── useContract.js          # Contract interaction
│   │   ├── utils/
│   │   │   └── certificateUtils.js
│   │   └── contracts/
│   │       ├── CertificateVault_ABI.json
│   │       └── deployment.json
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── package.json                         # Root workspace
├── start-all.bat                        # Quick start script
├── README.md
├── SETUP_GUIDE.md
└── DEPLOYMENT_GUIDE.md
```

---

## How to Use

### For Students

#### 1. View Your Certificates
1. Navigate to `http://localhost:5173`
2. Click "Student Dashboard"
3. Connect MetaMask wallet
4. View all certificates issued to your wallet address
5. Each certificate shows:
   - Course name
   - Issue date
   - QR code for verification
   - Download button

#### 2. Download Certificate
1. On certificate card, click "Download"
2. Browser downloads professional PDF
3. PDF includes:
   - Your name prominently displayed
   - Course information
   - Issue date
   - Issuer name
   - QR code for verification
   - Ethereum verified badge

#### 3. Share Certificate
1. Click QR code on certificate
2. Share the verification URL
3. Anyone can verify by:
   - Scanning QR code
   - Going to verification page
   - Entering certificate ID

### For Admins

#### 1. Issue Certificate
1. Navigate to "Admin Dashboard"
2. Connect with admin wallet (same as deployment)
3. Fill certificate form:
   - Student's full name
   - Student's Ethereum address
   - Course name
   - Your name (issuer)
4. Click "Issue Certificate"
5. Approve MetaMask transaction
6. Certificate recorded on blockchain

#### 2. Manage Certificates
1. Scroll to "All Certificates"
2. View all issued certificates
3. Each entry shows:
   - Student name
   - Course name
   - Issue date
   - Certificate ID
4. Click certificate to view/download details

#### 3. View Statistics
- Total certificates issued
- Number of students
- Recent issuances
- System status

### For Verifiers

#### 1. Via QR Code
1. Scan QR code from certificate
2. Opens verification page
3. Shows certificate validity
4. Displays all certificate details
5. Green checkmark = valid certificate

#### 2. Via Certificate ID
1. Go to Verification page
2. Enter certificate ID (full 66-character hash)
3. Click "Verify"
4. System queries blockchain
5. Shows results and details

#### 3. Manual Entry
1. Copy certificate ID from PDF
2. Paste in verification form
3. System fetches from blockchain
4. Displays certificate status and details

---

## Security Features

### Blockchain Level
✅ **Immutability**: Certificates recorded permanently on blockchain  
✅ **Transparency**: All transactions publicly verifiable  
✅ **Authentication**: Admin-only issuance (onlyAdmin modifier)  
✅ **Revocation**: Certificates can be marked invalid permanently  

### Backend Level
✅ **CORS Protection**: Whitelist allowed origins  
✅ **Request Validation**: All inputs sanitized  
✅ **Error Handling**: Graceful error messages  
✅ **Logging**: All operations logged via Morgan  

### Frontend Level
✅ **MetaMask Integration**: Secure wallet connection  
✅ **Environment Variables**: Sensitive data not exposed  
✅ **HTTPS Ready**: Production-ready configuration  

---

## Troubleshooting

### Issue: MetaMask won't connect
**Solution**: 
- Switch MetaMask network to "Localhost 8545"
- Hardhat node must be running on port 8545
- Refresh page and try again

### Issue: Certificate download fails with error
**Solution**:
- Check server is running (port 5000)
- Verify certificate exists in database.json
- Check browser console for error details

### Issue: QR code doesn't scan
**Solution**:
- Ensure verification URL is correct
- QR code must be clear (zoom in on PDF)
- Try manual entry of certificate ID

### Issue: Transaction fails in MetaMask
**Solution**:
- Ensure admin wallet has ETH (Hardhat provides 10000 ETH)
- Check gas prices
- Increase gas limit in MetaMask settings

### Issue: Port already in use
**Solution**:
```bash
# Kill process on port (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

---

## Performance Metrics

### Certificate Issuance
- Smart contract call: ~2-3 seconds
- PDF generation: ~1-2 seconds
- Total time: ~3-5 seconds

### Certificate Verification
- Blockchain query: <1 second
- Database lookup: <100ms
- Total time: <1 second

### PDF Download
- PDF generation: 1-2 seconds
- File transfer: <1 second
- Total time: 1-2 seconds

---

## Future Enhancements

📋 **Planned Features**:
- [ ] IPFS integration for off-chain storage
- [ ] Batch certificate issuance
- [ ] Multiple blockchain networks
- [ ] Digital signatures on certificates
- [ ] Certificate templates (customizable)
- [ ] Email notifications
- [ ] Database migration from JSON to MongoDB
- [ ] Advanced analytics dashboard
- [ ] Certificate marketplace
- [ ] Revocation system improvements

---

## Support & Contact

**Issues or Questions?**
- GitHub Issues: https://github.com/YasH-Bodhe/Student-Document-Vault/issues
- Email: yash@example.com

---

## License

MIT License - See LICENSE file for details

---

**Last Updated**: April 19, 2026  
**Version**: 1.0.0  
**Author**: Yash Bodhe

