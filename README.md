# Travencia V2 — Railway Deployment Guide

## What's Changed from V1
- ✅ No agent/ref system — all bookings go directly to admin
- ✅ Payment methods: **PayPal, Bank Transfer, Cash App, Other** (Visa/Mastercard/Apple Pay removed)
- ✅ Contact email updated to **travenciaagency@gmail.com** everywhere
- ✅ WhatsApp number configurable via a single meta tag (no code editing needed)

---

## Step 1 — Set Your WhatsApp Number

Open **every HTML file** and find this line near the top (inside `<head>`):
```html
<meta name="tv-wa" content="REPLACE_WITH_WHATSAPP_NUMBER"/>
```
Replace `REPLACE_WITH_WHATSAPP_NUMBER` with your WhatsApp number — **digits only, no + or spaces**.

Example: If your number is **+237 6XX XXX XXX**, write `2376XXXXXXXX`

Files to update:
- `public/index.html`
- `public/destinations.html`
- `public/activities.html`
- `public/services.html`
- `public/worldcup.html`
- `public/admin.html`

---

## Step 2 — Deploy to Railway

### 2a. Create a Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project → Empty Project**

### 2b. Add a MySQL Database
1. In your project, click **+ Add Service → Database → MySQL**
2. Wait for it to provision
3. Click the MySQL service → **Variables** tab
4. Note your `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

### 2c. Run the Database Schema
1. In the MySQL service, click **Connect → MySQL Client** (or use TablePlus/DBeaver)
2. Run `railway_schema.sql` first
3. Run `railway_seed.sql` second

### 2d. Deploy the App
1. Click **+ Add Service → GitHub Repo** (push this folder to a GitHub repo first)
   — OR — use **Railway CLI**: `railway up`
2. Railway will auto-detect Node.js and run `npm start`

### 2e. Set Environment Variables
In your app service → **Variables**, add:

| Variable | Value |
|---|---|
| `JWT_SECRET` | Any long random string (e.g. 64 random chars) |
| `DB_HOST` | Your MySQL host from step 2b |
| `DB_PORT` | `3306` |
| `DB_USER` | Your MySQL user |
| `DB_PASS` | Your MySQL password |
| `DB_NAME` | `railway` |
| `DB_SSL` | `true` |
| `ADMIN_WHATSAPP` | Your WhatsApp digits (same as meta tag) |

---

## Step 3 — Create Your Admin Account

Once deployed, open your Railway URL and:
1. Register a normal account at `/index.html`
2. Connect to your MySQL database and run:
   ```sql
   UPDATE users SET role='admin' WHERE email='your@email.com';
   ```
3. Log in — you'll now have access to `/admin.html`

---

## File Structure

```
travencia-v2/
├── server.js              ← Express API server
├── package.json
├── .env.example           ← Copy to .env for local dev
├── railway_schema.sql     ← Run first in Railway MySQL
├── railway_seed.sql       ← Run second (destinations data)
└── public/
    ├── index.html
    ├── destinations.html
    ├── activities.html
    ├── services.html
    ├── worldcup.html
    ├── admin.html
    ├── css/
    │   └── main.css       ← (copy from your original)
    ├── images/            ← (copy from your original)
    └── js/
        ├── data.js        ← All destinations, pricing data
        ├── auth.js        ← Login/register modal
        └── booking.js     ← Booking modal (4 payment methods)
```

> **Note:** Copy your `public/css/main.css` and `public/images/` folder from your original deployment — they are not included here as they haven't changed.

---

## Payment Flow (How it Works)

1. User books → chooses **PayPal / Bank Transfer / Cash App / Other**
2. Booking is saved in MySQL with status `pending`
3. A WhatsApp message is auto-sent to your admin number with full booking details
4. User is shown a success screen: *"Take a screenshot and send to admin"*
5. Admin confirms payment manually and updates status in `/admin.html`

---

## Local Development

```bash
cp .env.example .env
# Fill in your DB credentials in .env
npm install
npm run dev
# Open http://localhost:3000
```
# travencia
