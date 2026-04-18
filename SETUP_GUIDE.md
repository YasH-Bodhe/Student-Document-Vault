# 🚀 Quick Setup Guide

## Prerequisites
- Node.js v18+ and npm v9+
- MetaMask browser extension
- MongoDB (local or cloud)
- Git

## Step-by-Step Setup

### 1️⃣ Clone & Install
```bash
git clone https://github.com/yashbodhe/student-document-vault.git
cd student-document-vault
npm run setup  # Installs all dependencies
```

### 2️⃣ Configure Blockchain
```bash
cd blockchain
cp .env.example .env
```

Edit `.env`:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=optional_for_verification
```

**Get Keys:**
- Infura: https://www.infura.io/
- Sepolia ETH: https://sepoliafaucet.com/
- Etherscan: https://etherscan.io/apis

### 3️⃣ Deploy Smart Contract
```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

**Save the contract address!** Example: `0x1234567890...`

### 4️⃣ Configure Backend
```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student-vault
CONTRACT_ADDRESS=0x...  # From step 3
ADMIN_PRIVATE_KEY=your_key_here
```

**Setup MongoDB:**
```bash
# Option 1: Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Option 2: Local installation
mongod

# Option 3: MongoDB Atlas (Cloud)
# https://www.mongodb.com/cloud/atlas
```

### 5️⃣ Configure Frontend
```bash
cd client
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x...  # From step 3
VITE_NETWORK_ID=11155111
```

### 6️⃣ Run Everything

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 7️⃣ Test the Application

1. Open http://localhost:5173

2. **Test as Student:**
   - Click "Connect Wallet"
   - Approve MetaMask
   - Go to Dashboard

3. **Test as Admin:**
   - Use your admin wallet
   - Go to Admin Panel
   - Fill in form:
     ```
     Student Address: 0x123...
     Student Name: John Doe
     Course: Blockchain 101
     Issuer: Your Institute
     Certificate Hash: QmTest123
     ```
   - Click "Issue Certificate"
   - Approve in MetaMask

4. **Verify Certificate:**
   - Go to Verify page
   - Enter certificate ID from step 3
   - See verification result

## 📋 Common Issues & Solutions

### ❌ MetaMask Error
```
Solution: Refresh page, check network, clear cache
```

### ❌ Contract Deployment Fails
```
Ensure:
- You have Sepolia test ETH
- RPC URL is correct
- PRIVATE_KEY doesn't have 0x prefix
```

### ❌ MongoDB Connection Error
```
Solution:
- Check mongod is running
- Verify MONGODB_URI in .env
- Check firewall/antivirus
```

### ❌ Port Already in Use
```bash
# Kill process
lsof -ti:5000 | xargs kill -9
# Or use different port
PORT=5001 npm run dev
```

## 🔍 Verification Checklist

- [ ] Node.js v18+ installed
- [ ] All dependencies installed
- [ ] `.env` files configured
- [ ] Smart contract deployed
- [ ] MongoDB running
- [ ] Backend server running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] MetaMask connected to Sepolia
- [ ] Test ETH in wallet

## 📚 Project Structure Quick Reference

```
├── blockchain/     # Smart contracts
├── server/         # Backend API
├── client/         # React frontend
└── README.md       # Full documentation
```

## 🎯 Next Steps

1. Issue test certificate via Admin Dashboard
2. Verify it via Verification page
3. View in Student Dashboard
4. Test QR code verification
5. Explore contract on Etherscan

## 💡 Tips

- Keep `.env` files secure
- Never commit `.env` files
- Test on Sepolia before mainnet
- Save contract addresses
- Monitor gas usage

## 🆘 Need Help?

1. Check README.md for detailed docs
2. Review error messages carefully
3. Check online forums (Ethereum, web3)
4. Create GitHub issue with details

---

**Happy Building! 🚀**

For issues: https://github.com/yashbodhe/student-document-vault/issues
