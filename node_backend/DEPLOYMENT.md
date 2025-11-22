# 🚀 Deploying SAHAYA Backend to Render

This guide will walk you through deploying the SAHAYA backend to Render, a cloud platform that offers free hosting for web services.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ A [Render account](https://render.com) (free)
- ✅ A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) (free tier available)
- ✅ A [Twilio account](https://www.twilio.com) with SMS capabilities
- ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

Since Render's free tier doesn't include a database, you'll use MongoDB Atlas:

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **"M0 Free"** tier
5. Choose a cloud provider and region (preferably close to your Render region)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Create a username and strong password (save these!)
4. Set privileges to **"Read and write to any database"**
5. Click **"Add User"**

### 1.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Render to connect
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go back to **"Database"** in the sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your database name after `.net/` (e.g., `women_safety`):
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/women_safety?retryWrites=true&w=majority
   ```

---

## 📤 Step 2: Push Code to Git Repository

### 2.1 Initialize Git (if not already done)

```bash
cd node_backend
git init
```

### 2.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New repository"**
3. Name it `sahaya-backend`
4. Don't initialize with README (you already have code)
5. Click **"Create repository"**

### 2.3 Push Your Code

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - SAHAYA backend ready for deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sahaya-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Render

### 3.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Web Service"**

### 3.2 Connect Repository

1. Click **"Connect a repository"**
2. Authorize Render to access your GitHub account
3. Select your `sahaya-backend` repository
4. Click **"Connect"**

### 3.3 Configure Web Service

Fill in the following settings:

| Field              | Value                                                                      |
| ------------------ | -------------------------------------------------------------------------- |
| **Name**           | `sahaya-backend` (or any name you prefer)                                  |
| **Region**         | Choose closest to you (e.g., Oregon, Frankfurt)                            |
| **Branch**         | `main`                                                                     |
| **Root Directory** | Leave empty (or `node_backend` if repo contains both frontend and backend) |
| **Environment**    | `Node`                                                                     |
| **Build Command**  | `npm install`                                                              |
| **Start Command**  | `npm start`                                                                |
| **Plan**           | `Free`                                                                     |

### 3.4 Add Environment Variables

Scroll down to **"Environment Variables"** section and add the following:

Click **"Add Environment Variable"** for each:

| Key                   | Value                                   | Example                                                    |
| --------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `NODE_ENV`            | `production`                            | `production`                                               |
| `PORT`                | `5000`                                  | `5000`                                                     |
| `MONGO_URI`           | Your MongoDB Atlas connection string    | `mongodb+srv://user:pass@cluster.mongodb.net/women_safety` |
| `JWT_SECRET`          | A strong random string (32+ characters) | `your_super_secret_jwt_key_12345_random`                   |
| `TWILIO_ACCOUNT_SID`  | From Twilio Console                     | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                       |
| `TWILIO_AUTH_TOKEN`   | From Twilio Console                     | `your_twilio_auth_token`                                   |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number                | `+1234567890`                                              |

**To generate a strong JWT_SECRET:**

```bash
# On Linux/Mac
openssl rand -base64 32

# Or use online generator
# https://randomkeygen.com/
```

### 3.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait for the deployment to complete (usually 2-5 minutes)
4. You'll see logs in real-time

---

## ✅ Step 4: Verify Deployment

### 4.1 Check Service Status

1. Once deployed, you'll see **"Live"** status with a green indicator
2. Your service URL will be displayed (e.g., `https://sahaya-backend.onrender.com`)

### 4.2 Test the API

Open your browser or use curl to test:

```bash
# Test root endpoint
curl https://sahaya-backend.onrender.com/

# Expected response:
# "Women Safety App Backend is running..."
```

### 4.3 Test Health Check

```bash
# Test API health
curl https://sahaya-backend.onrender.com/api/auth/login

# Should return 400 or validation error (means API is working)
```

---

## 📱 Step 5: Update Frontend to Use Production API

### 5.1 Update API Configuration

In your frontend (`SAHAYA/services/api.ts`), update the base URL:

```typescript
const PRODUCTION_URL = "https://sahaya-backend.onrender.com/api";

const getBaseUrl = () => {
  // Use production URL if in production, otherwise local
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:5000/api";
    }
    return `http://${LOCAL_IP}:5000/api`;
  }
  return PRODUCTION_URL;
};
```

Or create an environment variable in Expo:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || getBaseUrl();
```

---

## 🔧 Step 6: Monitor and Maintain

### 6.1 View Logs

1. In Render Dashboard, click on your service
2. Go to **"Logs"** tab
3. Monitor real-time logs for errors

### 6.2 Auto-Deploy on Git Push

Render automatically redeploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update: added new feature"
git push origin main

# Render will automatically detect and redeploy
```

### 6.3 Manual Deploy

1. Go to Render Dashboard
2. Click on your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## ⚠️ Important Notes

### Free Tier Limitations

- **Sleep after inactivity**: Free services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep takes 30-60 seconds
- **750 hours/month**: Free tier includes 750 hours (enough for 1 service running 24/7)

### Keep Service Awake (Optional)

To prevent sleeping, you can use a service like [UptimeRobot](https://uptimerobot.com/) to ping your API every 10 minutes:

1. Sign up at UptimeRobot
2. Create a new monitor
3. Set URL to: `https://sahaya-backend.onrender.com/`
4. Set interval to 5 minutes

### Database Backups

MongoDB Atlas free tier includes:

- Automatic backups (retained for 2 days)
- Manual snapshots available

---

## 🐛 Troubleshooting

### Build Fails

**Error: `npm install` fails**

- Check `package.json` for syntax errors
- Ensure all dependencies are listed
- Check Render logs for specific error

**Solution:**

```bash
# Test locally first
cd node_backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Service Crashes on Start

**Error: "Application failed to respond"**

- Check environment variables are set correctly
- Verify MongoDB connection string
- Check logs for specific errors

**Common issues:**

- Missing `PORT` environment variable
- Invalid `MONGO_URI` (check username/password)
- Missing required environment variables

### Database Connection Fails

**Error: "MongoServerError: Authentication failed"**

- Verify MongoDB Atlas username and password
- Check connection string format
- Ensure IP whitelist includes 0.0.0.0/0

### Twilio SMS Not Working

**Error: "Twilio authentication failed"**

- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- Check Twilio phone number format (+1234567890)
- Ensure Twilio account has SMS credits

---

## 📊 Monitoring Your Service

### Render Dashboard Metrics

View in Render Dashboard:

- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

### Set Up Alerts

1. Go to **"Settings"** in your service
2. Add **"Notification Emails"**
3. Get notified on:
   - Deploy failures
   - Service crashes
   - High error rates

---

## 🚀 Upgrade to Paid Plan (Optional)

For production use, consider upgrading:

| Plan         | Price     | Benefits                                |
| ------------ | --------- | --------------------------------------- |
| **Starter**  | $7/month  | No sleep, faster builds, more resources |
| **Standard** | $25/month | Dedicated resources, priority support   |

---

## 📝 Quick Reference

### Your Deployment URLs

- **Backend API**: `https://YOUR-SERVICE-NAME.onrender.com`
- **API Base**: `https://YOUR-SERVICE-NAME.onrender.com/api`
- **Health Check**: `https://YOUR-SERVICE-NAME.onrender.com/`

### Environment Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGO_URI` (from MongoDB Atlas)
- [ ] `JWT_SECRET` (random 32+ characters)
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`

### Useful Commands

```bash
# View logs
render logs --tail

# Restart service
render restart

# Deploy manually
git push origin main
```

---

## 🎉 Success!

Your SAHAYA backend is now deployed and running on Render!

**Next Steps:**

1. Test all API endpoints
2. Update frontend with production URL
3. Deploy frontend to Expo/Vercel
4. Set up monitoring and alerts
5. Share with users!

---

## 📞 Support

If you encounter issues:

- Check [Render Documentation](https://render.com/docs)
- Visit [Render Community](https://community.render.com/)
- Check [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

**Happy Deploying! 🚀**
