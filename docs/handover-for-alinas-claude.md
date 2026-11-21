# Handover: onboarding Alina to Food Mirror (for Alina's Claude)

*Written by Michael's Claude. Alina will paste or attach this file in a chat with you. Please follow it interactively with her. Speak German with her, warmly and plainly, one step at a time, and wait for her answer before the next step.*

## Who is who
- **Alina Wartmann** runs *Körperkompass* (dein-koerperkompass.de), nutrition counselling that joins nutrition knowledge with the psychology of eating. She knows eating patterns deeply; she is **not** a software developer. Never assume she knows Git, branches or code. Explain every technical word in one short German sentence, or avoid it.
- **Michael Wartmann** is her brother. He built the app with his Claude ("Michael's Claude", who wrote this file).
- **The app:** Food Mirror / Essensspiegel, a phone app. A person shows or tells what they bought, ate or threw away (photo, a few spoken words, or one tap on a meal from before). After a few days it mirrors back what stands out: strongly where things go well, as a plain fact plus "Magst du darüber nachdenken?" where something might be worth a thought. No calories, no weight, no labels; the diary stays on the phone. Look and tone are taken from her Körperkompass site.
- **Live app:** https://向日葵.世界/food-mirror/ (code word: Michael gives it to her; do not write it into GitHub).
- **Repo:** https://github.com/michaelwartmann/food-mirror (public). Read `CLAUDE.md` there first: it holds the project's rules, and they apply to you too.

## What this is for her
The app is **a gift, hers to use however she likes**: for herself, with her clients, as an add-on to Körperkompass, or not at all. It's open (MIT licence), so she may also copy it, rename it or make her own version. Michael isn't asking for a review; he finds it interesting and may use it himself. Don't push her into feedback or tasks. Follow her curiosity.

Things she might enjoy, if she asks what's possible:
- Using it for her own eating, or trying it with a client.
- Looking at the six invented sample people under **Mehr → Für Alina**. Each has four weeks of eating and is quietly built around one of her eight eater types (Stress, Gewohnheit, Alles-oder-Nichts, Belohnung, Trost, Balance; Reiz and Kontroll don't exist yet).
- Changing the wording of the mirror or the ideas, or adding her own sample people, so it fits how she works.

Her eater types are her intellectual work. The app never shows a type to a real user; types appear only on the invented sample people.

## Onboarding, step by step
1. **Say hello** and explain in two sentences what you'll do together (look at the app, then set up a way for her to suggest or make changes).
2. **App on the phone.** Ask her to open the live app, enter the code word, and install it (Android: menu ⋮ → "App installieren"; iPhone: Share → "Zum Home-Bildschirm"). Let her try one entry: "Gegessen" → a few words like "Haferflocken mit Banane".
3. **Sample people (if she's curious).** Mehr → Für Alina → one person → Spiegel. If she has thoughts, note them; they can become wishes later.
4. **Only if she wants to change things: GitHub account.** Using the app needs no account at all; stop here if that's all she wants. Otherwise ask whether she has a GitHub account. If not, help her sign up at github.com (free); explain GitHub as "der gemeinsame Ordner und das Schwarze Brett des Projekts". Then ask her to send **her GitHub username** to Michael (WhatsApp is fine). Michael invites her; she accepts by the e-mail GitHub sends.
5. **Connect GitHub to Claude**, so you can read and change the project for her. On her plan, Claude Code in the cloud (claude.ai/code, or the "Code" area in the Claude app) works with GitHub repositories. Help her connect her GitHub account there once and choose `michaelwartmann/food-mirror`. If you're unsure of the current menu names, look them up on support.claude.com rather than guessing.
6. **The message board.** GitHub Issues is where Michael, Alina and both Claudes can talk about the app: https://github.com/michaelwartmann/food-mirror/issues (forms "Wunsch" or "Fehler"; German is fine). Mention `@michaelwartmann` to notify him.
7. **Making a change herself.** In a Claude Code session on the repo, she says in plain German what she wants. You then:
   - make the change on a new branch, keeping both German and English texts in step (all texts are in the `T` table at the top of `app.js`; the sample people are in `personas.js`);
   - open a pull request with a short German description and, for anything visible, a phone-size screenshot;
   - explain to her: "Das ist jetzt ein Vorschlag. Michael (oder du) nimmt ihn an, dann ist er in der App."
   Never push to `main`, never change `supabase/functions/` (that part runs separately; ask Michael), never commit the code word or any key.
8. **Close** by reminding her it's hers: (a) just use it, (b) note wishes as issues, (c) ask you to change it, or (d) make her own copy.

## Ideas, only if she asks
- Read the mirror sentences and ideas in `app.js` (the `T.de` texts starting with `g`, `m` and `i`) and rewrite any that sound judging or clumsy.
- Add the two missing sample people, a Reiz-Esserin and a Kontroll-Esserin, with four weeks of eating each (follow the pattern in `personas.js`; keep it gentle and never pro-restriction).
- Say which patterns a counsellor would want the mirror to notice that it doesn't yet.

Her German guide for herself: `docs/onboarding-de.md`.
