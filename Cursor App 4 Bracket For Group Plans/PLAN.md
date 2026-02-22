# Bracket for Group Plans — Product Plan

## Vision

A **frictionless, fun** way for a group chat to decide on plans using a **bracket** (March Madness style). The **organizer** gets a link; the **app builds the bracket** (e.g. every date + city for a tour) so no one has to type options. Friends open the link, **tap the winner of each matchup** until they’ve filled out their bracket to one champion. When everyone has submitted, the **organizer gets results**: averaged scores showing which options the group most wants. No app install, no sign-up—just a link.

**Example:** Rufus Du Sol North America tour. Organizer picks “Rufus Du Sol NA Tour”; app fills in **every** date and location. Friends open the link and tap through each head-to-head until they’ve picked their winner. Results: “Chicago Apr 2 ranked #1, Brooklyn Mar 15 #2…” so the group sees where everyone wants to go.

---

## Website, Not a Native App

**Yes—a website is the right choice.**

| Why | Reason |
|-----|--------|
| **Link-first** | The whole flow is "share a link in iMessage/text." That's the web: one URL, tap to open in the browser. A native app would require "download our app" first—friction for every participant. |
| **No install** | Participants do nothing except open the link. No App Store, no sign-in, no permissions. A website delivers that; an app doesn't. |
| **One organizer, many participants** | Most people only ever open the link once. They don't need an app on their home screen. The organizer might use the site more; it still works great in the browser (or "Add to Home Screen" if they want). |
| **Simpler to build and ship** | One codebase, one URL. No app store review, no iOS/Android split. Deploy and share the link. |
| **Optional: PWA** | If you want an app-like experience (e.g. full screen, icon), the website can be a Progressive Web App so "Add to Home Screen" gives a dedicated experience without a native app. |

So: **build a website.** The plan already assumes it (shareable link, works in Safari and in-app browser from iMessage). Calling it an "app" elsewhere in the doc is just product language; the delivery is a **website** that feels fast and focused.

---

## How It Works (Bracket Mechanics) — Option A

**Individual brackets + aggregate results.**

1. **App creates the bracket**  
   - The app supplies all options (e.g. every Rufus NA date & city). Organizer doesn’t type dates—they pick the event (or paste a link), and the bracket is built.  
   - Every option appears in the bracket (byes/play-in if the count isn’t a power of 2).

2. **Each person fills out their own bracket**  
   - One link. Friend opens it, sees matchup 1: “Pick the winner” → **[Mar 15 Brooklyn]** vs **[Apr 2 Chicago]** → tap one.  
   - Next matchup, next, … all the way to the final. They tap the winner of every matchup until they’ve chosen one champion.  
   - Submit. Done.

3. **Scores are averaged; organizer gets results**  
   - Once everyone has submitted, the app aggregates: e.g. “How many people had each option as their champion?” and “Points by round (winner = most points, finalist = fewer, etc.).”  
   - Results show **which places the group most wants to go** (e.g. ranked list: Chicago Apr 2, Brooklyn Mar 15, LA Apr 10…).  
   - The **organizer** gets the results (results page, or “Results ready” when everyone’s in).

**Why this is quick:**  
- Organizer doesn’t fill in dates—the app does.  
- Friends only tap; one screen per matchup, all the way to the winner.  
- One submission per person; organizer sees the group ranking when everyone’s done.

---

## User Flows

### 1. Organizer (sets it up)

1. Opens app (or “create” link).
2. **Picks the event** (e.g. “Rufus Du Sol – North America Tour”).  
   - No typing dates: app creates the bracket with **every** date and location for that tour.
3. Optionally names the bracket (e.g. “Rufus – which show?”).
4. Gets a **short, shareable link** (e.g. `bracket.app/r/abc123`).
5. Pastes link in group chat (iMessage / text).
6. When everyone has submitted, **organizer gets the results** (ranking of options, who picked what, etc.).

### 2. Friend (opens link in iMessage/text)

1. Taps link → opens in Safari or in-app browser (e.g. from iMessage). **No sign-in.** No app pitch—just the bracket.
2. **First screen: very brief explanation** of what the bracket is and how matchups work (e.g. "You'll see two options at a time; tap the one you prefer. Keep going until you've picked one winner. Takes a minute."). No explanation of the app itself—only what they're doing.
3. **One matchup per screen.** "Pick the winner" → **[Option A]** vs **[Option B]** → tap one. Next matchup, repeat until they've picked their champion.
4. Submit (one button when the bracket is complete).
5. Done. Optional nickname so organizer can see "Mike submitted."

**Frictionless =**  
- Accessible from iMessage with no sign-in and no distraction—so the organizer can easily incorporate everyone's feedback.  
- No install, no sign-up. Brief "how the bracket works" then straight into matchups.  
- One tap per matchup; complete your bracket to the winner.

---

## Participant Friction: What Not to Miss

**Principle:** Only one person is running the show. For everyone else, the ask should be as close to zero-friction as possible. Nothing that could make them bounce or put it off.

| Risk | Mitigation |
|------|------------|
| **"What is this link?"** | Link preview (Open Graph) shows bracket title (e.g. "Rufus Du Sol – pick your show") so in iMessage it looks legit, not random. Short, clean URL. |
| **First screen** | Very brief: what the bracket is and how matchups work (pick winner each time, tap through to one champion). No app explanation, no "Enter your name" or long rules. One short blurb, then into the first matchup. Optional nickname only after submit or skip-able. |
| **Too many taps** | Show progress: "Matchup 3 of 15." Makes the ask feel bounded. Keep each tap instant (no unnecessary loading). |
| **Lost progress** | Save state in the browser (e.g. localStorage). If they close the tab or get a call, reopening the same link on the same device resumes where they left off. No login required. |
| **"Do I need to come back?"** | After submit: "You're done! [Organizer] will share the results in the chat." So they never have to return to the app to see the outcome. |
| **Bad connection** | If a tap or submit fails, retry in the background or queue and sync when back online. Don't show "Submitted" until it's really in (or clearly "Saving…"). |
| **In-app browser quirks** | Test the flow in iMessage (and other in-app browsers). Some restrict localStorage or back button; design so resume and navigation still work. |
| **Duplicate submissions** | One person, two devices: either allow and let organizer see "5 submissions" and trim if needed, or gently block "Already submitted from this device" to keep results clean. Decide and document. |

**Summary:** Accessible from iMessage with no sign-in or distraction so the organizer can easily incorporate everyone's feedback. First screen = brief "how the bracket works" (not the app), then first matchup. No sign-up, no typing (except optional nickname), progress indicator, resume if they leave, "you're done" + results in the chat.

---

## App Creates the Bracket: How to Get Concert Dates

**Goal:** Organizer doesn't fill in dates. The app builds the bracket with **every** date and location (e.g. full Rufus NA tour). Keep it **quick** and reliable.

**Where do dates live?** Concert dates appear in many places: artist site, Songkick, Bandsintown, Ticketmaster, etc. Each source has different formats and update schedules.

**Options (easiest → more work):**

| Approach | Pros | Cons |
|----------|------|------|
| **Curated list** | Reliable, fast, no scraping. Add "Rufus Du Sol NA Tour" once with full dates/venues; organizer just picks it. | You maintain the list when tour updates. Best for a few key tours at first. |
| **API (Bandsintown, Songkick, Ticketmaster)** | Structured data, many artists. One integration supports lots of events. | API keys, rate limits, possibly cost. |
| **Scraping** | Can pull from any public page. | Fragile when sites change, multiple formats, legal/ToS. Not ideal for quick and reliable. |

**AI first stab + manual entry:**  
- **Option: AI takes the first stab** at filling in dates (e.g. organizer types "Rufus Du Sol North America tour" and the app uses AI to fetch or infer a list of dates/venues from the web or a known source).  
- **Always available: manual entry.** Organizer can add, edit, or remove options so the bracket is correct. Best of both: quick AI draft, human control.

**Recommendation for MVP:**  
- Support **both**: (1) AI-generated list when the organizer enters an event name (or pastes a URL), and (2) **manual entry** to add/edit/remove options. Curated lists can still exist for popular tours (Rufus NA, etc.) as a one-tap option.  
- **Later:** Tighten AI sources (API, structured scrape) and keep manual entry as the fallback.

**Every option in the bracket:** For Rufus NA, include every date and venue. Bracket size 16, 32, etc.; use byes if count isn't a power of 2. One matchup per screen; friends tap through the full bracket.

---

## What Makes It “Work From a Link in iMessage or Text”

| Requirement | Approach |
|-------------|----------|
| **Single URL** | One short link per bracket (e.g. `/r/xyz`). Same link for creator and voters. |
| **No install** | Web app only; add to home screen optional. |
| **Mobile-first** | Big tap targets, minimal typing, works in narrow viewport and in-app browsers. |
| **Fast load** | Lightweight front end; server or serverless API for votes and bracket state. |
| **Shareable** | Link is the only thing to copy/paste into iMessage or SMS. |
| **Works offline?** | Nice-to-have: cache current round so a tap still works on bad signal; sync when back online. |

---

## Rufus Du Sol Example (Concrete)

- **Bracket name:** “Rufus Du Sol NA Tour – Pick date & city”
- **Options:** App supplies **every** date and location for the NA tour (no organizer typing). e.g. Mar 15 Brooklyn, Mar 22 Austin, Apr 2 Chicago, Apr 10 LA, … all tour stops.
- **Friend flow:** Open link → tap winner of matchup 1, then matchup 2, … all the way to the final → submit. One champion per person.
- **When everyone has submitted:** Organizer gets results: ranked list of which options the group most wants (e.g. Chicago Apr 2 #1, Brooklyn Mar 15 #2…) plus optional "X of Y picked this as their winner."
- **Outcome:** Clear group preference so you can pick the show.

---

## MVP Scope (What to Build First)

**In scope:**

1. **App creates the bracket**  
   - **AI first stab (optional):** Organizer enters event name (e.g. "Rufus Du Sol North America tour") or pastes a URL; app uses AI to suggest dates/venues.  
   - **Manual entry (always available):** Organizer can add, edit, or remove options. Curated lists (e.g. Rufus NA Tour) remain a one-tap option.  
   - Bracket auto-generated from the final option list (seed order or random); byes if not power of 2.

2. **Shareable link**  
   - One short URL (e.g. bracket.app/r/abc123). Same link for organizer and friends.

3. **Individual brackets: tap through to winner**  
   - One matchup per screen. Friend taps winner of each matchup, in order, until they've picked a champion.  
   - Store full bracket per submission (anonymous or optional nickname).  
   - Submit when bracket is complete.

4. **Aggregate results when everyone has submitted**  
   - Score options: e.g. how many people had X as champion, and/or points by round (winner = most points, finalist = fewer).  
   - Produce a **ranked list** of which options the group most wants.

5. **Organizer gets results**  
   - Results page (or "Results ready") when all submissions are in.  
   - Show ranking + optional "3 of 5 had Chicago as #1."

6. **Mobile-first UI**  
   - Big tap targets, one matchup per screen, works in Safari and in-app browser from iMessage/text.

**Out of scope for MVP:**

- Accounts/login (optional nickname only).  
- API or scraping for concert dates (use curated list first).  
- Notifications when everyone's submitted.  
- Editing bracket after creation (or keep it very limited).

---

## If You Have No Formal Coding or Planning Experience

Experts in product and software usually recommend the following. You don’t need to do everything at once—use what fits.

**Planning**

- **You already have enough.** This doc is your plan and your spec. Product people often say: “A one-page plan that you actually follow beats a 50-page plan you don’t.” You’re in good shape.
- **Don’t over-plan.** Avoid adding more sections, edge cases, or “what ifs” before you have something that works. When in doubt, refer back to the “First slice” and MVP scope above.
- **One goal for v1:** Organizer creates a bracket, shares a link, friends tap through and submit, organizer sees a ranked result. Everything else (AI dates, progress bar, resume) can wait until that works.

**Building (how to get it made)**

You have three realistic paths:

| Path | What it means | Best if |
|------|----------------|--------|
| **Build with AI-assisted coding (e.g. Cursor)** | You describe what you want in plain English; the AI suggests or writes code. You run the app locally or deploy to a free host. | You’re okay following step-by-step instructions, running commands in a terminal, and tweaking text/code with guidance. |
| **Use a no-code or low-code tool** | Tools like Glide, Softr, or Airtable: you build forms and links without writing code. Bracket logic (matchups, aggregation) may be limited or hacky. | You mainly want to test “will people use a link and tap choices?” and can accept a simpler or rougher version first. |
| **Hire or partner with a developer** | You provide this plan as the spec; they build the website. You can use a fixed-price “build the MVP” scope or a short contract. | You’d rather invest money than time and want a polished v1 without learning to code. |

**What experts usually recommend**

- **Start with the smallest version.** “Create bracket → share link → vote → see results.” No accounts, no AI, no extra features. Get that working, then add one thing at a time.
- **Use your plan as the contract.** When you (or a dev, or the AI) aren’t sure what to build, the answer is in this doc. If something isn’t in the MVP scope, it’s v2.
- **Test with real people early.** As soon as you have a shareable link and a vote flow, send it to your Rufus Du Sol group. Their “this was confusing” or “I couldn’t open it in iMessage” is worth more than another week of planning.
- **Keep cost at zero until it’s useful.** Hosting (e.g. Vercel, Netlify, Supabase) has free tiers. Don’t pay for domains or services until you’ve validated that people use it.
- **Don’t aim for perfect.** Experts ship “good enough,” then improve. Your bar for v1: organizer can create a bracket, friends can open the link and complete it, organizer sees a ranked list. Polish (copy, progress bar, resume) comes after that.

**Bottom line:** You don’t need formal experience. You need a clear goal (this plan), a small first version (the first slice), and one real use (your friend group). Use this doc as your guide and add or change only when something in the real world tells you to.

---

## Ready to Prototype?

**Yes.** The plan is enough to start. Lock these in as you build (no need to decide everything up front):

| Decide when building | Suggestion for prototype |
|---------------------|---------------------------|
| **Stack** | e.g. React (or Vue) + Vite, Vercel or Netlify, Supabase or similar for bracket + submissions. Or Next.js API routes + DB. |
| **Bracket order** | Same matchup order for everyone (deterministic from option list). Random or seed-based pairing is fine. |
| **Organizer expected count** | Optional. For v1 just show "N submissions"; organizer knows the group size. Add "3 of 5 in" later if useful. |
| **Duplicate submissions** | Allow; organizer sees list and can ignore duplicates. Or block same-device duplicate via localStorage. Pick one and ship. |
| **AI for dates** | Can add in a second pass. Prototype with manual entry + one curated list (e.g. Rufus NA) so the flow works end-to-end first. |

**First slice:** Organizer creates a bracket (manual options or pick Rufus NA), gets shareable link. Friend opens link, sees brief intro, taps through matchups, submits. Organizer sees results (ranked list). Then add progress indicator, resume state, and polish.

---

## Tech Hints (So It’s Link-Friendly and Simple)

- **Front end:** Single-page app (React, Vue, or even vanilla) with responsive CSS; no heavy frameworks so the link opens fast on mobile.
- **Back end:** Small API to create bracket, get bracket state, submit vote, advance round. Could be serverless (e.g. Vercel + DB like Supabase or Turso) so you don’t manage a server.
- **URL:** Short path per bracket (e.g. `/r/abc123`). Optionally QR code for IRL sharing.
- **Data:** Bracket definition (title, options, structure), rounds, matchups, votes per matchup. No PII required.

---

## Nice-to-Haves Later

- Optional nickname so the group sees “Sarah voted for Brooklyn.”
- “Round 2 is open” nudge (link in chat again or optional email/SMS if you add it).
- Multiple brackets per “event” (e.g. date bracket + location bracket, then combine).
- Export result as image for the group chat (“We’re doing April 2 – Chicago!”).
- Dark mode for late-night planning.

---

## Summary

| Goal | Solution |
|------|----------|
| Quick for organizer | App creates the bracket; organizer picks the event (e.g. Rufus NA Tour). No typing dates. |
| Frictionless for friends | One link, no install, no sign-up. Tap the winner of each matchup until bracket is complete; submit. |
| Fun | Individual brackets feel like a game; aggregate results show where the group wants to go. |
| Works in iMessage/text | Single shareable URL, mobile-first web app. |
| Every option in the bracket | Curated list has every date + location for the tour; all appear in the bracket. |
| Organizer gets results | When everyone has submitted, organizer sees ranked list (and optional counts). |

Next step: define the exact MVP screens (organizer: pick event → get link; friend: tap through matchups → submit; organizer: results page), add a curated Rufus NA tour list, then choose stack and build pick event → bracket → share link and vote flow as the first slice.
