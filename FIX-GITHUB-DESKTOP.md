# Fix 269,000 files in GitHub Desktop

Git is currently tracking **node_modules** and **.next** (and maybe other big folders). We need to stop tracking them and push only your real project files.

Do this **in Terminal** (Cursor: **Terminal → New Terminal**). Run each line and wait for it to finish before the next.

---

## Step 1: Go to your project folder

```bash
cd "/Users/michaelsmilko/Cursor App 4 Bracket For Group Plans"
```

---

## Step 2: Check where your Git repo is

```bash
ls -la .git
```

- If you see **No such file or directory**: the repo might be in a parent folder (that’s why 269k files). Skip to **“If .git was missing”** below.
- If you see a list of files/folders (like `HEAD`, `config`, etc.): the repo is in the right place. Go to Step 3.

---

## Step 3: Stop tracking the big folders (they stay on your computer)

Run these **one at a time** (some may say "fatal: pathspec ... did not match" — that’s OK, keep going):

```bash
git rm -r --cached node_modules
```

```bash
git rm -r --cached .next
```

```bash
git rm -r --cached .cursor
```

---

## Step 4: Re-add only what should be in the repo

```bash
git add .
```

---

## Step 5: See how many files will be committed

```bash
git status
```

You should see a **small** number of files (under 100). If you still see hundreds of thousands, the repo is in the wrong folder — use **“If .git was missing”** below.

---

## Step 6: Commit the fix

```bash
git commit -m "Stop tracking node_modules and build folders"
```

---

## Step 7: Push from GitHub Desktop

Open **GitHub Desktop**. You should see the new commit. Click **Push origin**. It should push only the small set of files now.

---

## If .git was missing (Step 2)

Then the repository GitHub Desktop is using is in a **parent** folder (e.g. your home folder), and that’s why it has 269k files.

**Fix: start a new repo only in the project folder**

1. In GitHub Desktop: **File → Remove** (remove the current repository from the list — this does **not** delete your files).
2. In Terminal, go to your project folder and run:

   ```bash
   cd "/Users/michaelsmilko/Cursor App 4 Bracket For Group Plans"
   git init
   git add .
   git status
   ```

   You should see a small number of files. If you still see node_modules or 269k files, run:

   ```bash
   git reset
   git add .
   git status
   ```

3. Commit:

   ```bash
   git commit -m "Initial commit"
   ```

4. In GitHub Desktop: **File → Add local repository**. Choose the folder **Cursor App 4 Bracket For Group Plans**. It should now see the repo you just created.
5. Click **Publish repository** (name it e.g. `bracket-app`, Public), then **Publish**.

After that, only your project files (no node_modules, no .next) will be on GitHub.
