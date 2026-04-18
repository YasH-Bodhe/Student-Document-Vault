# 📦 Deployment Guide

## Prerequisites for Production

- Ethereum mainnet or testnet (Sepolia) account with ETH
- MongoDB cloud (Atlas) account
- Frontend hosting (Vercel, Netlify, AWS)
- Backend hosting (Heroku, Railway, AWS, DigitalOcean)
- Domain name (optional)
- SSL certificate (auto-provided by most hosts)

---

## 🔗 Smart Contract Deployment

### Deploy to Sepolia Testnet

```bash
cd blockchain

# 1. Compile
npx hardhat compile

# 2. Deploy
npx hardhat run scripts/deploy.js --network sepolia

# 3. Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### Deploy to Ethereum Mainnet

⚠️ **WARNING: Uses real ETH. Be careful!**

```bash
cd blockchain

# 1. Update hardhat.config.js with mainnet RPC
# 2. Ensure PRIVATE_KEY is mainnet wallet
# 3. Compile
npx hardhat compile

# 4. Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# 5. Verify on Etherscan
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

#### hardhat.config.js (Mainnet addition)

```javascript
networks: {
  mainnet: {
    url: process.env.MAINNET_RPC_URL,
    accounts: [process.env.PRIVATE_KEY],
    chainId: 1,
  }
}
```

---

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended for beginners)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
cd server
railway init

# 4. Add environment variables
railway variables set PORT=5000
railway variables set MONGODB_URI=your_atlas_uri
railway variables set CONTRACT_ADDRESS=0x...

# 5. Deploy
railway up
```

### Option 2: Heroku

```bash
# 1. Install Heroku CLI
npm i -g heroku

# 2. Login
heroku login

# 3. Create app
cd server
heroku create your-app-name

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set CONTRACT_ADDRESS=0x...

# 5. Deploy
git push heroku main
```

### Option 3: AWS EC2

```bash
# 1. SSH into instance
ssh -i key.pem ec2-user@your-instance-ip

# 2. Install Node.js
sudo yum update
sudo yum install nodejs npm

# 3. Clone repository
git clone https://github.com/yashbodhe/student-document-vault.git
cd student-document-vault/server

# 4. Install dependencies
npm install

# 5. Setup .env
nano .env  # Add your configuration

# 6. Install PM2 for process management
sudo npm install -g pm2
pm2 start src/app.js --name "vault-backend"
pm2 startup
pm2 save

# 7. Setup Nginx as reverse proxy
sudo yum install nginx
# Configure nginx to forward to localhost:5000
```

### MongoDB Cloud Setup

1. **Create MongoDB Atlas Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster**
   - Choose cloud provider (AWS, Azure, GCP)
   - Select region closest to you
   - Create cluster

3. **Create Database User**
   - Go to Database Access
   - Add user with strong password
   - Set appropriate roles

4. **Get Connection String**
   - Click Connect
   - Copy connection string
   - Replace `<password>` with your password
   - Use as MONGODB_URI

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/student-vault?retryWrites=true&w=majority
```

---

## 💻 Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to client
cd client

# 3. Deploy
vercel

# 4. Follow prompts and add environment variables in dashboard
```

#### Vercel Environment Variables

Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.com/api
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=11155111 (or 1 for mainnet)
```

### Option 2: Netlify

```bash
# 1. Build the app
cd client
npm run build

# 2. Install Netlify CLI
npm i -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env]
  VITE_API_URL = "https://your-backend-url.com/api"
  VITE_CONTRACT_ADDRESS = "0x..."
  VITE_NETWORK_ID = "11155111"
```

### Option 3: AWS S3 + CloudFront

```bash
# 1. Build
cd client
npm run build

# 2. Create S3 bucket
aws s3 mb s3://your-vault-app --region us-east-1

# 3. Upload files
aws s3 sync dist/ s3://your-vault-app --delete

# 4. Create CloudFront distribution
# Use AWS Console
# Point to S3 bucket
# Add custom domain (optional)
```

---

## 🔐 Environment Variables (Production)

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/student-vault

# Blockchain
CONTRACT_ADDRESS=0x...your_contract_address...
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ADMIN_PRIVATE_KEY=0x...keep_this_secure...

# Client
CLIENT_URL=https://your-frontend-url.com

# Security
JWT_SECRET=generate_strong_random_string_here
JWT_EXPIRE=7d
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=1 # 1 for mainnet, 11155111 for Sepolia
```

---

## 🚨 Production Checklist

- [ ] Smart contract audited
- [ ] Smart contract verified on Etherscan
- [ ] Environment variables configured
- [ ] HTTPS enabled everywhere
- [ ] MongoDB backup configured
- [ ] API rate limiting enabled
- [ ] Error handling complete
- [ ] Logging implemented
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Database indexed for performance
- [ ] CDN configured (for frontend assets)
- [ ] SSL certificate valid
- [ ] Domain name configured
- [ ] DNS records set correctly
- [ ] Monitoring/alerting set up
- [ ] Regular security audits planned

---

## 📊 Monitoring

### Backend Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-auto-pull

# Monitor processes
pm2 monit

# View logs
pm2 logs
```

### Database Monitoring

- Use MongoDB Atlas dashboard
- Monitor query performance
- Set up alerts for connection issues

### Frontend Monitoring

- Use Sentry for error tracking
- Monitor Core Web Vitals
- Set up analytics

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install & Build
        run: |
          npm install
          npm run build:client
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 💰 Cost Estimation (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | 512MB | $57+ (shared) |
| Vercel | 100GB bandwidth | Free-$20 |
| Railway | $5 | $5+ |
| Ethereum Gas | - | ~$0.01-1 per tx |
| Domain | - | $10-15 |
| **Total** | - | **~$30-50+** |

---

## 🔐 Security Recommendations

1. **Never expose private keys**
   - Use environment variables
   - Rotate keys periodically
   - Use hardware wallets for mainnet

2. **Database security**
   - Enable authentication
   - Use VPC peering
   - Regular backups
   - Monitor access logs

3. **API security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - API key rotation

4. **Frontend security**
   - CSP headers
   - Subresource integrity
   - Regular dependency updates
   - Security headers

5. **Smart contract security**
   - Code audit
   - Test coverage
   - Security best practices
   - Reentrancy protection

---

## 📈 Scaling Tips

1. **Database optimization**
   - Add indexes
   - Archive old data
   - Use read replicas

2. **API optimization**
   - Caching (Redis)
   - Database query optimization
   - CDN for assets

3. **Smart contract optimization**
   - Batch operations
   - Optimize gas usage
   - Consider layer 2 solutions (Polygon, Arbitrum)

---

## 🆘 Troubleshooting Deployment

### Issue: 503 Service Unavailable
```
Solution:
- Check backend logs
- Verify MongoDB connection
- Check environment variables
- Restart backend service
```

### Issue: CORS Errors
```
Solution:
- Update CLIENT_URL in backend .env
- Check frontend URL in CORS config
- Clear browser cache
```

### Issue: Slow API Responses
```
Solution:
- Check MongoDB indexes
- Monitor database queries
- Add caching layer
- Scale backend vertically/horizontally
```

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Etherscan API](https://etherscan.io/apis)
- [Web3 Security](https://blog.soliditydeveloper.com/)

---

**Ready for production! 🚀**
