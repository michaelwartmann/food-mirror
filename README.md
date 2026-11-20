# Essensspiegel / Food mirror

Eat what you like. Show or tell the app what you bought, ate or threw away: a photo, a few spoken words, or one tap on a meal you've had before. After a few days it mirrors back what stands out: strongly where things go well, plainly where they might be worth a thought. No judgement, no boxes, no calorie pressure.

- **Your diary stays on your phone** (localStorage). No account, no tracking. Back up / restore as a file.
- **The AI only looks, it doesn't keep.** Photos, voice and text go once through a small Supabase function to OpenRouter (zero data retention) and come back as food lines with grams and nutrients per 100 g. Only a cost log is stored. Code word protected, daily budget cap.
- **Packages:** show the nutrition table or barcode; exact values from the label or Open Food Facts.
- **Sample people** (More → For Alina): six invented people with four weeks each, every one quietly carrying one of the eight Körperkompass eater types, plus one real week entered through the live AI.

## Pieces
- `index.html`, `style.css`, `app.js`, `foods.js`, `personas.js`: the static PWA (no build step).
- `supabase/functions/essensspiegel/`: the server function (Deno). Runs in the Supabase project `gartenapp`, JWT off, own code-word check. Config and cost log in schema `essensspiegel`.

## AI (OpenRouter, key in `essensspiegel.config`, never in code)
Vision + text: `google/gemini-3.8-flash` (fallback `anthropic/claude-haiku-5.5`), about half a cent per entry. Speech-to-text: Voxtral. Voice: MAI-Voice (German).

MIT licence. Fonts: Nunito Sans and Bebas Neue, SIL OFL.
