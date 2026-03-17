import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ─── CONSTELLATION NODES ────────────────────────────────────────────────────
const STYLE_NODES = [
  // Dark / Punk cluster (top-left)
  { id: "dark",          x: 6,  y: 8  },
  { id: "grunge",        x: 4,  y: 18 },
  { id: "punk",          x: 12, y: 12 },
  { id: "rebellious",    x: 16, y: 22 },
  { id: "raw",           x: 6,  y: 35 },
  { id: "edgy",          x: 20, y: 16 },
  { id: "moody",         x: 14, y: 30 },
  { id: "subversive",    x: 22, y: 8  },
  { id: "irreverent",    x: 18, y: 42 },
  { id: "rock",          x: 10, y: 45 },
  { id: "stark",         x: 6,  y: 52 },
  { id: "undone",        x: 24, y: 38 },

  // Avant-garde / Conceptual cluster (top-center-left)
  { id: "avant-garde",   x: 28, y: 10 },
  { id: "architectural", x: 32, y: 4  },
  { id: "deconstructed", x: 38, y: 12 },
  { id: "sculptural",    x: 44, y: 6  },
  { id: "futuristic",    x: 36, y: 20 },
  { id: "brutalist",     x: 26, y: 22 },
  { id: "surreal",       x: 46, y: 14 },
  { id: "unexpected",    x: 40, y: 28 },
  { id: "dramatic",      x: 30, y: 32 },
  { id: "mysterious",    x: 22, y: 28 },

  // Glamorous / Maximalist cluster (top-center)
  { id: "maximalist",    x: 52, y: 8  },
  { id: "glamorous",     x: 58, y: 14 },
  { id: "opulent",       x: 50, y: 18 },
  { id: "embellished",   x: 60, y: 22 },
  { id: "baroque",       x: 64, y: 8  },
  { id: "ornate",        x: 66, y: 18 },
  { id: "disco",         x: 56, y: 28 },
  { id: "glam",          x: 62, y: 28 },
  { id: "loud",          x: 48, y: 26 },
  { id: "chromatic",     x: 44, y: 20 },
  { id: "vivid",         x: 48, y: 14 },
  { id: "colorful",      x: 54, y: 22 },

  // Romantic / Soft cluster (top-right)
  { id: "romantic",      x: 68, y: 8  },
  { id: "ethereal",      x: 72, y: 4  },
  { id: "dreamy",        x: 76, y: 12 },
  { id: "soft",          x: 70, y: 20 },
  { id: "fairy",         x: 80, y: 8  },
  { id: "delicate",      x: 86, y: 14 },
  { id: "feminine",      x: 76, y: 22 },
  { id: "pastel",        x: 88, y: 8  },
  { id: "whimsical",     x: 92, y: 16 },
  { id: "flowy",         x: 72, y: 28 },
  { id: "flirty",        x: 84, y: 22 },
  { id: "joyful",        x: 82, y: 30 },
  { id: "playful",       x: 68, y: 20 },
  { id: "bright",        x: 78, y: 20 },
  { id: "vibrant",       x: 66, y: 28 },

  // Luxe / Classic cluster (right)
  { id: "luxe",          x: 96, y: 10 },
  { id: "luxurious",     x: 94, y: 22 },
  { id: "elevated",      x: 98, y: 28 },
  { id: "discerning",    x: 96, y: 36 },
  { id: "elegant",       x: 92, y: 28 },
  { id: "chic",          x: 88, y: 36 },
  { id: "parisian",      x: 90, y: 44 },
  { id: "classic",       x: 94, y: 44 },
  { id: "polished",      x: 96, y: 52 },
  { id: "refined",       x: 90, y: 52 },
  { id: "sophisticated", x: 86, y: 44 },
  { id: "timeless",      x: 92, y: 58 },
  { id: "tailored",      x: 84, y: 38 },
  { id: "preppy",        x: 86, y: 30 },
  { id: "ballet",        x: 80, y: 36 },

  // Structured / Academic cluster (center)
  { id: "structured",    x: 48, y: 36 },
  { id: "academic",      x: 32, y: 44 },
  { id: "academia",      x: 36, y: 52 },
  { id: "studied",       x: 42, y: 44 },
  { id: "intentional",   x: 50, y: 30 },
  { id: "curated",       x: 46, y: 54 },
  { id: "layered",       x: 36, y: 58 },
  { id: "textured",      x: 28, y: 52 },
  { id: "clever",        x: 44, y: 50 },
  { id: "balanced",      x: 40, y: 60 },
  { id: "thoughtful",    x: 30, y: 62 },
  { id: "smart",         x: 38, y: 68 },
  { id: "modern",        x: 48, y: 62 },
  { id: "contemporary",  x: 54, y: 52 },
  { id: "fitted",        x: 52, y: 46 },
  { id: "androgynous",   x: 38, y: 36 },
  { id: "eclectic",      x: 54, y: 36 },
  { id: "nostalgic",     x: 58, y: 34 },

  // Sensual / Bold cluster (center-right)
  { id: "sensual",       x: 74, y: 42 },
  { id: "sexy",          x: 76, y: 50 },
  { id: "bold",          x: 68, y: 36 },
  { id: "striking",      x: 74, y: 58 },
  { id: "confident",     x: 80, y: 58 },
  { id: "powerful",      x: 78, y: 68 },
  { id: "masculine",     x: 82, y: 68 },
  { id: "adventurous",   x: 76, y: 76 },
  { id: "tomboy",        x: 68, y: 52 },

  // Vintage / Retro cluster (center)
  { id: "vintage",       x: 56, y: 44 },
  { id: "retro",         x: 50, y: 68 },
  { id: "mod",           x: 60, y: 52 },
  { id: "antique",       x: 56, y: 60 },
  { id: "wabi-sabi",     x: 42, y: 84 },

  // Minimal / Clean cluster (left-center)
  { id: "minimal",       x: 14, y: 60 },
  { id: "editorial",     x: 20, y: 52 },
  { id: "clean",         x: 8,  y: 62 },
  { id: "spare",         x: 6,  y: 72 },
  { id: "understated",   x: 18, y: 68 },
  { id: "neutral",       x: 10, y: 76 },
  { id: "muted",         x: 20, y: 76 },
  { id: "quiet",         x: 8,  y: 82 },
  { id: "subtle",        x: 16, y: 82 },
  { id: "simple",        x: 4,  y: 88 },
  { id: "monochromatic", x: 24, y: 68 },
  { id: "sleek",         x: 28, y: 72 },
  { id: "streamlined",   x: 26, y: 78 },
  { id: "sharp",         x: 22, y: 60 },
  { id: "fluid",         x: 32, y: 78 },
  { id: "draped",        x: 34, y: 84 },
  { id: "modest",        x: 12, y: 88 },
  { id: "zen",           x: 12, y: 70 },

  // Streetwear / Urban cluster (center-bottom)
  { id: "streetwear",    x: 54, y: 76 },
  { id: "urban",         x: 48, y: 76 },
  { id: "indie",         x: 60, y: 68 },
  { id: "skater",        x: 64, y: 76 },
  { id: "artsy",         x: 56, y: 86 },
  { id: "creative",      x: 48, y: 86 },
  { id: "alternative",   x: 42, y: 76 },
  { id: "funky",         x: 66, y: 68 },
  { id: "quirky",        x: 64, y: 84 },
  { id: "fun",           x: 58, y: 90 },
  { id: "artistic",      x: 52, y: 92 },
  { id: "global",        x: 44, y: 92 },

  // Sporty / Utility cluster (right-center)
  { id: "sporty",        x: 86, y: 62 },
  { id: "athleisure",    x: 90, y: 70 },
  { id: "oversized",     x: 72, y: 72 },
  { id: "workwear",      x: 80, y: 72 },
  { id: "utility",       x: 84, y: 78 },

  // Coastal / Tropical cluster (far-right)
  { id: "coastal",       x: 92, y: 62 },
  { id: "tropical",      x: 96, y: 60 },
  { id: "surf",          x: 96, y: 68 },
  { id: "nautical",      x: 96, y: 44 },
  { id: "nordic",        x: 96, y: 36 },
  { id: "equestrian",    x: 92, y: 68 },
  { id: "western",       x: 96, y: 78 },

  // Casual / Relaxed cluster (right-bottom)
  { id: "casual",        x: 84, y: 86 },
  { id: "relaxed",       x: 78, y: 86 },
  { id: "comfortable",   x: 90, y: 86 },
  { id: "laidback",      x: 80, y: 92 },
  { id: "effortless",    x: 88, y: 82 },
  { id: "carefree",      x: 72, y: 86 },
  { id: "cool",          x: 70, y: 80 },
  { id: "ease",          x: 86, y: 92 },
  { id: "cozy",          x: 92, y: 92 },
  { id: "warm",          x: 80, y: 98 },
  { id: "calm",          x: 74, y: 92 },
  { id: "harmonious",    x: 70, y: 94 },

  // Bohemian / Natural cluster (left-bottom)
  { id: "bohemian",      x: 26, y: 94 },
  { id: "earthy",        x: 10, y: 94 },
  { id: "organic",       x: 18, y: 96 },
  { id: "natural",       x: 6,  y: 92 },
  { id: "outdoorsy",     x: 22, y: 98 },
  { id: "forest",        x: 34, y: 94 },
  { id: "grounded",      x: 38, y: 86 },
  { id: "folksy",        x: 44, y: 96 },
  { id: "cottagecore",   x: 30, y: 88 },
  { id: "sensible",      x: 26, y: 86 },
  { id: "practical",     x: 18, y: 86 },
];

const NODE_IDS = STYLE_NODES.map(n => n.id);
const NODE_MAP = Object.fromEntries(STYLE_NODES.map(n => [n.id, n]));

// ─── STYLES ─────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@300;400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #fff; overflow-x: hidden; }
    .app { font-family: 'DM Mono', monospace; background: #0a0a0a; color: #fff; min-height: 100vh; padding-bottom: env(safe-area-inset-bottom); }
    .page { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    input, textarea, button { font-family: 'DM Mono', monospace; }
    input:focus, textarea:focus { outline: none; }
    input::placeholder, textarea::placeholder { color: #666; }
    button { cursor: pointer; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    input, textarea { -webkit-tap-highlight-color: transparent; }

    @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes wordReveal{ from { opacity:0; transform:translateY(24px) skewY(2deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes spin      { to { transform:rotate(360deg); } }
    @keyframes lineIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes lineExpand{ from { width:0; opacity:0; } to { width:72px; opacity:1; } }
    @keyframes introWord { from { opacity:0; transform:translateY(10px) skewY(1deg); } to { opacity:1; transform:translateY(0) skewY(0); } }
    @keyframes subtleFade{ from { opacity:0; } to { opacity:0.38; } }
    @keyframes blink     { 0%,100% { opacity:1; } 50% { opacity:0; } }

    .fade-up    { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
    .word-reveal{ animation: wordReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards; opacity:0; }
    .fade-in    { animation: fadeIn 0.5s ease forwards; }
    .spinner    { animation: spin 0.8s linear infinite; }

    /* ── Site nav ── */
    .site-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 0;
      border-bottom: 1px solid #161616;
    }

    /* ── Home hero ── */
    .home-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-height: calc(100vh - 82px);
      justify-content: center;
      padding: 64px 0 80px;
    }
    @media (min-width: 860px) {
      .page { padding: 0 72px; }
      .home-hero { padding: 80px 0; }
    }

    /* ── Generating ── */
    .generating-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 60px 0;
    }

    /* ── Constellation container ── */
    .constellation-wrap {
      width: 100%;
      aspect-ratio: 1;
    }
    @media (min-width: 860px) {
      .results-right {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .constellation-wrap {
        aspect-ratio: unset;
        width: 100%;
        height: 100%;
        min-height: 400px;
      }
    }

    ::-webkit-scrollbar { width: 0; }
    input[type="text"], input[type="email"] { -webkit-appearance:none; border-radius:0; }
    textarea { -webkit-appearance:none; border-radius:0; }
  `}</style>
);

// ─── SHARED STYLES ───────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #2a2a2a",
  padding: "12px 0",
  fontSize: 16,
  background: "transparent",
  color: "#fff",
  letterSpacing: "0.02em",
};

const btnStyle = {
  background: "#fff",
  color: "#0a0a0a",
  border: "none",
  padding: "14px 28px",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-block",
};

const ghostBtnStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #2a2a2a",
  padding: "14px 28px",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-block",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const resizeImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.82).split(",")[1]);
    };
    img.src = URL.createObjectURL(file);
  });

// Fallback: 17 nearest nodes when Claude doesn't return relevant words
const getDefaultRelevant = (words) => {
  const hNodes = STYLE_NODES.filter(n => words.includes(n.id));
  if (hNodes.length === 0) return words;
  const others = STYLE_NODES
    .filter(n => !words.includes(n.id))
    .map(n => ({ ...n, d: Math.min(...hNodes.map(h => Math.hypot(n.x - h.x, n.y - h.y))) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 17);
  return [...words, ...others.map(n => n.id)];
};

// ─── CLAUDE: GENERATE THIS-OR-THAT QUESTIONS ─────────────────────────────────
const generateThisThatQuestions = async (photos, description) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const content = [];
  for (const photo of photos) {
    if (photo) {
      content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: photo } });
    }
  }
  const textPrompt = description
    ? `Here are my outfit photos. Style notes: "${description}". Generate 3 this-or-that questions based on my style.`
    : "Here are my outfit photos. Generate 3 this-or-that questions based on my style.";
  content.push({ type: "text", text: textPrompt });

  const system = `You are a style analyst. Based on the user's outfit photos, generate 3 "this or that" style questions to map their taste.

Each question names a specific real-world situation and presents two contrasting outfit options (A and B). The options should reflect genuinely different aesthetics — different silhouettes, fabrics, and moods — inspired by what you can observe from their photos.

Keep outfit descriptions concise but specific: mention 2-3 key pieces or details (e.g. "oversized vintage blazer, straight-leg jeans, white sneakers" vs "fitted silk top, tailored trousers, kitten heels").

The three situations MUST be clearly distinct from each other — vary the type of event (e.g. social outing, formal occasion, casual errand), the season or weather (e.g. summer heat, cold winter day, transitional fall), and the energy level (e.g. low-key vs. dressed up). Do not generate three situations that are all similar in vibe or formality. For example, do NOT use three casual daytime outings — mix it up with something like a hot summer errand run, a winter dinner party, and a night out.

Return ONLY valid JSON in this exact format, no other text:
{"questions":[
  {"situation":"...","optionA":"...","optionB":"..."},
  {"situation":"...","optionA":"...","optionB":"..."},
  {"situation":"...","optionA":"...","optionB":"..."}
]}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system,
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = data.content[0].text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.questions) || parsed.questions.length !== 3) return null;
    return parsed.questions;
  } catch {
    return null;
  }
};

// ─── CLAUDE: GENERATE STYLE WORDS ────────────────────────────────────────────
const generateStyleWords = async (photos, description, thisThatQuestions, thisThatAnswers, lookingFor) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const content = [];
  for (const photo of photos) {
    if (photo) {
      content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: photo } });
    }
  }

  let contextText = "";
  if (description) contextText += `Style notes: ${description}\n\n`;
  if (thisThatQuestions && thisThatAnswers) {
    contextText += "This-or-that answers:\n";
    thisThatQuestions.forEach((q, i) => {
      const answer = thisThatAnswers[i];
      if (answer) {
        const chosen = answer === "A" ? q.optionA : q.optionB;
        contextText += `- In "${q.situation}": chose "${chosen}"\n`;
      }
    });
    contextText += "\n";
  }
  if (lookingFor && lookingFor.trim()) {
    contextText += `Currently looking for: ${lookingFor.trim()}`;
  }

  content.push({ type: "text", text: contextText || "Analyze the aesthetic in these images." });

  const system = `You are a style analyst. Given a user's outfit photos, style answers, and preferences, analyze their aesthetic and return a JSON object.

Style word list — you MUST only choose from this exact list: ${NODE_IDS.join(", ")}

Return ONLY a valid JSON object in exactly this format:
{"words":["word1","word2","word3"],"relevant":["word1","word2","word3","word4","word5","word6","word7","word8","word9","word10","word11","word12","word13","word14","word15","word16","word17","word18","word19","word20"],"archetype":"The X Y","subtitle":"One punchy sentence about their style.","percentages":[45,32,23]}

Rules:
- "words": exactly 3 words from the provided list that BEST define their core aesthetic
- "relevant": exactly 20 words total — include all 3 from "words", plus 17 more that paint a picture of the full aesthetic landscape. Spread across diverse corners of the style universe. All 20 must come from the provided list.
- "archetype": a 2-4 word label starting with "The" (e.g. "The Dark Romantic", "The Quiet Minimalist"). Should feel like a real style identity.
- "subtitle": a short, punchy one-liner (10-15 words) based on their actual answers — concrete and specific, not vague. E.g. "Always dressed for a gallery opening you're 20 minutes late to."
- "percentages": 3 integers in the same order as "words" that sum to exactly 100. Weight them meaningfully — the dominant aesthetic gets the most.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system,
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = data.content[0].text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    const validSet = new Set(NODE_IDS);
    const words = (parsed.words || [])
      .map(w => String(w).toLowerCase())
      .filter(w => validSet.has(w))
      .slice(0, 3);
    if (words.length !== 3) return null;
    const relevant = [...new Set(
      (parsed.relevant || [])
        .map(w => String(w).toLowerCase())
        .filter(w => validSet.has(w))
    )].slice(0, 20);
    const relevantWithWords = [...new Set([...words, ...relevant])].slice(0, 20);
    const archetype = typeof parsed.archetype === "string" ? parsed.archetype.trim() : "The Style Explorer";
    const subtitle = typeof parsed.subtitle === "string" ? parsed.subtitle.trim() : "";
    const rawPct = Array.isArray(parsed.percentages) ? parsed.percentages.map(Number) : [];
    const percentages = rawPct.length === 3 && rawPct.every(n => !isNaN(n)) ? rawPct : [50, 30, 20];
    return { words, relevant: relevantWithWords, archetype, subtitle, percentages };
  } catch {
    return null;
  }
};

// ─── CONSTELLATION ────────────────────────────────────────────────────────────
// viewBox is 0 0 100 100 — node x/y map directly to SVG coordinates
const Constellation = ({ highlightedWords, relevantWords }) => {
  const highlighted = new Set(highlightedWords || []);
  const relevant = new Set(relevantWords || []);

  let visibleNodes;
  if (relevant.size > 0) {
    visibleNodes = STYLE_NODES.filter(n => relevant.has(n.id));
  } else if (highlighted.size > 0) {
    const hNodes = STYLE_NODES.filter(n => highlighted.has(n.id));
    const others = STYLE_NODES
      .filter(n => !highlighted.has(n.id))
      .map(n => ({ ...n, d: Math.min(...hNodes.map(h => Math.hypot(n.x - h.x, n.y - h.y))) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 17);
    visibleNodes = [...hNodes, ...others];
  } else {
    visibleNodes = STYLE_NODES;
  }

  const hNodes = STYLE_NODES.filter(n => highlighted.has(n.id));
  const showLabels = highlighted.size > 0 && relevant.size > 0;

  const getLabelProps = (node) => {
    const onRight = node.x > 58;
    const onTop   = node.y < 12;
    const onBot   = node.y > 88;
    const textAnchor = onRight ? "end" : "start";
    const dx = onRight ? -2.2 : 2.2;
    const dy = onTop ? 4 : onBot ? -3.5 : -2.2;
    return { dx, dy, textAnchor };
  };

  const renderConnections = () => {
    if (hNodes.length !== 3) return null;
    const [a, b, c] = hNodes;
    const pairs = [[a, b], [b, c], [a, c]];
    return pairs.map(([p1, p2], i) => (
      <line
        key={i}
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke="#fff"
        strokeWidth="0.25"
        strokeDasharray="2.5 2"
        opacity="0.35"
      />
    ));
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
    >
      {renderConnections()}
      {visibleNodes.map((node) => {
        const isH = highlighted.has(node.id);
        const showAll = relevant.size === 0;
        const r = isH ? 1.3 : showLabels ? 0.6 : showAll ? 0.3 : 0.5;
        const fill = isH ? "#fff" : showLabels ? "#777" : "#555";
        const { dx, dy, textAnchor } = getLabelProps(node);

        return (
          <g key={node.id}>
            {isH && (
              <circle
                cx={node.x} cy={node.y} r={5}
                fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.18"
              />
            )}
            <circle cx={node.x} cy={node.y} r={r} fill={fill} />
            {showLabels && (
              <text
                x={node.x + dx}
                y={node.y + dy}
                textAnchor={textAnchor}
                fontSize="1.85"
                fontFamily="DM Mono, monospace"
                fill={isH ? "#fff" : "#777"}
                fontWeight={isH ? "400" : "300"}
                letterSpacing="0.03em"
              >
                {node.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ─── ANIMATED CONSTELLATION ───────────────────────────────────────────────────
const AnimatedConstellation = ({ fullScreen = false }) => {
  const [scanStep, setScanStep] = useState(0);
  const [lines, setLines]       = useState([]);

  useEffect(() => {
    const t = setInterval(() => setScanStep(s => s + 1), 300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const genLines = () => {
      const used = new Set();
      const next = [];
      const count = 6 + Math.floor(Math.random() * 5);
      let attempts = 0;
      while (next.length < count && attempts < 80) {
        attempts++;
        const a = Math.floor(Math.random() * STYLE_NODES.length);
        const b = Math.floor(Math.random() * STYLE_NODES.length);
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        if (a !== b && !used.has(key)) {
          used.add(key);
          next.push({ uid: `${key}-${Date.now()}`, a, b });
        }
      }
      setLines(next);
    };
    genLines();
    const t = setInterval(genLines, 1400);
    return () => clearInterval(t);
  }, []);

  const W = 560, H = 400;
  const cx = (x) => (x / 100) * W;
  const cy = (y) => (y / 100) * H;
  const n  = STYLE_NODES.length;

  const glowIds = new Set([
    STYLE_NODES[scanStep % n].id,
    STYLE_NODES[(scanStep + 8)  % n].id,
    STYLE_NODES[(scanStep + 16) % n].id,
  ]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fullScreen ? "xMidYMid slice" : "xMidYMid meet"}
      style={{
        width: "100%",
        height: fullScreen ? "100%" : "auto",
        maxWidth: fullScreen ? "none" : 560,
        display: "block",
      }}
    >
      {lines.map(({ uid, a, b }) => (
        <line
          key={uid}
          x1={cx(STYLE_NODES[a].x)} y1={cy(STYLE_NODES[a].y)}
          x2={cx(STYLE_NODES[b].x)} y2={cy(STYLE_NODES[b].y)}
          stroke="#fff"
          strokeWidth="0.5"
          opacity="0.22"
          style={{ animation: "lineIn 0.9s ease forwards" }}
        />
      ))}
      {STYLE_NODES.map((node) => {
        const isGlow = glowIds.has(node.id);
        const nx     = cx(node.x);
        const ny     = cy(node.y);
        return (
          <g key={node.id} style={{ transition: "opacity 0.3s" }}>
            {isGlow && (
              <>
                <circle cx={nx} cy={ny} r={20} fill="none" stroke="#fff" strokeWidth="0.4" opacity="0.07" />
                <circle cx={nx} cy={ny} r={11} fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.13" />
              </>
            )}
            <circle
              cx={nx} cy={ny}
              r={isGlow ? 4 : 1.5}
              fill={isGlow ? "#fff" : "#777"}
              style={{ transition: "fill 0.35s ease" }}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ─── SHARE CARD ──────────────────────────────────────────────────────────────
const createShareCard = async (words, relevant, archetype, percentages, userName) => {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  await Promise.all([
    document.fonts.load('italic 400 85px "Playfair Display"'),
    document.fonts.load('400 50px "DM Mono"'),
    document.fonts.load('300 29px "DM Mono"'),
  ]);

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  const PAD = 70;
  const INNER_W = W - PAD * 2;
  let y = 62;

  const thinDash = (yPos) => {
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(PAD, yPos);
    ctx.lineTo(W - PAD, yPos);
    ctx.strokeStyle = "#252525";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // ── HEADER ROW ────────────────────────────────────────────────
  ctx.font = '300 29px "DM Mono", monospace';
  ctx.fillStyle = "#666";
  ctx.textAlign = "left";
  ctx.fillText("TASTE PROFILE", PAD, y);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".");
  ctx.fillStyle = "#555";
  ctx.font = '300 27px "DM Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(dateStr, W - PAD, y);
  ctx.textAlign = "left";
  y += 38;

  thinDash(y); y += 110;

  // ── ARCHETYPE ─────────────────────────────────────────────────
  ctx.fillStyle = "#fff";
  ctx.font = 'italic 400 85px "Playfair Display", serif';
  const archetypeText = archetype || "The Style Explorer";
  const archetypeWords = archetypeText.split(" ");
  let line = "";
  const archetypeLines = [];
  for (const word of archetypeWords) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > INNER_W && line) { archetypeLines.push(line); line = word; }
    else line = test;
  }
  if (line) archetypeLines.push(line);
  for (const l of archetypeLines) { ctx.fillText(l, PAD, y); y += 90; }
  y += 12;

  thinDash(y); y += 38;

  // ── STYLE BREAKDOWN ───────────────────────────────────────────
  const firstName = (userName || "your").split(" ")[0].toLowerCase();
  ctx.fillStyle = "#666";
  ctx.font = '300 29px "DM Mono", monospace';
  ctx.fillText(`${firstName}'s style is:`.toUpperCase(), PAD, y);
  y += 70;

  const wordSizes = [50, 42, 37];
  const pctSizes  = [42, 37, 33];
  words.forEach((word, i) => {
    ctx.font = `400 ${wordSizes[i]}px "DM Mono", monospace`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(word.toUpperCase(), PAD, y);

    ctx.font = `300 ${pctSizes[i]}px "DM Mono", monospace`;
    ctx.fillStyle = "#777";
    ctx.textAlign = "right";
    ctx.fillText(`${percentages?.[i] ?? [50, 30, 20][i]}%`, W - PAD, y);
    ctx.textAlign = "left";

    if (i < 2) y += wordSizes[i] + 19;
    else        y += wordSizes[i];
  });

  y += 39;
  thinDash(y); y += 31;

  // ── CONSTELLATION ─────────────────────────────────────────────
  const FOOTER_H = 27 + 31 + 54; // text + marginTop + padBottom
  const cRegionH = H - y - FOOTER_H;
  const side = Math.min(INNER_W, cRegionH);
  const offX = PAD + (INNER_W - side) / 2;
  const offY = y + (cRegionH - side) / 2;
  const cx = (px) => offX + (px / 100) * side;
  const cy = (py) => offY + (py / 100) * side;

  const relevantIds = relevant && relevant.length > 0 ? relevant : getDefaultRelevant(words);
  const highlighted = new Set(words);
  const visibleNodes = STYLE_NODES.filter(n => relevantIds.includes(n.id));
  const hNodes = visibleNodes.filter(n => highlighted.has(n.id));

  // Connections between highlighted nodes (matches SVG: strokeWidth 0.25, dasharray "2.5 2", opacity 0.35)
  if (hNodes.length >= 2) {
    const pairs = hNodes.flatMap((n, i) => hNodes.slice(i + 1).map(m => [n, m]));
    pairs.forEach(([p1, p2]) => {
      ctx.beginPath();
      ctx.moveTo(cx(p1.x), cy(p1.y));
      ctx.lineTo(cx(p2.x), cy(p2.y));
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = (0.25 / 100) * side;
      ctx.setLineDash([(2.5 / 100) * side, (2 / 100) * side]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  // Nodes (matches SVG: r=1.3 highlighted, r=0.6 others, outer ring r=5 opacity 0.18)
  visibleNodes.forEach(node => {
    const isH = highlighted.has(node.id);
    const nx = cx(node.x), ny = cy(node.y);

    if (isH) {
      ctx.beginPath();
      ctx.arc(nx, ny, (5 / 100) * side, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = (0.3 / 100) * side;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(nx, ny, (isH ? 1.3 : 0.6) / 100 * side, 0, Math.PI * 2);
    ctx.fillStyle = isH ? "#fff" : "#777";
    ctx.fill();

    // Labels (matches SVG: fontSize 1.85, dx ±2.2, dy -2.2/-3.5/4)
    const onRight = node.x > 58;
    const onTop   = node.y < 12;
    const onBot   = node.y > 88;
    const ldx = (onRight ? -2.2 : 2.2) / 100 * side;
    const ldy = (onTop ? 4 : onBot ? -3.5 : -2.2) / 100 * side;
    ctx.fillStyle = isH ? "#fff" : "#777";
    ctx.font = `${isH ? "400" : "300"} ${Math.round((1.85 / 100) * side)}px "DM Mono", monospace`;
    ctx.textAlign = onRight ? "right" : "left";
    ctx.fillText(node.id, nx + ldx, ny + ldy);
  });
  ctx.textAlign = "left";

  // ── FOOTER ────────────────────────────────────────────────────
  ctx.fillStyle = "#555";
  ctx.font = '300 27px "DM Mono", monospace';
  ctx.textAlign = "center";
  ctx.fillText("TAKETHETASTETEST.COM", W / 2, H - 54);
  ctx.textAlign = "left";

  return canvas;
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Steps: home → upload → questions → signup → generating → results
  const [step, setStep]                           = useState("home");
  const [name, setName]                           = useState("");
  const [email, setEmail]                         = useState("");
  const [phone, setPhone]                         = useState("");
  const [description, setDescription]             = useState("");
  const [photos, setPhotos]                       = useState([null, null, null]);
  const [photoPreviews, setPhotoPreviews]         = useState([null, null, null]);
  const [thisThatQuestions, setThisThatQuestions] = useState(null);
  const [thisThatAnswers, setThisThatAnswers]     = useState({});
  const [lookingFor, setLookingFor]               = useState("");
  const [questionsLoading, setQuestionsLoading]   = useState(false);
  const [styleWords, setStyleWords]               = useState([]);
  const [relevantWords, setRelevantWords]         = useState([]);
  const [archetype, setArchetype]                 = useState("");
  const [subtitle, setSubtitle]                   = useState("");
  const [stylePercentages, setStylePercentages]   = useState([]);
  const [error, setError]                         = useState("");
  const [emailError, setEmailError]               = useState("");
  const [sharing, setSharing]                     = useState(false);
  const [signupId, setSignupId]                   = useState(null);
  const [typed, setTyped]                         = useState("");
  const [heroReady, setHeroReady]                 = useState(false);

  const fileRef0 = useRef(null);
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const fileRefs = [fileRef0, fileRef1, fileRef2];

  const HERO_TEXT = "let your taste precede you";

  useEffect(() => {
    if (step !== "home") return;
    if (typed.length < HERO_TEXT.length) {
      const t = setTimeout(() => setTyped(HERO_TEXT.slice(0, typed.length + 1)), 78);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroReady(true), 350);
      return () => clearTimeout(t);
    }
  }, [step, typed]);

  const handleShare = async () => {
    setSharing(true);
    try {
      const canvas = await createShareCard(styleWords, relevantWords, archetype, stylePercentages, name);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      const file = new File([blob], "my-taste.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: archetype, text: `My taste profile is ${archetype}. Get yours at takethetastetest.com` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "my-taste.png"; a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // user cancelled or share failed — no-op
    } finally {
      setSharing(false);
    }
  };

  const handlePhotoUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const resized = await resizeImage(file);
    setPhotoPreviews(prev => { const next = [...prev]; next[index] = preview; return next; });
    setPhotos(prev => { const next = [...prev]; next[index] = resized; return next; });
  };

  const handleQuestionsNext = (e) => {
    e.preventDefault();
    const answeredCount = Object.keys(thisThatAnswers).length;
    if (thisThatQuestions && answeredCount < thisThatQuestions.length) {
      setError("please answer all questions to continue");
      return;
    }
    setError("");
    setStep("signup");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setEmailError("please enter your name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("please enter a valid email"); return; }
    if (!phone.trim()) { setEmailError("please enter your phone number"); return; }
    if (!/^\+?[\d\s\-().]{7,15}$/.test(phone.trim())) { setEmailError("please enter a valid phone number"); return; }
    setEmailError("");

    const submissionId = crypto.randomUUID();
    setSignupId(submissionId);

    let photoUrls = [];
    if (supabase) {
      const validPhotos = photos.filter(Boolean);
      const uploads = await Promise.all(
        validPhotos.map(async (b64, i) => {
          const blob = await fetch(`data:image/jpeg;base64,${b64}`).then(r => r.blob());
          const path = `${submissionId}/photo_${i + 1}.jpg`;
          const { error: uploadErr } = await supabase.storage.from("outfit-photos").upload(path, blob, { contentType: "image/jpeg" });
          if (uploadErr) { console.error("photo upload error:", uploadErr.message); return null; }
          return supabase.storage.from("outfit-photos").getPublicUrl(path).data.publicUrl;
        })
      );
      photoUrls = uploads.filter(Boolean);
    }

    setStep("generating");

    const validPhotos = photos.filter(Boolean);
    const [result] = await Promise.all([
      generateStyleWords(validPhotos, description, thisThatQuestions, thisThatAnswers, lookingFor),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]);
    const finalWords       = result?.words       || ["minimal", "editorial", "dark"];
    const finalRelevant    = result?.relevant    || getDefaultRelevant(finalWords);
    const finalArchetype   = result?.archetype   || "The Style Explorer";
    const finalSubtitle    = result?.subtitle    || "";
    const finalPercentages = result?.percentages || [50, 30, 20];
    setStyleWords(finalWords);
    setRelevantWords(finalRelevant);
    setArchetype(finalArchetype);
    setSubtitle(finalSubtitle);
    setStylePercentages(finalPercentages);

    if (supabase) {
      const formatQuestion = (q) =>
        `at ${q.situation}... ${q.optionA} OR ${q.optionB}`;

      const { error: err } = await supabase.from("submissions").insert({
        id: submissionId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        description: description.trim(),
        question_1: thisThatQuestions?.[0] ? formatQuestion(thisThatQuestions[0]) : null,
        answer_1: thisThatAnswers[0] === "A" ? thisThatQuestions?.[0]?.optionA : thisThatQuestions?.[0]?.optionB,
        question_2: thisThatQuestions?.[1] ? formatQuestion(thisThatQuestions[1]) : null,
        answer_2: thisThatAnswers[1] === "A" ? thisThatQuestions?.[1]?.optionA : thisThatQuestions?.[1]?.optionB,
        question_3: thisThatQuestions?.[2] ? formatQuestion(thisThatQuestions[2]) : null,
        answer_3: thisThatAnswers[2] === "A" ? thisThatQuestions?.[2]?.optionA : thisThatQuestions?.[2]?.optionB,
        style_words: finalWords,
        archetype: finalArchetype,
        looking_for: lookingFor.trim() || null,
        photo_urls: photoUrls.length > 0 ? photoUrls : null,
      });
      if (err) console.error("Supabase submissions error:", err.message);
    }

    setStep("results");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const uploadedCount = photos.filter(Boolean).length;
    if (uploadedCount < 2) { setError("please upload at least 2 photos to continue"); return; }
    setError("");
    setQuestionsLoading(true);
    setStep("questions");

    const validPhotos = photos.filter(Boolean);
    const questions = await generateThisThatQuestions(validPhotos, description);
    setThisThatQuestions(questions || getFallbackQuestions());
    setQuestionsLoading(false);
  };

  const getFallbackQuestions = () => [
    {
      situation: "a casual Saturday running errands",
      optionA: "vintage graphic tee, wide-leg jeans, chunky sneakers",
      optionB: "fitted ribbed tank, straight-leg trousers, ballet flats",
    },
    {
      situation: "dinner with friends at a nice restaurant",
      optionA: "sleek slip dress, minimal jewelry, strappy heels",
      optionB: "oversized blazer, tailored shorts, loafers",
    },
    {
      situation: "a Sunday morning at a coffee shop",
      optionA: "cozy knit sweater, loose linen pants, clogs",
      optionB: "crisp button-down, dark jeans, clean white sneakers",
    },
  ];

  const handleAnswer = (questionIndex, answer) => {
    setThisThatAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };


  const backBtn = (target) => (
    <button
      onClick={() => setStep(target)}
      style={{
        position: "absolute",
        top: 28,
        left: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#aaa",
        fontSize: 20,
        padding: 0,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      aria-label="go back"
    >
      ←
    </button>
  );

  return (
    <>
      <GlobalStyles />
      <div className="app">
        <div className="page">

          {/* ── HOME ─────────────────────────────────────────────────────── */}
          {step === "home" && (
            <div className="fade-up">
              <nav className="site-nav">
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 22,
                  letterSpacing: "-0.02em",
                }}>
                  tastetest
                </span>
                <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "#777", textTransform: "uppercase" }}>
                  early access
                </span>
              </nav>

              <div className="home-hero">
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(42px, 5.5vw, 80px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: 28,
                }}>
                  {typed}
                  {!heroReady && (
                    <span style={{
                      display: "inline-block",
                      width: 3,
                      height: "0.85em",
                      background: "#fff",
                      marginLeft: 4,
                      verticalAlign: "middle",
                      animation: "blink 1s step-end infinite",
                    }} />
                  )}
                </h1>

                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, marginBottom: 44, maxWidth: 480, letterSpacing: "0.02em", opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0s both" : "none" }}>
                  what if you didn't have to spend hours digging through search results, social media posts, and brand websites to find a piece that fits your style?
                </p>
                <button onClick={() => setStep("upload")} style={{ ...btnStyle, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s both" : "none" }}>
                  take the taste test →
                </button>
                <p style={{ fontSize: 11, color: "#777", marginTop: 16, letterSpacing: "0.04em", lineHeight: 1.6, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.32s both" : "none" }}>
                  take the test to get your taste profile today <br /> and to get early access when we launch
                </p>
              </div>
            </div>
          )}

          {/* ── SIGNUP ───────────────────────────────────────────────────── */}
          {step === "signup" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("questions")}
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.2,
                marginBottom: 14,
                letterSpacing: "-0.01em",
                textAlign: "center",
              }}>
                unlock your results.
              </h2>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.8, marginBottom: 40, maxWidth: 380, letterSpacing: "0.02em", textAlign: "center" }}>
                enter your info to reveal your taste profile and get early access when we launch
              </p>
              <form onSubmit={handleSignup} style={{ width: "100%", maxWidth: 400 }}>
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    placeholder="your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                    autoComplete="name"
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="email"
                    placeholder="your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    autoComplete="email"
                  />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <input
                    type="tel"
                    placeholder="your phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle}
                    autoComplete="tel"
                  />
                </div>
                {emailError && <p style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>{emailError}</p>}
                <button type="submit" style={{ ...btnStyle, width: "100%", textAlign: "center" }}>
                  reveal my taste →
                </button>
              </form>
            </div>
          )}

          {/* ── UPLOAD ───────────────────────────────────────────────────── */}
          {step === "upload" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("home")}
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.2,
                marginBottom: 10,
                letterSpacing: "-0.01em",
                textAlign: "center",
              }}>
                show us your style.
              </h2>
              <p style={{ fontSize: 11, color: "#aaa", marginBottom: 36, letterSpacing: "0.04em", lineHeight: 1.6, textAlign: "center" }}>
                upload 2–3 photos of your favorite outfits
              </p>

              <form onSubmit={handleUpload} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>

                {/* Photo slots */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", marginBottom: 20 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div
                        onClick={() => fileRefs[i].current?.click()}
                        style={{
                          border: "1px dashed #2a2a2a",
                          cursor: "pointer",
                          overflow: "hidden",
                          aspectRatio: "3 / 4",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          background: photoPreviews[i] ? "transparent" : "#0f0f0f",
                        }}
                      >
                        {photoPreviews[i] ? (
                          <img
                            src={photoPreviews[i]}
                            alt={`outfit ${i + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <span style={{ fontSize: 20, color: "#555", lineHeight: 1 }}>+</span>
                        )}
                      </div>
                      <p style={{ fontSize: 9, color: "#666", letterSpacing: "0.08em", textAlign: "center", textTransform: "uppercase" }}>
                        {i === 2 ? "optional" : "required"}
                      </p>
                      <input
                        ref={fileRefs[i]}
                        type="file"
                        accept="image/*"
                        onChange={e => handlePhotoUpload(e, i)}
                        style={{ display: "none" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Optional description */}
                <textarea
                  placeholder="add more about your style (optional) — vibes, references, what you gravitate toward..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.7, paddingTop: 12, width: "100%", marginBottom: 4 }}
                />

                {error && <p style={{ fontSize: 11, color: "#999", marginTop: 10, alignSelf: "flex-start" }}>{error}</p>}
                <button type="submit" style={{ ...btnStyle, marginTop: 28, width: "100%", textAlign: "center" }}>
                  continue →
                </button>
              </form>
            </div>
          )}

          {/* ── QUESTIONS ────────────────────────────────────────────────── */}
          {step === "questions" && questionsLoading && (
            <div className="generating-layout fade-in">
              <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase" }}>
                reading your style...
              </p>
              <div style={{ width: "100%", maxWidth: 560 }}>
                <AnimatedConstellation />
              </div>
            </div>
          )}

          {step === "questions" && !questionsLoading && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("upload")}

              <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                  }}>
                    a few quick questions.
                  </h2>
                  <p style={{ fontSize: 11, color: "#aaa", marginBottom: 44, letterSpacing: "0.04em", lineHeight: 1.6, textAlign: "center" }}>
                    this or that — just go with your gut
                  </p>

                  <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 32 }}>
                    {thisThatQuestions?.map((q, i) => (
                      <div key={i}>
                        <p style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                          {i + 1} of {thisThatQuestions.length}
                        </p>
                        <p style={{ fontSize: 13, color: "#ccc", marginBottom: 14, lineHeight: 1.6, letterSpacing: "0.01em" }}>
                          at <em style={{ color: "#fff" }}>{q.situation}</em>...
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {["A", "B"].map((opt) => {
                            const label = opt === "A" ? q.optionA : q.optionB;
                            const selected = thisThatAnswers[i] === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleAnswer(i, opt)}
                                style={{
                                  background: selected ? "#fff" : "transparent",
                                  color: selected ? "#0a0a0a" : "#888",
                                  border: selected ? "1px solid #fff" : "1px solid #2a2a2a",
                                  padding: "14px 12px",
                                  fontSize: 11,
                                  letterSpacing: "0.02em",
                                  lineHeight: 1.6,
                                  cursor: "pointer",
                                  textAlign: "left",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Looking for question */}
                    <div>
                      <p style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                        one more
                      </p>
                      <p style={{ fontSize: 13, color: "#ccc", marginBottom: 14, lineHeight: 1.6, letterSpacing: "0.01em" }}>
                        what's one thing you're trying to find right now?
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. the perfect white shirt, going-out tops, fall transition pieces..."
                        value={lookingFor}
                        onChange={e => setLookingFor(e.target.value)}
                        style={{ ...inputStyle }}
                      />
                    </div>

                    {error && <p style={{ fontSize: 11, color: "#999" }}>{error}</p>}
                    <button
                      onClick={handleQuestionsNext}
                      style={{ ...btnStyle, width: "100%", textAlign: "center", marginTop: 8 }}
                    >
                      see my results →
                    </button>
                  </div>
            </div>
          )}

          {/* ── GENERATING ───────────────────────────────────────────────── */}
          {step === "generating" && (
            <div className="generating-layout fade-in">
              <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase" }}>
                mapping your taste...
              </p>
              <div style={{ width: "100%", maxWidth: 560 }}>
                <AnimatedConstellation />
              </div>
            </div>
          )}

          {/* ── RESULTS ────────────────────────────────────────────────── */}
          {step === "results" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              <h2 style={{
                fontFamily: "'DM Mono', monospace",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(11px, 1.4vw, 13px)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#aaa",
                marginBottom: subtitle ? 10 : 36,
                textAlign: "center",
              }}>
                Your style, mapped.
              </h2>
              {subtitle && (
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "clamp(11px, 1.3vw, 13px)",
                  color: "#888",
                  textAlign: "center",
                  maxWidth: 320,
                  lineHeight: 1.6,
                  marginBottom: 36,
                  letterSpacing: "0.02em",
                }}>
                  {subtitle}
                </p>
              )}

              {/* Share card preview — receipt
               style */}
              <div style={{
                background: "#0a0a0a",
                border: "1px solid #222",
                borderRadius: 12,
                width: "100%",
                maxWidth: 280,
                aspectRatio: "9 / 16",
                padding: "16px 18px 14px",
                display: "flex",
                flexDirection: "column",
                marginBottom: 28,
                flexShrink: 0,
                overflow: "hidden",
                fontFamily: "'DM Mono', monospace",
              }}>
                {/* Receipt header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontSize: 7.5, color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>taste profile</span>
                  <span style={{ fontSize: 7, color: "#555", letterSpacing: "0.06em" }}>
                    {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".")}
                  </span>
                </div>
                <div style={{ borderTop: "1px dashed #252525", marginBottom: 12 }} />

                {/* Archetype */}
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  marginBottom: 12,
                }}>
                  {archetype}
                </span>
                <div style={{ borderTop: "1px dashed #252525", marginBottom: 10 }} />

                {/* Style breakdown */}
                <p style={{ fontSize: 7.5, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {name.split(" ")[0].toLowerCase()}'s style is:
                </p>
                {styleWords.map((word, i) => (
                  <div key={word} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: i < 2 ? 5 : 0,
                  }}>
                    <span style={{ fontSize: [13, 11, 9.5][i], color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {word}
                    </span>
                    <span style={{ fontSize: [11, 9.5, 8.5][i], color: "#777", letterSpacing: "0.06em" }}>
                      {stylePercentages[i]}%
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed #252525", marginTop: 10, marginBottom: 8 }} />

                {/* Constellation */}
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Constellation highlightedWords={styleWords} relevantWords={relevantWords} />
                </div>

                {/* Footer */}
                <p style={{ fontSize: 7, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, textAlign: "center" }}>
                  takethetastetest.com
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  style={{ ...btnStyle, width: "100%", textAlign: "center", opacity: sharing ? 0.5 : 1 }}
                >
                  {sharing ? "saving..." : "share"}
                </button>
                <button
                  onClick={() => setStep("home")}
                  style={{ ...ghostBtnStyle, width: "100%", textAlign: "center" }}
                >
                  back to home
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
