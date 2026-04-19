# CI/CD & Docker Setup Guide 🐳🚀

## **What We Just Set Up**

✅ **Docker Containerization** - Package app components as containers  
✅ **Docker Compose** - Run all services together locally  
✅ **GitHub Actions CI/CD** - Auto-deploy on every push  
✅ **Multi-stage Builds** - Optimized production images  
✅ **Health Checks** - Services monitor each other  
✅ **Security Scanning** - Automatic vulnerability checks  

---

## **PART 1: Local Development with Docker**

### **1.1: Prerequisites**

Install Docker:
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Mac**: https://docs.docker.com/desktop/install/mac-install/
- **Linux**: https://docs.docker.com/engine/install/

### **1.2: Run Everything with One Command**

```bash
# From project root
docker-compose up

# Output:
# ✅ Frontend running on http://localhost:3000
# ✅ Backend running on http://localhost:5000
# ✅ Blockchain node running on http://localhost:8545
```

### **1.3: Stop Everything**

```bash
docker-compose down
```

### **1.4: Common Docker Commands**

```bash
# View running containers
docker ps

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Run specific service
docker-compose up frontend

# Remove everything (clean slate)
docker-compose down -v
```

---

## **PART 2: GitHub Actions CI/CD Pipeline**

### **What Happens Automatically on Every Push:**

```
You push to main
    ↓
GitHub Actions triggers
    ↓
┌─────────────────────────────────────────┐
│ 1️⃣ Build Docker Images                 │
│    - Frontend image                     │
│    - Backend image                      │
│    - Push to GitHub Container Registry  │
├─────────────────────────────────────────┤
│ 2️⃣ Run Tests                           │
│    - Lint code                          │
│    - Build frontend                     │
│    - Build backend                      │
├─────────────────────────────────────────┤
│ 3️⃣ Security Scan                       │
│    - Check for vulnerabilities          │
│    - Report issues                      │
├─────────────────────────────────────────┤
│ 4️⃣ Deploy Frontend                     │
│    - Deploy to Vercel                   │
│    - Get live URL                       │
├─────────────────────────────────────────┤
│ 5️⃣ Deploy Backend                      │
│    - Deploy to Railway                  │
│    - Get live URL                       │
├─────────────────────────────────────────┤
│ 6️⃣ Notify Status                       │
│    - Send Slack notification            │
│    - Show deployment links              │
└─────────────────────────────────────────┘
    ↓
✅ Your app is live on internet!
```

---

## **PART 3: Setup GitHub Actions**

### **3.1: Create GitHub Secrets**

1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Add these secrets:

```
VERCEL_TOKEN
  └─ Get from: https://vercel.com/account/tokens

VERCEL_ORG_ID
  └─ Find in Vercel project settings

VERCEL_PROJECT_ID
  └─ Find in Vercel project settings

RAILWAY_TOKEN
  └─ Get from: https://railway.app/account/tokens

SLACK_WEBHOOK_URL (Optional - for notifications)
  └─ Get from: https://api.slack.com/messaging/webhooks
```

### **3.2: Get Your Tokens**

#### **Vercel Token:**
1. Go: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `GitHub Actions`
4. Copy and add to GitHub Secrets as `VERCEL_TOKEN`

#### **Vercel Project Details:**
1. Go: https://vercel.com/dashboard
2. Select your project
3. Settings → General
4. Find `Project ID` and `Org ID`
5. Add to GitHub Secrets

#### **Railway Token:**
1. Go: https://railway.app/account/tokens
2. Click "Create new token"
3. Copy and add to GitHub Secrets as `RAILWAY_TOKEN`

### **3.3: Verify Workflow File**

Check if `.github/workflows/deploy.yml` exists and is correct:

```bash
cat .github/workflows/deploy.yml
```

---

## **PART 4: Test the Pipeline**

### **4.1: Make a Test Change**

```bash
# Make a small change
echo "# CI/CD Test" >> README.md

# Push to GitHub
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### **4.2: Watch It Deploy**

1. Go to GitHub repo
2. Click "Actions" tab
3. Watch the workflow run
4. See logs for each step

```
✅ build-docker      - Building container images
✅ test              - Running tests
✅ security-scan     - Checking vulnerabilities
✅ deploy-frontend   - Deploying to Vercel
✅ deploy-backend    - Deploying to Railway
✅ deployment-status - Sending notifications
```

### **4.3: Check Deployment**

After workflow completes:
- Frontend: Visit your Vercel URL ✅
- Backend: Visit your Railway URL ✅
- GitHub: See Docker images in Packages ✅

---

## **PART 5: Understanding the Architecture**

### **Docker Images Pushed to GitHub Container Registry:**

```
ghcr.io/YasH-Bodhe/student-document-vault/frontend:latest
ghcr.io/YasH-Bodhe/student-document-vault/backend:latest
```

You can pull and run them anytime:

```bash
docker pull ghcr.io/YasH-Bodhe/student-document-vault/frontend:latest
docker run -p 3000:3000 ghcr.io/.../frontend:latest
```

### **Deployment Targets:**

```
GitHub (Source Code)
    ↓
GitHub Actions (CI/CD)
    ├─ Build Docker images
    ├─ Run tests
    └─ Deploy to:
        ├─ Vercel (Frontend)
        └─ Railway (Backend)
    ↓
Live Internet 🌐
```

---

## **PART 6: Monitoring & Logging**

### **6.1: View Workflow Logs**

1. GitHub repo → Actions tab
2. Click latest workflow run
3. Click job name to see logs
4. Search for errors/warnings

### **6.2: Common Issues & Fixes**

| Issue | Cause | Fix |
|-------|-------|-----|
| `authentication failed` | Missing secrets | Add correct tokens to GitHub Secrets |
| `docker build failed` | Missing Dockerfile | Check file paths are correct |
| `deployment failed` | Wrong project ID | Verify VERCEL_PROJECT_ID and VERCEL_ORG_ID |
| `health check failed` | Service not starting | Check port numbers and environment variables |

### **6.3: Real-time Monitoring**

```bash
# Watch GitHub Actions logs
gh run list --repo YasH-Bodhe/Student-Document-Vault
gh run view <RUN_ID> --log
```

---

## **PART 7: Your Automated Workflow**

### **Workflow:**

```
You work locally
    ↓
Test on http://localhost:3000
    ↓
Happy with changes?
    ↓
git push origin main
    ↓
GitHub Actions automatically:
├─ Tests code
├─ Builds containers
├─ Deploys to Vercel & Railway
└─ Notifies you
    ↓
Changes LIVE on internet! 🎉
```

### **Zero Manual Deployment Steps! ✨**

```bash
# This is ALL you need to do:
git add .
git commit -m "Your changes"
git push origin main

# Everything else happens automatically! 🚀
```

---

## **PART 8: Environment Variables**

### **Create `.env.production` Files**

**`client/.env.production`:**
```
VITE_API_URL=https://your-backend.railway.app
VITE_CONTRACT_ADDRESS=0xYOUR_SEPOLIA_ADDRESS
```

**`server/.env.production`:**
```
PORT=5000
NODE_ENV=production
CONTRACT_ADDRESS=0xYOUR_SEPOLIA_ADDRESS
HARDHAT_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
FRONTEND_URL=https://your-project.vercel.app
```

Docker will use these automatically!

---

## **PART 9: Pull Requests & Preview Deployments**

### **What Happens When You Create a PR:**

1. GitHub Actions runs tests
2. Vercel creates preview deployment
3. Preview URL appears in PR
4. You can test before merging
5. Merge to main → Production deploy

---

## **PART 10: Rollback (If Something Goes Wrong)**

### **Rollback to Previous Version:**

```bash
# See commit history
git log --oneline

# Revert to specific commit
git revert <COMMIT_HASH>

# Or reset (careful!)
git reset --hard <COMMIT_HASH>

# Push to trigger redeploy
git push origin main
```

GitHub Actions will automatically deploy the previous version!

---

## **PART 11: Performance Metrics**

### **Build Times:**
- Docker build: 2-3 minutes (first time)
- Tests: 1-2 minutes
- Deploy: 3-5 minutes
- **Total: 6-10 minutes** ⏱️

### **Storage:**
- Frontend image: ~200MB
- Backend image: ~250MB
- Total: ~450MB (compressed)

---

## **For Your Portfolio:**

When showing employers, mention:

```
✅ Fully containerized with Docker
✅ Automated CI/CD with GitHub Actions
✅ Zero-downtime deployments
✅ Automatic security scanning
✅ Docker images pushed to registry
✅ Multi-environment support (dev/prod)
✅ Health checks & monitoring
✅ Production-ready infrastructure
```

This shows **DevOps/SRE skills**! 🚀

---

## **Next Level Enhancements**

Optional (not needed for portfolio):

- [ ] Kubernetes deployment (for scaling)
- [ ] Monitoring with Prometheus
- [ ] Logging with ELK stack
- [ ] Staging environment
- [ ] Automated backups
- [ ] CDN for static assets

---

## **Quick Reference**

```bash
# Local development
docker-compose up

# Rebuild images
docker-compose build

# View logs
docker-compose logs -f backend

# Stop everything
docker-compose down

# Push changes (triggers CI/CD)
git push origin main

# View workflow status
# → Go to GitHub → Actions tab
```

---

## **Summary** 🎯

| Component | What It Does |
|-----------|-------------|
| **Docker** | Packages app as containers |
| **Docker Compose** | Runs all services locally |
| **GitHub Actions** | Auto-tests and deploys |
| **Vercel** | Hosts frontend |
| **Railway** | Hosts backend |
| **Container Registry** | Stores Docker images |

**Result:** Push code once → Everything deploys automatically! 🚀

---

**You now have production-ready DevOps infrastructure!** 🎉
