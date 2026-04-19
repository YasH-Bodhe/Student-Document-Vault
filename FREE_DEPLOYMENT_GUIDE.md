# Deploy Student Document Vault - FREE! 🚀

## **Overview: Where to Deploy Each Part**

```
Your Project                Deployment Option           Cost
─────────────────────────────────────────────────────────────
Frontend (React)      →     Vercel or Netlify       FREE ✅
Backend (Express)     →     Railway or Render       FREE ✅
Blockchain Contract   →     Sepolia Testnet        FREE ✅
Database (JSON)       →     No setup needed        FREE ✅
Total Cost                                         $0 🎉
```

---

## **STEP 1: Deploy Frontend (React) - 10 Minutes ⏱️**

### **Option A: Vercel (RECOMMENDED - Easiest)**

#### 1.1: Push to GitHub
```bash
# If not already done
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 1.2: Go to Vercel
1. Visit: https://vercel.com
2. Click "Sign Up" → Sign in with GitHub
3. Click "New Project"
4. Select your `student-document-vault` repository
5. Click "Import"

#### 1.3: Configure
```
Framework Preset: Vite (auto-detected)
Build Command: npm run build
Output Directory: dist
```

#### 1.4: Add Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:
```
VITE_API_URL = https://your-backend.railway.app
(You'll get this after deploying backend)

VITE_CONTRACT_ADDRESS = 0x... 
(Your Sepolia contract address)
```

#### 1.5: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get your URL: `https://your-project.vercel.app` 🎉

---

### **Option B: Netlify**

1. Visit: https://netlify.com
2. Connect GitHub
3. Select repository
4. Build command: `npm run build`
5. Publish directory: `client/dist`
6. Add same environment variables
7. Deploy!

---

## **STEP 2: Deploy Backend (Express) - 10 Minutes ⏱️**

### **Option A: Railway (RECOMMENDED)**

#### 2.1: Go to Railway
1. Visit: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "GitHub Repo"
5. Connect your repository

#### 2.2: Configure
- **Root Directory**: `server`
- **Build Command**: Auto-detected
- **Start Command**: `npm start` or `node src/app.js`

#### 2.3: Add Environment Variables
Click "Variables" and add:
```
PORT = 5000
CONTRACT_ADDRESS = 0x...  (Sepolia address)
HARDHAT_RPC_URL = https://sepolia.infura.io/v3/YOUR_KEY
(Free key from Infura)
FRONTEND_URL = https://your-project.vercel.app
NODE_ENV = production
```

#### 2.4: Deploy
- Click "Deploy"
- Get your backend URL: `https://your-backend.railway.app` 🎉

---

### **Option B: Render**

1. Visit: https://render.com
2. Create new Web Service
3. Connect GitHub
4. Set root directory: `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as above)
8. Deploy!

---

## **STEP 3: Deploy Smart Contract to Testnet - 15 Minutes ⏱️**

### **Why Sepolia Testnet?**
- Free fake Ethereum for testing
- Works exactly like real Ethereum
- No real money needed
- Perfect for portfolio projects

### **3.1: Get Sepolia Testnet ETH (FREE)**

1. **Get Infura API Key:**
   - Go: https://infura.io
   - Sign up (free)
   - Create new project
   - Copy Project ID (this is your RPC URL)

2. **Get Free Testnet ETH:**
   - Go: https://www.alchemy.com/faucets/sepolia
   - OR: https://sepoliafaucet.com
   - Paste your wallet address
   - Get 0.5-1 free Sepolia ETH

### **3.2: Update Hardhat Config**

Edit `blockchain/hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### **3.3: Get Private Key**

1. Open MetaMask
2. Settings → Account Details
3. Export Private Key (copy it)
4. Create `.env` in `blockchain/` folder:
```
PRIVATE_KEY=0x...your_private_key...
```

### **3.4: Deploy to Sepolia**

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

Output will show:
```
✅ Contract deployed to: 0xABC123...
```

**Save this address!** 📌

### **3.5: Update Deployment Files**

Update these files with your new contract address:

**`blockchain/scripts/deployment.json`:**
```json
{
  "contractAddress": "0xYOUR_SEPOLIA_ADDRESS",
  "network": "sepolia",
  "explorer": "https://sepolia.etherscan.io/address/0xYOUR_ADDRESS"
}
```

**`server/` → Add env variable:**
```
CONTRACT_ADDRESS=0xYOUR_SEPOLIA_ADDRESS
```

**`client/src/contracts/deployment.json`:**
```json
{
  "contractAddress": "0xYOUR_SEPOLIA_ADDRESS",
  "network": "sepolia"
}
```

---

## **STEP 4: Update Environment Variables EVERYWHERE**

### **Frontend (`client/.env.production`):**
```
VITE_API_URL=https://your-backend.railway.app
VITE_CONTRACT_ADDRESS=0xYOUR_SEPOLIA_ADDRESS
```

### **Backend (`server/.env`):**
```
PORT=5000
NODE_ENV=production
CONTRACT_ADDRESS=0xYOUR_SEPOLIA_ADDRESS
HARDHAT_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
FRONTEND_URL=https://your-project.vercel.app
```

---

## **STEP 5: Final Git Commit & Push**

```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

Vercel and Railway will auto-redeploy! 🚀

---

## **TESTING YOUR DEPLOYED APP**

### **1. Test Frontend**
- Go to: `https://your-project.vercel.app`
- Should load instantly ✅

### **2. Test Backend Connection**
- Frontend should connect to backend
- No CORS errors in browser console

### **3. Test Wallet Connection**
1. Open app
2. Change MetaMask to **Sepolia network**
3. Click "Connect Wallet"
4. Should work ✅

### **4. Test Certificate Issuance**
1. Go to Admin Dashboard
2. Try issuing a test certificate
3. Should work on Sepolia blockchain ✅

### **5. Test PDF Download**
1. Issue a certificate
2. Try download
3. Should generate PDF ✅

---

## **COMPLETE DEPLOYMENT CHECKLIST ✓**

- [ ] Frontend pushed to Vercel
- [ ] Backend pushed to Railway
- [ ] Smart contract deployed to Sepolia
- [ ] All environment variables set
- [ ] Frontend connects to backend
- [ ] MetaMask shows Sepolia network option
- [ ] Can issue certificate
- [ ] Can download PDF
- [ ] Can verify certificate
- [ ] No console errors
- [ ] Works on mobile phone
- [ ] Share link with friends/portfolio

---

## **Your Final URLs**

After deployment, you'll have:

```
🌐 Frontend: https://your-project.vercel.app
🔧 Backend: https://your-backend.railway.app
📋 Contract: https://sepolia.etherscan.io/address/0x...
```

**Add to Portfolio/Resume:**
```
Student Document Vault - Blockchain Certificate System
Live Demo: https://your-project.vercel.app
GitHub: https://github.com/YasH-Bodhe/Student-Document-Vault
Stack: React, Express, Solidity, Ethereum (Sepolia), Tailwind CSS
```

---

## **Common Issues & Fixes 🔧**

### **Issue: CORS Error in Console**
**Solution:** Update `FRONTEND_URL` in backend `.env` to your Vercel URL

### **Issue: Contract Address Not Working**
**Solution:** Make sure you updated all 3 places with Sepolia address

### **Issue: MetaMask won't connect**
**Solution:** User must switch to Sepolia network in MetaMask

### **Issue: Transaction fails**
**Solution:** 
1. Make sure wallet has Sepolia ETH (get from faucet)
2. Check gas prices aren't too high
3. Make sure contract address is correct

### **Issue: File uploads not working**
**Solution:** Railway/Render store files in ephemeral storage (resets on restart). For persistent storage, upgrade to MongoDB Atlas free tier.

---

## **BONUS: Make It Even Better 🌟**

### **Add MongoDB for Persistent Storage** (If files reset issue)

1. Go: https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to backend `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
```
5. Update `inMemoryDB.js` to use MongoDB instead of JSON

### **Add Domain Name** (Optional, Free)
- Use: https://www.freedns.afraid.org (free subdomain)
- Or: https://www.noip.com (free dynamic DNS)

---

## **DEPLOYMENT SUMMARY**

| Component | Platform | Cost | Time |
|-----------|----------|------|------|
| **Frontend** | Vercel | FREE | 5 min |
| **Backend** | Railway | FREE | 5 min |
| **Database** | JSON (free) or MongoDB Atlas (free tier) | FREE | - |
| **Blockchain** | Sepolia Testnet | FREE | 10 min |
| **Domain** | Included or free subdomain | FREE | - |
| **Total** | | **$0** | **~25 min** |

---

## **FOR YOUR PORTFOLIO 📄**

When you add to resume/portfolio, mention:

```
✅ Fully deployed blockchain application
✅ Live demo available at [URL]
✅ Built with React, Express, Solidity
✅ Integrated with Ethereum testnet
✅ Real-time smart contract interactions
✅ Production-ready deployment on Vercel & Railway
```

---

## **Next Steps After Deployment**

1. **Test thoroughly** - Try all features
2. **Create demo video** - Record yourself using it
3. **Write blog post** - How you built it
4. **Share on Twitter/LinkedIn** - Show your work!
5. **Update portfolio** - Add live link
6. **Update GitHub README** - Add deployment link
7. **Apply to jobs** - Show this to employers! 💼

---

## **Estimated Costs If You Used Paid Services**

```
Without Free Tiers:
- Vercel Pro: $20/month
- Railway: $5-20/month
- MongoDB: $0-100/month
- Domain: $12/year
Total: $100+/month

Your Cost: $0 + Free Services = $0 🎉
```

---

## **You're Ready! 🚀**

Follow these steps and your project will be live on the internet in about 30 minutes. 

**Perfect for:** 
- Portfolio projects
- Resume links
- Showing employers
- LinkedIn showcase
- GitHub showcase
- Job applications

Good luck! 🎓✨
