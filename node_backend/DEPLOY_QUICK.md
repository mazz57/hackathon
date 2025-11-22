# 🚀 Quick Deployment Guide

## Files Created for Render Deployment

1. **`render.yaml`** - Render service configuration
2. **`DEPLOYMENT.md`** - Complete step-by-step deployment guide
3. **`.env.production`** - Production environment template
4. **`package.json`** - Updated with build script and Node.js version

## Quick Start Commands

### 1. Push to GitHub

```bash
cd node_backend
git init
git add .
git commit -m "Ready for Render deployment"
git remote add origin https://github.com/YOUR_USERNAME/sahaya-backend.git
git push -u origin main
```

### 2. Deploy on Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (see DEPLOYMENT.md)
5. Click "Create Web Service"

### 3. Set Environment Variables in Render

Add these in Render Dashboard:

- `NODE_ENV=production`
- `MONGO_URI` (from MongoDB Atlas)
- `JWT_SECRET` (random 32+ chars)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## 📖 Full Documentation

See **DEPLOYMENT.md** for complete instructions including:

- MongoDB Atlas setup
- Twilio configuration
- Troubleshooting
- Monitoring

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied
- [ ] Twilio account set up
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] API tested and working
