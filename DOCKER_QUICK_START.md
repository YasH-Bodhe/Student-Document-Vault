# 🐳 Docker Quick Start - 5 Minutes

## **One Command to Run Everything Locally**

```bash
docker-compose up
```

That's it! 🎉

## **What's Running:**

- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ Blockchain: http://localhost:8545 (optional)

## **Commands:**

```bash
# Start everything
docker-compose up

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Rebuild (if you change code)
docker-compose build

# Run specific service
docker-compose up frontend

# Remove everything including data
docker-compose down -v
```

## **That's All You Need!** ✨

No need to run `npm install` in 3 different folders.  
No need to run Hardhat, Express, and Vite separately.  
One command does it all! 🚀

---

# 🚀 GitHub Actions Quick Start

## **Setup (5 minutes one-time):**

1. Add GitHub Secrets:
   - Go to repo → Settings → Secrets
   - Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `RAILWAY_TOKEN`

2. That's it!

## **After Setup:**

```bash
git add .
git commit -m "Your changes"
git push origin main

# GitHub Actions automatically:
# - Tests your code
# - Builds Docker images
# - Deploys to Vercel & Railway
# - Notifies you
```

## **Watch It Deploy:**

1. Go to GitHub → Actions tab
2. See your workflow running
3. Check Vercel & Railway for live app

**Zero manual deployment! Fully automated!** 🤖

---

## **Common Issues:**

| Problem | Solution |
|---------|----------|
| Containers won't start | `docker-compose down && docker-compose up` |
| Port already in use | Change ports in docker-compose.yml |
| Changes not reflected | Run `docker-compose build` |
| Out of disk space | `docker system prune -a` |

That's it! Happy coding! 🎓
