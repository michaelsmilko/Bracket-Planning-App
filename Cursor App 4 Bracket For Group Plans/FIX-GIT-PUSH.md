# Fix: "Too many files" or "Over 100MB" when pushing to GitHub

Your project folder should only have **dozens** of files (your code). The huge size is from **node_modules** and **.next**—those are already in `.gitignore` but were probably added to Git before. Fix it like this:

---

## Step 1: Open Terminal in your project folder

In Cursor: **Terminal → New Terminal**.  
Make sure you're in the right folder. Type:

```bash
pwd
```

You should see a path that ends with **Cursor App 4 Bracket For Group Plans**.  
If not, run:

```bash
cd "/Users/michaelsmilko/Cursor App 4 Bracket For Group Plans"
```

---

## Step 2: Unstage everything (don’t remove any files)

This removes everything from the “staged” list. Your files stay on disk; only Git’s staging is cleared:

```bash
git reset
```

---

## Step 3: Add only what Git should track (respects .gitignore)

Now when you add files, `.gitignore` will skip `node_modules`, `.next`, and other big folders:

```bash
git add .
```

---

## Step 4: See how many files will be committed

```bash
git status
```

You should see a **small** number of files (under 100), things like:
- `src/...`
- `package.json`, `README.md`, `DEPLOY-STEPS.md`, etc.  
You should **not** see `node_modules` or `.next` in the list.

---

## Step 5: Commit and push again

```bash
git commit -m "Initial commit"
git push -u origin main
```

(If you already did a first commit and just had too much in it, use:

```bash
git add .
git commit --amend -m "Initial commit"
git push -u origin main --force
```

only if your repo is new and you’re okay rewriting the first commit.)

---

## If you’re still over 100MB or 268k files

Then the Git repo might have been created in a **parent** folder (e.g. your home folder), so it’s tracking your whole computer. In that case:

1. In Terminal, run: `pwd` and `ls -la`. You should see `package.json`, `src`, `.gitignore`, and a `.git` folder.
2. If you don’t see `.git` in this folder, or if `pwd` is not inside `Cursor App 4 Bracket For Group Plans`, the repo is in the wrong place.
3. Tell me exactly what `pwd` prints and whether you see a `.git` folder when you run `ls -la`, and we can fix it.
