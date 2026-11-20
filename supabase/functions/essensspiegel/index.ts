// Essensspiegel backend. Stateless: photos, voice and text pass through once and are not stored.
// Only a cost log (kind + amount) is kept. Code-word protected (x-code header, salted sha256 in essensspiegel.config).
import postgres from "npm:postgres@3.4.5";

const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 2 });
const OR = "https://openrouter.ai/api/v1";
const OFF = "https://world.openfoodfacts.org";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-code, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors, "Content-Type": "application/json" } });

let cfgCache: Record<string, string> | null = null;
async function cfg() {
  if (!cfgCache) {
    const rows = await sql`select key, value from essensspiegel.config`;
    cfgCache = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }
  return cfgCache!;
}
async function sha256(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
async function okCode(code: string | null) {
  if (!code) return false;
  const c = await cfg();
  return (await sha256(c.salt + code.trim().toLowerCase())) === c.code_hash;
}
async function logCost(kind: string, cost: number | undefined | null) {
  try { await sql`insert into essensspiegel.usage_log(kind, cost_usd) values (${kind}, ${cost ?? null})`; } catch { /* ignore */ }
}
async function spentToday() {
  const [r] = await sql`select coalesce(sum(cost_usd),0)::float as s from essensspiegel.usage_log where at > now() - interval '1 day'`;
  return r.s as number;
}
function bytesToB64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

// ---------- speech ----------
const AUDIO_FMT: Record<string, string> = {
  "audio/webm": "webm", "audio/ogg": "ogg", "audio/mp4": "m4a", "audio/x-m4a": "m4a",
  "audio/aac": "aac", "audio/mpeg": "mp3", "audio/wav": "wav", "audio/x-wav": "wav",
};
async function transcribe(b64: string, mime: string, lang: string) {
  const c = await cfg();
  const fmt = AUDIO_FMT[(mime || "").split(";")[0]] ?? "webm";
  const r = await fetch(`${OR}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.openrouter_key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: c.stt_model, language: lang === "en" ? "en" : "de", input_audio: { data: b64, format: fmt } }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Abschrift: " + (d?.error?.message ?? r.status));
  await logCost("stt", d?.usage?.cost);
  return { text: String(d.text ?? "").trim() };
}
async function speak(text: string) {
  const c = await cfg();
  const r = await fetch(`${OR}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.openrouter_key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: c.tts_model, voice: c.tts_voice_de, input: text.slice(0, 400), response_format: "mp3" }),
  });
  if (!r.ok) throw new Error("Stimme: " + r.status);
  const bytes = new Uint8Array(await r.arrayBuffer());
  await logCost("tts", text.length * 0.000015);
  return { audio_b64: bytesToB64(bytes), mime: "audio/mpeg" };
}

// ---------- Open Food Facts ----------
function offNutr(p: any) {
  const n = p?.nutriments ?? {};
  const kcal = n["energy-kcal_100g"] ?? (n["energy_100g"] ? n["energy_100g"] / 4.184 : null);
  if (kcal == null) return null;
  const r = (x: unknown) => (x == null || x === "" ? null : Math.round(Number(x) * 10) / 10);
  return { kcal: Math.round(kcal), p: r(n.proteins_100g), f: r(n.fat_100g), c: r(n.carbohydrates_100g),
    fib: r(n.fiber_100g), sugar: r(n.sugars_100g), salt: r(n.salt_100g) };
}
async function offByCode(code: string) {
  try {
    const r = await fetch(`${OFF}/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,nutriments,quantity,product_quantity`,
      { headers: { "User-Agent": "Essensspiegel/0.3 (github.com/michaelwartmann)" }, signal: AbortSignal.timeout(6000) });
    const d = await r.json();
    if (d?.status !== 1) return null;
    const per100 = offNutr(d.product);
    return per100 ? { name: d.product.product_name, brand: d.product.brands, per100, pack_g: Number(d.product.product_quantity) || null } : null;
  } catch { return null; }
}
// ---------- the eye: photo + words -> food lines ----------
const CATS = "veg, fruit, wholegrain, refined, potato, legume, dairy, egg, meat, procmeat, fish, nuts, fat, ready, sweets, snack, sugardrink, juice, alcohol, drink, other";
function prompt(mode: string, lang: string) {
  const L = lang === "en" ? "English" : "German (du-form)";
  const task = mode === "shop"
    ? "The person shows what they BOUGHT (a photo of groceries or a receipt, and/or a few words). List every food item with the total weight bought in grams (use the pack size; for a receipt read each line, ignore non-food items, deposits and prices)."
    : mode === "label"
    ? "The person shows the PACKAGING of one product (front, back, nutrition table or barcode). Read the exact nutrition values per 100 g from the table if visible, the product name, brand, pack size, and the barcode digits if readable. Return exactly one item; grams = pack size."
    : "The person shows or tells what they ATE (one meal or snack). List each component with the eaten amount in grams, as precisely as you can judge from plate size, cutlery, typical portions and their words.";
  return `You are the food-tracking companion of a calm, precise and kind assistant, like Lt. Commander Data: you look carefully, judge amounts precisely, ask only what you really need, never judge or advise. Your job is only to record what is there.

${task}

You get: maybe a photo, the person's words (speech-to-text, may contain small errors), the person's own food list (reuse an item's "id" in "my_id" when it is clearly the same food), and maybe the conversation so far with your current list. When the person corrects something, apply it and keep everything else.

Answer ONLY with JSON:
{"title": "short name of this meal or shopping, max 5 words, ${L}",
 "items": [{"name": "${L} name, plain (e.g. 'Mozzarella', 'Vollkornbrot', 'Tomaten')", "my_id": null, "grams": 125, "cat": "one of: ${CATS}",
   "per100": {"kcal": 0, "p": 0, "f": 0, "c": 0, "fib": 0, "sugar": 0, "salt": 0},
   "packaged": false, "brand": null, "barcode": null, "sure": true}],
 "question": "ONE short question in ${L} (max 14 words) or null",
 "done": false}

Rules:
- per100: realistic standard values per 100 g (German BLS-like) for that food as eaten. For drinks use 100 ml ≈ 100 g. Read the label when one is visible.
- Split dishes into their main components when visible (salad + dressing + bread); a known dish you can't split (lasagne) is one line.
- cat "wholegrain" only for real wholegrain products; white bread, rolls, white pasta/rice = "refined". "procmeat" = sausage, salami, ham, bacon; plant-based imitations count as "procmeat" too but set packaged true.
- packaged = true for every branded or processed product whose composition varies (vegan salami, a ready meal, a cereal brand), and always when a brand is named or visible; give the brand.
- sure = false where you are guessing an amount or what it is.
- question: usually null. Ask only when the answer would change an amount by more than about a third, or change the food group (white vs wholegrain, meat vs none) of a main component; e.g. "Hast du die ganze Kugel Mozzarella gegessen?". Never ask about varieties that barely matter (cow vs oat milk, fat level, type of cheese, chocolate type, toppings, sauces, spreads, dressings, cream). One question at a time, never two joined with "and/und". Never ask about something already asked or answered. After one answer, set question = null unless something major is still unknown. If everything is clear enough, question = null and done = true.
- Never comment on whether the food is healthy.`;
}
function parseLoose(raw: string) {
  let t = raw.replace(/^```(json)?/m, "").replace(/```\s*$/m, "");
  t = t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1);
  try { return JSON.parse(t); } catch { /* repair below */ }
  const fixed = t.replace(/\/\/[^\n"]*$/gm, "").replace(/,\s*([}\]])/g, "$1")
    .replace(/\bNone\b/g, "null").replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
  try { return JSON.parse(fixed); } catch (e) { throw new Error("JSON: " + (e as Error).message + " | " + t.slice(0, 300)); }
}
async function analyze(body: any) {
  const c = await cfg();
  const lang = body.lang === "en" ? "en" : "de";
  const mode = ["meal", "shop", "label"].includes(body.mode) ? body.mode : "meal";
  const mine = (body.my_foods ?? []).slice(0, 250).map((f: any) => `${f.id}: ${f.name}`).join("\n") || "(empty)";
  const turns = (body.turns ?? []).slice(-6).map((t: any) => `${t.role === "me" ? "You" : "Person"}: ${t.text}`).join("\n");
  const cur = body.items ? JSON.stringify(body.items.map((i: any) => ({ name: i.name, grams: i.grams, my_id: i.my_id ?? null }))) : "(none yet)";
  const meals = (body.my_meals ?? []).slice(0, 30).map((m: any) => `- ${m.title}: ${(m.parts ?? []).map((p: any) => `${p.name} ${p.g} g [${p.id}]`).join(", ")}`).join("\n") || "(none)";
  const text = `Person's food list:\n${mine}\n\nPerson's usual meals (when they say "again", "the same", "wie immer", reuse these amounts and ids):\n${meals}\n\nConversation so far:\n${turns || "(none)"}\n\nCurrent list:\n${cur}\n\nPerson says now:\n${String(body.text ?? "").trim() || "(nothing, only the photo)"}`;
  const content: unknown[] = [{ type: "text", text }];
  if (body.image_b64) content.unshift({ type: "image_url", image_url: { url: `data:${body.image_mime || "image/jpeg"};base64,${body.image_b64}` } });
  const ask = (model: string) => fetch(`${OR}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.openrouter_key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: 8000, temperature: 0.2, response_format: { type: "json_object" }, reasoning: { effort: "low" },
      provider: { data_collection: "deny" },
      messages: [{ role: "system", content: prompt(mode, lang) }, { role: "user", content }] }),
  });
  const run = async (model: string) => {
    const r = await ask(model);
    const d = await r.json();
    if (!r.ok) throw Object.assign(new Error("Auge: " + (d?.error?.message ?? r.status)), { status: r.status });
    await logCost("vision", d?.usage?.cost);
    return parseLoose(String(d.choices?.[0]?.message?.content ?? ""));
  };
  let out: any;
  try { out = await run(c.vision_model); }
  catch (e) { if (!c.vision_fallback) throw e; out = await run(c.vision_fallback); }
  const items = Array.isArray(out.items) ? out.items : [];
  await Promise.all(items.map(async (it: any) => {
    it.source = mode === "label" ? "label" : "ai";
    if (!it.barcode) return;
    // exact values only by barcode; a name search finds wrong products too often
    const hit = await offByCode(String(it.barcode).replace(/\D/g, ""));
    if (hit && !(mode === "label" && it.per100?.kcal)) { it.per100 = { ...it.per100, ...Object.fromEntries(Object.entries(hit.per100).filter(([, v]) => v != null)) }; it.source = "off"; it.off_name = [hit.brand, hit.name].filter(Boolean).join(" · "); }
  }));
  return { title: String(out.title ?? ""), items, question: out.question || null, done: !!out.done || !out.question };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    if (!(await okCode(req.headers.get("x-code") ?? body.code ?? null))) {
      await new Promise((r) => setTimeout(r, 800));
      return json({ error: "code" }, 401);
    }
    if (body.action === "auth") return json({ ok: true });
    const c = await cfg();
    if ((await spentToday()) > Number(c.daily_limit_usd || 1)) return json({ error: "limit" }, 429);
    switch (body.action) {
      case "transcribe": return json(await transcribe(String(body.audio_b64 ?? ""), String(body.mime ?? ""), body.lang));
      case "speak": return json(await speak(String(body.text ?? "")));
      case "analyze": return json(await analyze(body));
      case "barcode": return json({ hit: await offByCode(String(body.code_digits ?? "")) });
      default: return json({ error: "unknown action" }, 400);
    }
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
