# Easiest ways to get your app online

You have two options. Pick one.

---

## Option 1: Have someone else do it (fastest for you)

**Give this to a technical friend or a freelancer** (e.g. on Fiverr, “deploy Next.js app to Vercel,” ~$20–40):

**What they need:**
- Your project folder: **Cursor App 4 Bracket For Group Plans** (they can copy it or you zip it).
- Two values from you (you get these from Supabase → Project Settings → API):
  - **SUPABASE_URL:** `https://kzamwrugfhtzullhkhjp.supabase.co`
  - **SUPABASE_ANON_KEY:** (the anon public key from your `.env.local` — copy it and send it to them in a secure way).

**What you tell them to do:**
1. Push only the project code to a new GitHub repo (no `node_modules`, no `.next` — use the project’s `.gitignore`).
2. Create a Vercel account, import that repo, add the two env vars above, deploy.
3. Send you the live link (e.g. `https://something.vercel.app`).

**You do:** Nothing. They send you the link; you share it with friends.

---

## Option 2: Deploy without GitHub (you do it, no Git)

You can deploy **directly from your computer** using Vercel’s tool—no GitHub, no Git commands.

### Step 1: Install the Vercel app

1. Go to **https://vercel.com**
2. Sign up or log in (use “Continue with Email” or Google).
3. In the dashboard, look for **“Add New…”** → **Project**.
4. You’ll see “Import Git Repository.” Scroll or look for **“Deploy without Git”** or **“Upload”** — or use the method below.

**If you don’t see “Deploy without Git”:**

1. Go to **https://vercel.com/download** and install the **Vercel CLI** (or search “Vercel CLI install”).
2. Or: in your project folder, open Terminal and run:
   ```bash
   npx vercel
   ```
   (It may ask to install something — type `y` and Enter.)

### Step 2: Deploy from your project folder

1. Open **Terminal** in Cursor (Terminal → New Terminal).
2. Run:
   ```bash
   cd "/Users/michaelsmilko/Cursor App 4 Bracket For Group Plans"
   npx vercel
   ```
3. When it asks **“Set up and deploy?”** → type **Y** and Enter.
4. **“Which scope?”** → pick your account (Enter).
5. **“Link to existing project?”** → **N** (new project).
6. **“What’s your project’s name?”** → type **bracket-app** (or anything) and Enter.
7. It will upload and build. When it’s done, it will print a link like **https://bracket-app-xxx.vercel.app**.

### Step 3: Add your database keys so the app works

1. Go to **https://vercel.com** and log in.
2. Open your project (**bracket-app**).
3. Go to **Settings** → **Environment Variables**.
4. Add:
   - **Name:** `SUPABASE_URL`  
     **Value:** `https://kzamwrugfhtzullhkhjp.supabase.co`
   - **Name:** `SUPABASE_ANON_KEY`  
     **Value:** (paste the same key you have in `.env.local`)
5. Save. Then go to **Deployments** → click the **⋯** on the latest one → **Redeploy**.

### Step 4: Use your link

After the redeploy finishes, open the link Vercel gave you. That’s the link you share with friends. No GitHub needed.

---

## Summary

| Option | You do | Result |
|--------|--------|--------|
| **1. Someone else** | Send folder + 2 keys, get link back | Easiest for you |
| **2. Vercel without Git** | Run `npx vercel`, add 2 env vars in dashboard, redeploy | No Git, no GitHub |

If Option 2 still feels like too much, use Option 1 and hand it off.
