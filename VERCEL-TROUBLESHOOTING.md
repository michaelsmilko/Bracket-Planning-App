# "Failed to create bracket" on Vercel

If you see **Failed to create bracket** when using the app from your Vercel link, do these two things in order.

---

## 1. Add Supabase env vars in Vercel

The app needs your Supabase URL and key to save brackets.

1. Go to **https://vercel.com** and log in.
2. Open your **project** (the bracket app).
3. Click **Settings** → in the left sidebar click **Environment Variables**.
4. Add **two** variables:

   | Name | Value |
   |------|--------|
   | `SUPABASE_URL` | `https://kzamwrugfhtzullhkhjp.supabase.co` |
   | `SUPABASE_ANON_KEY` | Your anon public key from Supabase (same as in your `.env.local` on your Mac). Get it: Supabase dashboard → Project Settings → API → copy **anon public**. |

5. Click **Save** for each.
6. **Redeploy** so the new variables are used: go to **Deployments** → click the **⋯** on the latest deployment → **Redeploy** → confirm.

---

## 2. Create the database tables in Supabase

The app saves brackets and votes into two tables. Create them once:

1. Go to **https://supabase.com** and open your project.
2. In the left sidebar click **SQL Editor**.
3. Click **New query**.
4. Open the file **supabase/schema.sql** from your project (in Cursor or any editor), copy **all** of its contents, and paste into the SQL Editor.
5. Click **Run** (or press Cmd+Enter).
6. You should see “Success” and the tables `brackets` and `submissions` will exist.

---

## 3. Try again

Open your Vercel link again, go to Create a bracket, add a title and options, and click create. It should work.

If it still fails, the app will now show a more specific message (e.g. to check env vars or to run the schema). Redeploy your app on Vercel once so you have the latest code with those messages.
