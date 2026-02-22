# Bracket for Group Plans

A website that lets one person create a bracket (e.g. concert dates), share a link, and have friends tap through matchups to pick a winner. The organizer sees a ranked list of what the group wants. Data is stored in **Supabase** so it persists when you deploy.

## 1. Set up Supabase (one-time)

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. **New project** → pick a name, password, and region → Create.
3. When the project is ready, open **Project Settings** (gear) → **API**. Copy:
   - **Project URL** → use as `SUPABASE_URL`
   - **anon public** key → use as `SUPABASE_ANON_KEY`
4. Open **SQL Editor** → New query. Paste the contents of `supabase/schema.sql` and run it. That creates the `brackets` and `submissions` tables.

## 2. Run locally

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set:

- `SUPABASE_URL` = your Project URL  
- `SUPABASE_ANON_KEY` = your anon public key  

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. Deploy to Vercel (share with friends)

1. Push the project to **GitHub** (create a repo, push your code).
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub.
3. **Add New** → **Project** → import your repo.
4. In **Environment Variables**, add:
   - `SUPABASE_URL` = your Project URL  
   - `SUPABASE_ANON_KEY` = your anon public key  
5. **Deploy**. Vercel will give you a URL (e.g. `your-app.vercel.app`). Share that with friends; they open it and use the same flow (create bracket → share link → vote → results).

## Flow

1. **Create** — "Create a bracket", add a title and options (or use the Rufus Du Sol preset). Submit to get a shareable link.
2. **Share** — Copy the link and send it in iMessage or text.
3. **Vote** — Friends open the link, read the short intro, tap the winner of each matchup, submit.
4. **Results** — Organizer opens the results page to see the ranked list.

## Tech

- **Next.js 14** (App Router), **React**, **Tailwind**
- **Supabase** for brackets and submissions (persistent)
- **Deploy:** Vercel (or any host that supports Next.js and env vars)

## Plan

See [PLAN.md](./PLAN.md) for the full product plan.
