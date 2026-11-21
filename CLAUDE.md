# Food Mirror · Essensspiegel — rules for every Claude working here

Two people work on this repo, each with their own Claude: Michael (owner) and Alina (nutrition counsellor, Körperkompass, dein-koerperkompass.de). Neither is a professional developer. Explain in plain language, make small changes, show the result.

## What the app is
A phone app (static PWA, no build step) that lets a person show or tell what they bought, ate or threw away, and mirrors it back after a few days. Live at https://向日葵.世界/food-mirror/ behind a code word.

## Principles (do not break these)
- **Mirror, don't judge.** Positive things are said strongly. Everything else is stated as a plain fact plus "Magst du darüber nachdenken?". Ideas/alternatives only on request and only after several days.
- **No calorie or weight pressure.** No kcal totals, no weight, no diet language. Nutrient coverage, enjoyment and zero waste are the measures.
- **No boxes.** The eight Körperkompass eater types are Alina's work. Real users are never labelled with a type. Types appear only on the invented sample people (`personas.js`) for review.
- **The diary stays on the phone** (localStorage). Never add accounts, analytics, trackers or outside requests (no CDNs, no Google Fonts). The only server call is the Supabase function for the AI, which stores nothing but a cost log.
- **Languages:** English and German everywhere in the app; German is the main audience. Everything on GitHub (code, comments, commit messages, file names) is in English. Alina's guide is German.
- **Accessible:** text ≥ 16 px, tap targets ≥ 48 px, good contrast, works with a screen reader, respects reduced motion.

## Files
- `app.js` — the app. All texts are in the `T` table at the top (`de` and `en`); change both.
- `personas.js` — the six sample people (one per eater type) and the real test week.
- `foods.js` — a small built-in food list (values per 100 g).
- `style.css` — Körperkompass colours and fonts.
- `supabase/functions/essensspiegel/index.ts` — the AI function (Deno). Deployed separately to Supabase project `gartenapp`; changing this file does **not** deploy it. Ask Michael.
- `sw.js` — offline cache. Bump the cache name `C` when you change files.

## How to work
- Work on a branch and open a pull request. Never push to `main` directly: `main` is what the live site serves.
- In the PR, describe the change in two or three plain sentences (German is fine) and, for visible changes, add a phone-size screenshot (390 × 844).
- Test before the PR: open `index.html` through a local server, check DE and EN, check the sample people still load.
- Never put keys, passwords or the code word in the repo.
