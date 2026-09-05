# Plesk Node.js Deployment Guide — Gstaad Cricket Club (`gstaadcricketclub.ch`)

This guide explains how to deploy the **Gstaad Cricket Club** platform on an **IONOS VPS with Plesk** running **Node.js 22+**.

---

## 1. Plesk Node.js Dashboard Configuration

In your Plesk panel under **Websites & Domains** > **gstaadcricketclub.ch** > **Node.js**:

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Node.js Version** | `22.23.2` (or latest Node 22) | Matches your installed runtime |
| **Package Manager** | `npm` | Standard npm |
| **Document Root** | `/httpdocs` (or `/httpdocs/public`) | `/httpdocs` serves Next.js directly |
| **Application Mode** | `production` | Enables optimized production caching |
| **Application Root** | `/httpdocs` | Where repo files reside |
| **Application Startup File** | `app.js` | Provided in root of repository |

---

## 2. Environment Variables in Plesk

Click on **[specify]** next to **Custom environment variables** in the Plesk Node.js dashboard, or add them to `/httpdocs/.env.production`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://imbfaiprhoefwybzuwuu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYmZhaXByaG9lZnd5Ynp1d3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTYyOTQsImV4cCI6MjEwNDA5MjI5NH0.ySMzbcVz3EC0bvYVMc-IVlxgPS14olY5s9OPyosyKdU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltYmZhaXByaG9lZnd5Ynp1d3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTYyOTQsImV4cCI6MjEwNDA5MjI5NH0.ySMzbcVz3EC0bvYVMc-IVlxgPS14olY5s9OPyosyKdU
NEXT_PUBLIC_SITE_URL=https://gstaadcricketclub.ch
NODE_ENV=production
```

---

## 3. Deploy & Build Commands

### Method A: Via Plesk Web UI
1. **Pull latest code**:
   - In Plesk, under **Git**, click **Pull Updates** from your remote repository (`https://github.com/skwebies/GstaadCricketClub.git`, branch `production` or `main`).
2. **Install Dependencies**:
   - In **Node.js** dashboard, click **NPM install**.
3. **Build the Next.js Production Bundle**:
   - Click **Run Node.js commands** (or **Run Script**).
   - Enter: `npm run build`
   - Click **Run**.
4. **Restart Application**:
   - Click **Restart App** in the Node.js dashboard.

---

### Method B: Via SSH Terminal
If you have SSH access to your IONOS VPS:

```bash
cd /var/www/vhosts/gstaadcricketclub.ch/httpdocs

# 1. Pull latest code
git pull origin production

# 2. Install dependencies
npm install --production=false

# 3. Build Next.js application
npm run build

# 4. Restart Passenger / Plesk Node.js
mkdir -p tmp && touch tmp/restart.txt
```
*(Touching `tmp/restart.txt` tells Phusion Passenger to reload the application immediately without dropping active connections).*

---

## 4. Verification

After clicking **Restart App**:
1. Open [https://gstaadcricketclub.ch](https://gstaadcricketclub.ch) in your browser.
2. Verify:
   - Header, Alpine hero, and 3D cricket ball.
   - Sponsor cards under `#supporters` render all 8 partner logos.
   - Registration form submits attendee records to Supabase.
   - Admin control panel at [https://gstaadcricketclub.ch/admin](https://gstaadcricketclub.ch/admin).
