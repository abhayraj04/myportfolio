# 🚀 Deploying Abhay Raj's Portfolio to Vercel

Your portfolio is fully configured and optimized for zero-config, lightning-fast deployment on **Vercel** with custom security headers and asset caching (`vercel.json`).

---

## 🌟 Method 1: Deploy via GitHub (Recommended — Auto-Updates on Git Push)

This is the best and standard way: whenever you push code or updates to GitHub, Vercel will automatically build and publish your new portfolio in seconds!

### Step 1: Push your portfolio code to GitHub
Open your terminal in this project folder (`c:\Users\abhay\OneDrive\Desktop\abhay\pf\abe`) and run:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Commit the changes
git commit -m "Enhance portfolio: Add 4 live flagship projects & Ask Abhay AI Assistant"

# 4. Link to your GitHub repository (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/abhayraj04/portfolio.git

# 5. Push to GitHub
git push -u origin main
```

*(If you already have a GitHub repository connected, just do `git add .`, `git commit -m "World-class portfolio update"`, and `git push`)*

### Step 2: Import into Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository (`portfolio`).
4. Keep the Framework Preset as **"Other"** (or Static HTML).
5. Click **"Deploy"**.

That's it! In less than 30 seconds, Vercel will give you a public URL like:
👉 `https://abhay-raj-portfolio.vercel.app` (or custom name of your choice).

---

## ⚡ Method 2: Instant Command-Line Deployment (No Git required)

You can deploy directly from your terminal in 1 minute using the Vercel CLI:

1. Open PowerShell or Terminal in this folder.
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the quick interactive prompts:
   - Log in with your email or GitHub.
   - Set up and deploy? **Yes (`y`)**
   - Which scope? Select your personal account.
   - Link to existing project? **No (`n`)**
   - Project name? Press enter to accept `abhay-raj-portfolio` (or type your preferred name).
   - In which directory is your code located? Press enter for `./`.
   - Want to modify settings? **No (`n`)**.
4. To promote to production URL:
   ```bash
   npx vercel --prod
   ```

---

## 🌐 Custom Domain (Optional & Free)

To use your own domain (e.g. `abhayraj.com` or `abhayraj.in`):
1. In the Vercel dashboard, go to your project **Settings** -> **Domains**.
2. Type your domain name and follow the simple DNS record instructions.

---

## 📁 Included Live Projects on Your Portfolio

Your portfolio features 4 premier live deployed applications:
1. **CricketIQ AI — Predictive Match Intelligence & Dream XI Curator**
   - Live URL: `https://cricketiq-ai-6v9zshmcx5xybirrsucsoh.streamlit.app/`
2. **Customer Churn Intelligence Platform**
   - Live URL: `https://customer-churn-intelligence-platform-h9fbshxjfay2vvvt4perax.streamlit.app/`
3. **Campus Placement Portal**
   - Live URL: `https://campus-placement-portal-2663.onrender.com`
4. **India Pilgrimage — Sacred Heritage & Destination Platform**
   - Live URL: `https://india-pilgrimage.vercel.app/`

---

## 🤖 Built-In AI Assistant Feature

Visitors and recruiters can chat with **"Ask Abhay AI"** on your live site!
- Available 24/7 via the floating bottom-right button `Ask Abhay AI ✨`.
- Pre-loaded with comprehensive answers about your skills, all 4 live projects, education, internship, leadership, and contact channels.
- Includes realistic voice read-out, suggestion prompt pills, and 1-click clipboard actions.
