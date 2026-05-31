# ConTrackr — Free Live Deployment Guide

Deploy ConTrackr for **free** using three services:

| Service | Role | Free Tier |
|---|---|---|
| **TiDB Cloud** | MySQL database (serverless) | 5 GB storage, no expiry |
| **Render** | Node.js backend API | 750 hrs/month (sleeps after 15 min inactivity) |
| **Netlify** | React frontend | Unlimited sites, 100 GB bandwidth/month |

> **Estimated time:** 30–45 minutes.

---

## Step 1 — Set Up TiDB Cloud (Database)

1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free account.
2. Click **Create Cluster** → choose **Serverless** → pick any region → click **Create**.
3. Wait ~30 seconds for the cluster to provision.
4. Click your cluster → **Connect** → **General** tab.
5. Note down these values (you'll need them for Step 3):
   - **Host** (looks like `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
   - **Port** (usually `4000`)
   - **Username** (looks like `your_name.root`)
   - **Password** (click "Generate password" and copy it somewhere safe)
6. Click **Chat2Query** (or use the **SQL Editor** tab) to run your schema:
   - Open `database/contrackr_schema.sql` from this project.
   - Paste the entire contents and click **Run**.
   - This creates all tables.
7. Optionally, run `database/seed.sql` (if present) to add sample data.

---

## Step 2 — Deploy the Backend on Render

1. Go to [https://render.com](https://render.com) and sign up (free).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and push this project's `backend/` folder to a GitHub repo
   (or use **Upload** if available).
4. Fill in the form:
   - **Name:** `contrackr-api` (or any name)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Scroll to **Environment Variables** and add each of the following:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DB_HOST` | *(your TiDB host from Step 1)* |
   | `DB_PORT` | `4000` |
   | `DB_USER` | *(your TiDB username)* |
   | `DB_PASSWORD` | *(your TiDB password)* |
   | `DB_NAME` | `contrackr_db` |
   | `JWT_SECRET` | *(a long random string — see tip below)* |
   | `JWT_EXPIRES_IN` | `24h` |
   | `FRONTEND_URL` | *(leave blank for now; fill in after Step 3)* |

   > **Tip — Generate a JWT secret:** Open any terminal and run:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   > ```
   > Copy the output and use it as `JWT_SECRET`.

6. Click **Create Web Service**. Render will build and deploy (~2 minutes).
7. Copy your Render URL — it looks like `https://contrackr-api.onrender.com`.
   Test it: open `https://contrackr-api.onrender.com/api/health` — you should see `{"status":"ok"}`.

---

## Step 3 — Deploy the Frontend on Netlify

### A. Update the API proxy URL

Open `frontend/netlify.toml` and replace `YOUR-BACKEND-NAME` with your actual Render service name:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://contrackr-api.onrender.com/api/:splat"   # ← your Render URL
  status = 200
  force = true
```

### B. Deploy to Netlify

**Option 1 — Drag & Drop (quickest):**

1. In the `frontend/` folder, run:
   ```bash
   npm install
   npm run build
   ```
   This creates a `frontend/dist/` folder.
2. Go to [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**.
3. Drag the entire `dist/` folder into the drop zone.
4. Done! Netlify gives you a URL like `https://amazing-name-123.netlify.app`.

**Option 2 — Git deploy (auto-deploys on push):**

1. Push the `frontend/` folder to GitHub.
2. Go to [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**.
3. Pick your repo and configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site**.

### C. Update CORS on Render

1. Go back to your Render dashboard → your `contrackr-api` service → **Environment**.
2. Update `FRONTEND_URL` to your Netlify URL, e.g. `https://amazing-name-123.netlify.app`.
3. Click **Save Changes** — Render will redeploy automatically.

---

## Step 4 — Verify Everything Works

1. Open your Netlify URL in a browser.
2. Log in with your seed data credentials (check `database/seed.sql` or create a user via the API).
3. Navigate to all pages — Dashboard, Projects, Materials, etc.
4. Test on mobile (open on your phone or use browser DevTools → responsive mode).

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| **Backend returns 502 / sleeps on first visit** | Render free tier sleeps after 15 min. First request wakes it up (~30s delay). Normal behavior. |
| **CORS error in browser console** | Make sure `FRONTEND_URL` on Render exactly matches your Netlify URL (no trailing slash). |
| **Database connection error** | Double-check TiDB host, port (4000), username, and password in Render env vars. |
| **`SSL: CERTIFICATE_VERIFY_FAILED`** | TiDB Cloud requires SSL. The updated `connection.js` handles this automatically in production. |
| **Login returns 401** | JWT_SECRET must be the same value every time Render redeploys. Set it once and don't change it. |
| **White screen on Netlify** | The `netlify.toml` and `public/_redirects` files handle SPA routing. Make sure they're included in the build. |
| **API calls fail (404) on Netlify** | Make sure you updated the `netlify.toml` redirect URL to your actual Render backend URL. |

---

## Optional — Custom Domain

1. Buy a domain at Namecheap, Cloudflare Registrar, etc.
2. In Netlify → Site settings → **Domain management** → **Add custom domain**.
3. Follow Netlify's DNS instructions (usually takes < 1 hour to propagate).
4. Update `FRONTEND_URL` on Render to your custom domain.

---

## Local Development (without TiDB)

If you want to run locally with a local MySQL database:

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env
# Edit .env: set NODE_ENV=development and DB_HOST=localhost
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

The frontend dev server proxies `/api/*` to `http://localhost:5000` automatically (configured in `vite.config.js`).

---

*ConTrackr — Construction Materials Delivery & Inventory Monitor*
