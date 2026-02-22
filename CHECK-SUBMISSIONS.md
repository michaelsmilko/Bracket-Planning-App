# Check if friends' submissions were saved

**Good news:** We never delete submissions. Anything that made it to the database is still there.

## See how many submissions exist for your bracket

1. Go to **https://supabase.com** → your project.
2. Click **Table Editor** in the left sidebar.
3. Open the **submissions** table.
4. Find your bracket’s ID: it’s in the share URL. If the link is  
   `https://your-app.vercel.app/r/abc123xyz`  
   then the bracket ID is **abc123xyz**.
5. In the table, look at the **bracket_id** column. Count how many rows have  
   `bracket_id = abc123xyz`  
   (or use the table filter: filter **bracket_id** equals your id).

- **If you see only 1 row** with that bracket_id → only your submission was saved. Friends either didn’t finish and tap Submit, or their Submit failed (network/error) and they may not have seen a clear error.
- **If you see more rows** → those submissions are saved. If the results page still shows only you, tell me and we can fix a possible display bug.

## Next time

After the changes we made, when someone submits they’ll see either:
- **“You’re done! You’re response #X.”** so they know it saved, or  
- The **exact error message** if it failed, so they can try again or you can fix the issue.

No historical data is deleted; you only need friends to redo their brackets if their submissions never reached the database.
