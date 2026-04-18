# 🔐 Student Document Vault

A secure, blockchain-based student certificate verification system built with Ethereum, Solidity, and React. Issue, store, and verify academic certificates on the blockchain with complete transparency and immutability.

![License](https://img.shields.io/badge/license-MIT-blue)
![Solidity](https://img.shields.io/badge/solidity-^0.8.19-lightgrey)
![React](https://img.shields.io/badge/react-^18.2.0-blue)
![Node.js](https://img.shields.io/badge/node.js-^18.0.0-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Smart Contract Deployment](#-smart-contract-deployment)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Usage Guide](#-usage-guide)
- [Security Considerations](#-security-considerations)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Student Features
- **View Certificates**: Dashboard showing all issued certificates
- **Verify Authenticity**: Check if a certificate is valid or fake
- **QR Code Verification**: Scan QR codes to instantly verify certificates
- **Certificate Details**: View comprehensive certificate information
- **Share Certificates**: Easy sharing with employers and institutions

### 👨‍💼 Admin Features
- **Issue Certificates**: Create and issue new certificates to students
- **Revoke Certificates**: Invalidate certificates when needed
- **Admin Dashboard**: View statistics and manage all certificates
- **QR Code Generation**: Automatically generate verification QR codes
- **Batch Operations**: Issue multiple certificates efficiently

### 🔐 Security Features
- **Blockchain Verification**: All certificates stored immutably on Ethereum
- **Tamper-Proof**: Cannot be altered or forged
- **Smart Contract Audited**: Proper access controls and validations
- **MetaMask Integration**: Secure wallet authentication
- **IPFS Support**: Decentralized metadata storage (optional)

### 🎨 UI/UX Features
- **Glassmorphism Design**: Modern, elegant interface
- **Bento Grid Layout**: Responsive certificate cards
- **Light/Dark Mode**: User preference support
- **Mobile Responsive**: Perfect on all devices
- **Smooth Animations**: Professional user experience

---

## 🛠️ Tech Stack

### Blockchain
- **Solidity** (^0.8.19) - Smart contract language
- **Hardhat** - Development environment
- **Ethers.js** - Blockchain interaction
- **Ethereum Sepolia** - Testnet (configurable)

### Backend
- **Node.js** - Runtime
- **Express.js** - REST API framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Ethers.js** - Blockchain integration

### Frontend
- **React** (^18.2.0) - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **QR Code Libraries** - QR generation and scanning

### Authentication
- **MetaMask** - Wallet connection
- **Web3** - Blockchain interaction

---

## 📁 Project Structure

```
student-document-vault/
│
├── blockchain/                      # Smart contracts & deployment
│   ├── contracts/
│   │   └── CertificateVault.sol    # Main contract
│   ├── scripts/
│   │   └── deploy.js               # Deployment script
│   ├── hardhat.config.js           # Hardhat configuration
│   ├── package.json
│   └── .env.example
│
├── server/                          # Backend API
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── controllers/
│   │   │   ├── certificateController.js
│   │   │   ├── verificationController.js
│   │   │   └── adminController.js
│   │   ├── models/
│   │   │   ├── CertificateMetadata.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── certificates.js
│   │   │   ├── verification.js
│   │   │   └── admin.js
│   │   └── middleware/
│   ├── package.json
│   └── .env.example
│
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── VerificationPage.jsx
│   │   │   └── CertificateDetailPage.jsx
│   │   ├── context/
│   │   │   └── WalletContext.jsx
│   │   ├── hooks/
│   │   │   ├── useContract.js
│   │   │   └── useApi.js
│   │   ├── utils/
│   │   │   └── certificateUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── assets/                          # Project assets
│   ├── logos/
│   └── templates/
│
├── README.md                        # This file
└── .gitignore

```

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **MetaMask** browser extension ([Install](https://metamask.io/))
- **MongoDB** (local or MongoDB Atlas cloud)

### Verify Installations

```bash
node --version      # Should be v18 or higher
npm --version       # Should be v9 or higher
git --version       # Should be installed
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yashbodhe/student-document-vault.git
cd student-document-vault
```

### Step 2: Setup Blockchain (Hardhat)

```bash
cd blockchain

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your details
# SEPOLIA_RPC_URL = https://sepolia.infura.io/v3/YOUR_INFURA_KEY
# PRIVATE_KEY = your_wallet_private_key
```

**Get Infura Key:**
1. Visit https://www.infura.io/
2. Sign up and create a new project
3. Copy the Sepolia RPC URL

**Get Test ETH (Sepolia):**
1. Visit https://sepoliafaucet.com/
2. Enter your wallet address
3. Request test ETH

### Step 3: Deploy Smart Contract

```bash
# In blockchain/ directory

# Compile the contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Save the contract address from output
# You'll need this for the frontend and backend
```

**Example Output:**
```
✅ CertificateVault deployed to: 0x1234567890123456789012345678901234567890
```

### Step 4: Setup Backend (Express + MongoDB)

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your details
# MONGODB_URI = mongodb://localhost:27017/student-vault
# CONTRACT_ADDRESS = 0x... (from step 3)
# PORT = 5000
```

**Setup MongoDB (Local):**
```bash
# Option 1: Using Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Option 2: Install locally from https://www.mongodb.com/try/download/community
# Then run: mongod
```

**Or use MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Use in MONGODB_URI

### Step 5: Setup Frontend (React + Vite)

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your contract address
# VITE_API_URL = http://localhost:5000/api
# VITE_CONTRACT_ADDRESS = 0x... (from step 3)
# VITE_NETWORK_ID = 11155111 (Sepolia)
```

---

## 📋 Smart Contract Deployment

### Full Deployment Steps

```bash
cd blockchain

# 1. Compile
npx hardhat compile

# 2. Test (optional but recommended)
npx hardhat test

# 3. Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# 4. Verify on Etherscan (optional)
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Deployment Configuration

Edit `hardhat.config.js` to add more networks:

```javascript
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
  },
  polygon: {
    url: process.env.POLYGON_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
  },
}
```

---

## 🏃 Running the Application

### Terminal 1: Start Hardhat Local Node (Optional for testing)

```bash
cd blockchain
npx hardhat node
```

### Terminal 2: Start Backend Server

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 3: Start Frontend Development Server

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

---

## 📡 API Documentation

### Certificate Endpoints

#### Get Student Certificates
```http
GET /api/certificates/student/:studentAddress
```

**Example:**
```bash
curl http://localhost:5000/api/certificates/student/0x1234567890123456789012345678901234567890
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "certificateId": "0x...",
      "studentName": "John Doe",
      "courseName": "Blockchain Development",
      "issueDate": "2024-01-15",
      "isValid": true,
      "verificationCount": 5
    }
  ]
}
```

#### Certificate Details
```http
GET /api/certificates/:certificateId
```

### Verification Endpoints

#### Verify Certificate by ID
```http
POST /api/verify/certificate
Content-Type: application/json

{
  "certificateId": "0x..."
}
```

#### Verify via QR Code
```http
POST /api/verify/qr
Content-Type: application/json

{
  "qrCodeData": "http://localhost:5173/verify?certId=0x..."
}
```

### Admin Endpoints

#### Issue Certificate
```http
POST /api/admin/issue-certificate
Content-Type: application/json

{
  "studentAddress": "0x...",
  "studentName": "John Doe",
  "courseName": "Web Development 101",
  "issuerName": "Tech Institute",
  "certificateHash": "QmXxxx..."
}
```

#### Get Admin Dashboard
```http
GET /api/admin/dashboard
```

---

## 🎯 Usage Guide

### For Students

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve connection in MetaMask
   - Select Sepolia network if needed

2. **View Certificates**
   - Go to Dashboard
   - See all your certificates
   - Click on any certificate for details

3. **Verify a Certificate**
   - Go to Verify page
   - Enter Certificate ID or scan QR code
   - See verification status

### For Admins

1. **Connect as Admin**
   - Connect MetaMask wallet (admin wallet)
   - Navigate to Admin Dashboard

2. **Issue Certificate**
   - Fill in student details
   - Enter course information
   - Click "Issue Certificate"
   - Approve MetaMask transaction

3. **Monitor Dashboard**
   - View total certificates issued
   - Track valid vs revoked certificates
   - See recent certificate activity

### QR Code Workflow

1. Admin issues certificate
2. QR code automatically generated
3. Student shares QR code
4. Anyone can scan → Opens verification page
5. Blockchain confirms authenticity

---

## 🔐 Security Considerations

### Smart Contract Security
- ✅ Only admin can issue/revoke certificates
- ✅ Unique certificate IDs prevent duplicates
- ✅ Immutable blockchain storage
- ✅ Event logging for transparency
- ⚠️ No upgradeable proxy (for simplicity)

### Backend Security
- ✅ Input validation on all endpoints
- ✅ Ethereum address validation
- ✅ CORS protection
- ⚠️ Add JWT authentication in production
- ⚠️ Rate limiting recommended

### Frontend Security
- ✅ MetaMask wallet integration
- ✅ No private keys in frontend
- ✅ Environment variables for sensitive data
- ⚠️ Enable CSP headers
- ⚠️ Regular dependency updates

### Best Practices for Production
```bash
# 1. Use environment variables for all secrets
# 2. Enable HTTPS everywhere
# 3. Add authentication middleware
# 4. Implement rate limiting
# 5. Use indexed database queries
# 6. Regular security audits
# 7. Backup important data
# 8. Monitor contract interactions
```

---

## 🧪 Testing

### Test Smart Contract

```bash
cd blockchain

# Run tests
npx hardhat test

# Gas report
REPORT_GAS=true npx hardhat test
```

### Test Backend

```bash
cd server

# Install testing dependencies (if not installed)
npm install --save-dev jest supertest

# Run tests
npm test
```

### Test Frontend

```bash
cd client

# Manual testing through browser
npm run dev
```

---

## 📚 Additional Resources

### Documentation
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/v5/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Learning Resources
- [Ethereum Development](https://ethereum.org/en/developers/)
- [Smart Contract Security](https://blog.consensys.net/)
- [Web3 Tutorial](https://web3js.readthedocs.io/)

### Useful Tools
- [Etherscan Explorer](https://sepolia.etherscan.io/) - Block explorer
- [Hardhat Documentation](https://hardhat.org/) - Development environment
- [MetaMask Docs](https://metamask.io/faqs) - Wallet integration

---

## 🐛 Troubleshooting

### MetaMask Not Connecting
```
Solution: 
1. Ensure MetaMask is installed
2. Refresh the page
3. Check if you're on Sepolia network
4. Clear browser cache and cookies
```

### Smart Contract Deployment Fails
```
Solution:
1. Check if you have enough test ETH
2. Verify SEPOLIA_RPC_URL is correct
3. Ensure PRIVATE_KEY is valid (without 0x prefix)
4. Check network connectivity
```

### MongoDB Connection Issues
```
Solution:
1. Ensure MongoDB is running (mongod)
2. Check MONGODB_URI in .env
3. Verify user credentials if using Atlas
4. Check firewall settings
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style
- Use ES6+ syntax
- Add JSDoc comments
- Follow naming conventions
- Test your changes

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Yash Bodhe**
- GitHub: [@yashbodhe](https://github.com/yashbodhe)
- Email: your-email@example.com

---

## 🙏 Acknowledgments

- Ethereum Foundation
- OpenZeppelin for contract standards
- Hardhat team for development tools
- React community for amazing library

---

## 📞 Support

For issues, questions, or suggestions:

1. **GitHub Issues**: [Create an issue](https://github.com/yashbodhe/student-document-vault/issues)
2. **Documentation**: Check README and docs
3. **Community**: Join Ethereum development forums

---

## 🎓 Final Notes

This project demonstrates:
- ✅ Full-stack blockchain development
- ✅ Solidity smart contracts
- ✅ Backend API development
- ✅ React frontend with Web3 integration
- ✅ MetaMask wallet integration
- ✅ Production-ready code structure
- ✅ Security best practices

**Perfect for:**
- Portfolio showcasing
- Learning blockchain development
- Understanding certificate verification systems
- Implementing real-world blockchain use cases

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅

---

Made with ❤️ by Yash Bodhe
