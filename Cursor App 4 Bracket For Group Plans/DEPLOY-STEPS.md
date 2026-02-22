# How to put your Bracket app online (step-by-step)

**Goal:** Get a link like `https://something.vercel.app` that you can send to friends. No coding required—just follow the steps.

---

## Part 1: Put your project on GitHub

**“Repo” = repository** = a place on GitHub that holds your project folder (your code). GitHub is free and is how Vercel will get your app to host it.

### Step 1: Create a GitHub account (if you don’t have one)

1. Go to **https://github.com**
2. Click **Sign up** and create an account (free).

### Step 2: Create a new repository on GitHub

1. Log in to GitHub.
2. Click the **+** in the top-right → **New repository**.
3. **Repository name:** type something like `bracket-app` (no spaces).
4. Leave everything else as is (Public is fine).
5. **Do not** check “Add a README” or “Add .gitignore”—your project already has these.
6. Click **Create repository**.

### Step 3: Push your project folder to that repository

You need to do this from your **project folder** on your Mac (the folder that has `package.json`, `src`, etc.).

**Option A – Using Cursor (easiest if you use Cursor):**

1. In Cursor, open your project folder: **File → Open Folder** → choose `Cursor App 4 Bracket For Group Plans`.
2. Open the **Terminal** in Cursor (menu **Terminal → New Terminal**).
3. Run these commands **one at a time** (replace `YOUR_GITHUB_USERNAME` with your actual GitHub username and `bracket-app` with the repo name you used):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bracket-app.git
   git push -u origin main
   ```

4. If it asks for a username and password: use your **GitHub username** and a **Personal Access Token** (not your normal password). To create one: GitHub → **Settings → Developer settings → Personal access tokens → Generate new token**. Give it a name, check “repo,” generate, then copy the token and paste it when Git asks for a password.

**Option B – Using the GitHub Desktop app:**

1. Download **GitHub Desktop** from https://desktop.github.com and install it.
2. Sign in with your GitHub account.
3. **File → Add local repository** → choose your project folder (`Cursor App 4 Bracket For Group Plans`). If it says “not a Git repository,” click **create a repository** and create it in that folder.
4. Write a summary like “Initial commit” and click **Commit to main**.
5. Click **Publish repository** (leave it Public), then **Publish**.

When you’re done, you should see your files on GitHub when you open your repository in the browser (e.g. `https://github.com/YOUR_USERNAME/bracket-app`). That’s your **repo**.

---

## Part 2: Put the app online with Vercel

Vercel will take the code from your GitHub repo and give you a live link.

### Step 4: Sign up and connect GitHub

1. Go to **https://vercel.com**
2. Click **Sign up** and choose **Continue with GitHub** (use the same GitHub account).
3. If it asks to install “Vercel” for GitHub, approve it (so Vercel can see your repos).

### Step 5: Create a new project from your repo

1. On Vercel, click **Add New…** → **Project**.
2. Find your **bracket-app** (or whatever you named it) in the list and click **Import** next to it.
3. On the next screen, **don’t change the settings**—just click **Deploy**.
4. Wait a minute or two. When it’s done, you’ll see a screen that says something like **Congratulations!** and shows a link (e.g. `https://bracket-app-xxx.vercel.app`).

### Step 6: Add your Supabase keys so the app can save data

Right now the app is online but it can’t save brackets yet because it doesn’t know your Supabase project.

1. In Vercel, open your project (click the project name).
2. Go to the **Settings** tab.
3. In the left sidebar, click **Environment Variables**.
4. Add **two** variables (one at a time):

   **First variable:**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://kzamwrugfhtzullhkhjp.supabase.co`
   - Click **Save**.

   **Second variable:**
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** paste the same **anon public** key you put in `.env.local` on your Mac (from Supabase → Project Settings → API → anon public).
   - Click **Save**.

5. **Redeploy** so the new keys are used:
   - Go to the **Deployments** tab.
   - Click the **⋯** on the latest deployment → **Redeploy** → **Redeploy** again.

### Step 7: Use your link

When the redeploy is finished, open the link Vercel shows (e.g. `https://bracket-app-xxx.vercel.app`). That’s the link you can send to friends. They can create brackets, vote, and see results—all saved in your Supabase project.

---

## Quick checklist

- [ ] GitHub account created
- [ ] New repository created on GitHub
- [ ] Project folder pushed to that repo (via Cursor terminal or GitHub Desktop)
- [ ] Vercel account created and connected to GitHub
- [ ] New Vercel project imported from your repo
- [ ] First deploy finished
- [ ] `SUPABASE_URL` and `SUPABASE_ANON_KEY` added in Vercel → Settings → Environment Variables
- [ ] Redeploy done after adding the variables
- [ ] Opened the Vercel link and tested creating a bracket

If you get stuck on a specific step, say which step number and what you see on the screen, and we can fix it.
