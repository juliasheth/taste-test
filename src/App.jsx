import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Analytics } from "@vercel/analytics/react";

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
    @import url('https://fonts.googleapis.com/css2?family=Forum&family=Inter:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; color: #1B0E41; overflow-x: hidden; }
    .app { font-family: 'Inter', sans-serif; background: #fff; color: #1B0E41; min-height: 100vh; padding-bottom: env(safe-area-inset-bottom); display: flex; flex-direction: column; }
    .page { padding: 0 28px; }
    input, textarea, button { font-family: 'Inter', sans-serif; }
    input:focus, textarea:focus { outline: none; }
    input::placeholder, textarea::placeholder { color: #909090; }
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

    /* ── Announcement bar ── */
    .announcement-bar {
      background: #1B0E41;
      color: #fff;
      text-align: center;
      padding: 12px 0;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 400;
    }

    /* ── Home hero ── */
    .home-hero {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      padding: 36px 0 20px;
    }

    /* ── Brand wordmark ── */
    .brand-wordmark {
      font-family: 'Forum', serif;
      font-size: 21vw;
      color: #1B0E41;
      line-height: 0.82;
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: visible;
    }

    /* ── Site footer ── */
    .site-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0 24px;
    }
    .site-footer-link {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #1B0E41;
      cursor: pointer;
      padding-bottom: 6px;
      border: none;
      border-bottom: 2px solid #1B0E41;
      background: none;
      font-weight: 400;
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
      .page { padding: 0 40px; }
      .home-hero { padding: 40px 0 24px; }
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
  borderBottom: "1px solid rgba(27, 14, 65, 0.22)",
  padding: "12px 0",
  fontSize: 16,
  background: "transparent",
  color: "#1B0E41",
  letterSpacing: "0.02em",
};

const btnStyle = {
  background: "#1B0E41",
  color: "#fff",
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
  color: "#1B0E41",
  border: "1px solid rgba(27, 14, 65, 0.3)",
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
const generateThisThatQuestions = async (photos, description, textInputs = null) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const useTextPath = textInputs !== null;
  const content = [];

  if (!useTextPath) {
    for (const photo of photos) {
      if (photo) {
        content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: photo } });
      }
    }
    const textPrompt = description
      ? `Here are my outfit photos. Style notes: "${description}". Generate 3 this-or-that questions based on my style.`
      : "Here are my outfit photos. Generate 3 this-or-that questions based on my style.";
    content.push({ type: "text", text: textPrompt });
  } else {
    const lines = [
      "I don't have outfit photos, but here's my style in words:",
      "",
      `What I'm wearing today: '${textInputs.wearingToday}'`,
      `My favorite outfit I've worn recently: '${textInputs.favoriteOutfit}'`,
      `Brands I love: '${textInputs.brands}'`,
    ];
    if (textInputs.description) lines.push(`Anything else about my style: '${textInputs.description}'`);
    lines.push("", "Generate 3 this-or-that questions based on my style.");
    content.push({ type: "text", text: lines.join("\n") });
  }

  const system = useTextPath
    ? `You are a sharp, intuitive stylist with a great eye and an even better instinct for how people actually dress. Your job is to figure out someone's real aesthetic — not what they aspire to, but how they actually move through the world.

Based on the user's style description, generate 3 'this or that' style questions to help map their taste. Each question names a specific real-world situation and presents two contrasting outfit options (A and B).

Rules:
- The three situations must be clearly distinct from each other — no two should feel like variations of the same vibe (e.g. don't use two going-out scenarios)
- Situations should feel like real moments from this person's life, not generic fashion prompts
- Describe each outfit option the way a stylish friend would in a text message — specific enough to picture it, but easy to read. Mention 2-3 key pieces or details. No stiff product-listing language.
- The two options within each question should represent genuinely different aesthetic directions — not just casual vs. dressy, but different points of view
- Read between the lines of what they've told you — the brands they love, what they actually wore today vs. their favorite outfit, any gap between those two things is signal
- If their "wearing today" and "favorite outfit" descriptions feel different from each other, use that tension to probe which direction is more them

Return a JSON array of exactly 3 objects, each with:
- "situation": a short, specific scenario (e.g. "Sunday farmers market with your person")
- "optionA": outfit description
- "optionB": outfit description

Return only valid JSON. No extra text.`
    : `You are a sharp, intuitive stylist with a great eye and an even better instinct for how people actually dress. Your job is to figure out someone's real aesthetic — not what they aspire to, but how they actually move through the world.

Based on the user's outfit photos, generate 3 'this or that' style questions to help map their taste. Each question names a specific real-world situation and presents two contrasting outfit options (A and B).

Rules:
- The three situations must be clearly distinct from each other — no two should feel like variations of the same vibe (e.g. don't use two going-out scenarios)
- Situations should feel like real moments from this person's life, not generic fashion prompts
- Describe each outfit option the way a stylish friend would in a text message — specific enough to picture it, but easy to read. Mention 2-3 key pieces or details. No stiff product-listing language.
- The two options within each question should represent genuinely different aesthetic directions — not just casual vs. dressy, but different points of view
- Don't mirror the photos back at them — use the photos as a signal to probe the edges of their taste

Return a JSON array of exactly 3 objects, each with:
- "situation": a short, specific scenario (e.g. "Sunday farmers market with your person")
- "optionA": outfit description
- "optionB": outfit description

Return only valid JSON. No extra text.`;

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
    const match = data.content[0].text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;
    if (!Array.isArray(questions) || questions.length !== 3) return null;
    return questions;
  } catch {
    return null;
  }
};

// ─── CLAUDE: GENERATE STYLE WORDS ────────────────────────────────────────────
const generateStyleWords = async (photos, description, thisThatQuestions, thisThatAnswers, lookingFor, textInputs = null) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const useTextPath = textInputs !== null;
  const content = [];

  let choicesText = "";
  if (thisThatQuestions && thisThatAnswers) {
    thisThatQuestions.forEach((q, i) => {
      const answer = thisThatAnswers[i];
      if (answer) {
        const chosen = answer === "A" ? q.optionA : q.optionB;
        choicesText += `- In "${q.situation}": chose "${chosen}"\n`;
      }
    });
  }

  if (!useTextPath) {
    for (const photo of photos) {
      if (photo) {
        content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: photo } });
      }
    }
    const lines = ["Here are my outfit photos.", ""];
    if (description) lines.push(`Style notes: '${description}'`, "");
    if (choicesText) lines.push(`This-or-that choices:\n${choicesText.trim()}`, "");
    if (lookingFor && lookingFor.trim()) lines.push(`What I'm looking for: '${lookingFor.trim()}'`);
    content.push({ type: "text", text: lines.join("\n") });
  } else {
    const lines = ["Here's my style in words:", ""];
    lines.push(`What I'm wearing today: '${textInputs.wearingToday}'`);
    lines.push(`My favorite outfit I've worn recently: '${textInputs.favoriteOutfit}'`);
    lines.push(`Brands I love: '${textInputs.brands}'`);
    if (textInputs.description) lines.push(`Anything else about my style: '${textInputs.description}'`);
    if (choicesText) lines.push("", `This-or-that choices:\n${choicesText.trim()}`);
    if (lookingFor && lookingFor.trim()) lines.push("", `What I'm looking for: '${lookingFor.trim()}'`);
    content.push({ type: "text", text: lines.join("\n") });
  }

  const wordList = NODE_IDS.join(", ");

  const system = useTextPath
    ? `You are a sharp, intuitive stylist building a taste profile for someone based on their style description, quiz answers, and preferences.

Your job is to analyze their aesthetic and return a JSON object. Think spatially about their style — not just which individual words fit them, but where on the aesthetic map they actually live and how far their taste stretches.

Step 1 — Read the full picture: what they're wearing today, their favorite outfit, the brands they love, their this-or-that choices, and anything they've shared about what they're looking for. Pay close attention to the gap between what they wore today and their favorite outfit — everyday dress is behavioral truth, favorite outfit skews aspirational, and the distance between them is often the most revealing signal.

Step 2 — Pick 3 words (the "words" field): These are the three words that most precisely capture their aesthetic core. They should feel like a revelation — words they'd screenshot and send to a friend. Prioritize specificity over safety. "Parisian" beats "classic." "Undone" beats "casual."

Step 3 — Pick 20 words (the "relevant" field): Map the full territory of their taste from the word list. Think in clusters — what's their center of gravity, and how far do they range? Someone centered in minimal/clean might stretch toward editorial or structured but probably not toward maximalist. Be honest about range — don't just pick adjacent safe words, but don't overreach either.

Step 4 — Write their archetype (the "archetype" field): Format is always "The [Adjective] [Noun]." It should read like a style persona — something you'd see in a fashion magazine or hear a stylist say. Clearly fashion-oriented, never generic. The adjective should create tension or surprise with the noun — two words that together say something neither word says alone. "The Quiet Parisian." "The Romantic Minimalist." Aim for that register.

Step 5 — Write their subtitle (the "subtitle" field): One punchy sentence. This is the line they'll screenshot. It should capture how they move through the world stylistically — specific, a little poetic, never generic. Not "you love clean lines and neutral tones." More like "you dress like you've already been everywhere worth going."

Step 6 — Assign percentages (the "percentages" field): Three numbers adding to 100. These represent the three dominant aesthetic territories in their taste map — not precise measurements, just a felt sense of proportion. Assign them in descending order.

Word list:
${wordList}

Return only this JSON structure, no extra text:
{"words":["word1","word2","word3"],"relevant":["word1","word2","word3","word4","word5","word6","word7","word8","word9","word10","word11","word12","word13","word14","word15","word16","word17","word18","word19","word20"],"archetype":"The X Y","subtitle":"One punchy sentence.","percentages":[45,32,23]}`
    : `You are a sharp, intuitive stylist building a taste profile for someone based on their outfit photos, style answers, and preferences.

Your job is to analyze their aesthetic and return a JSON object. Think spatially about their style — not just which individual words fit them, but where on the aesthetic map they actually live and how far their taste stretches.

Step 1 — Read the full picture: outfit photos, this-or-that choices, and anything they've shared about what they're looking for. Look for the tension between what they wear and what they choose. That gap is often the most interesting signal.

Step 2 — Pick 3 words (the "words" field): These are the three words that most precisely capture their aesthetic core. They should feel like a revelation — words they'd screenshot and send to a friend. Prioritize specificity over safety. "Parisian" beats "classic." "Undone" beats "casual."

Step 3 — Pick 20 words (the "relevant" field): Map the full territory of their taste from the word list. Think in clusters — what's their center of gravity, and how far do they range? Someone centered in minimal/clean might stretch toward editorial or structured but probably not toward maximalist. Be honest about range — don't just pick adjacent safe words, but don't overreach either.

Step 4 — Write their archetype (the "archetype" field): Format is always "The [Adjective] [Noun]." It should read like a style persona — something you'd see in a fashion magazine or hear a stylist say. Clearly fashion-oriented, never generic. The adjective should create tension or surprise with the noun — two words that together say something neither word says alone. "The Quiet Parisian." "The Romantic Minimalist." Aim for that register.

Step 5 — Write their subtitle (the "subtitle" field): One punchy sentence. This is the line they'll screenshot. It should capture how they move through the world stylistically — specific, a little poetic, never generic. Not "you love clean lines and neutral tones." More like "you dress like you've already been everywhere worth going."

Step 6 — Assign percentages (the "percentages" field): Three numbers adding to 100. These represent the three dominant aesthetic territories in their taste map — not precise measurements, just a felt sense of proportion. Assign them in descending order.

Word list:
${wordList}

Return only this JSON structure, no extra text:
{"words":["word1","word2","word3"],"relevant":["word1","word2","word3","word4","word5","word6","word7","word8","word9","word10","word11","word12","word13","word14","word15","word16","word17","word18","word19","word20"],"archetype":"The X Y","subtitle":"One punchy sentence.","percentages":[45,32,23]}`;

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
        stroke="rgba(27,14,65,0.4)"
        strokeWidth="0.25"
        strokeDasharray="2.5 2"
        opacity="1"
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
        const fill = isH ? "#1B0E41" : showLabels ? "rgba(27,14,65,0.35)" : "rgba(27,14,65,0.25)";
        const { dx, dy, textAnchor } = getLabelProps(node);

        return (
          <g key={node.id}>
            {isH && (
              <circle
                cx={node.x} cy={node.y} r={5}
                fill="none" stroke="rgba(27,14,65,0.15)" strokeWidth="0.3" opacity="1"
              />
            )}
            <circle cx={node.x} cy={node.y} r={r} fill={fill} />
            {showLabels && (
              <text
                x={node.x + dx}
                y={node.y + dy}
                textAnchor={textAnchor}
                fontSize="1.85"
                fontFamily="Inter, sans-serif"
                fill={isH ? "#1B0E41" : "rgba(27,14,65,0.4)"}
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
          stroke="rgba(27,14,65,0.2)"
          strokeWidth="0.5"
          opacity="1"
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
                <circle cx={nx} cy={ny} r={20} fill="none" stroke="rgba(27,14,65,0.08)" strokeWidth="0.4" opacity="1" />
                <circle cx={nx} cy={ny} r={11} fill="none" stroke="rgba(27,14,65,0.15)" strokeWidth="0.5" opacity="1" />
              </>
            )}
            <circle
              cx={nx} cy={ny}
              r={isGlow ? 4 : 1.5}
              fill={isGlow ? "#1B0E41" : "rgba(27,14,65,0.25)"}
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
    document.fonts.load('400 85px "Forum"'),
    document.fonts.load('400 50px "Inter"'),
    document.fonts.load('300 29px "Inter"'),
  ]);

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const PAD = 70;
  const INNER_W = W - PAD * 2;
  let y = 62;

  const thinDash = (yPos) => {
    ctx.beginPath();
    ctx.setLineDash([8, 6]);
    ctx.moveTo(PAD, yPos);
    ctx.lineTo(W - PAD, yPos);
    ctx.strokeStyle = "rgba(27, 14, 65, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // ── HEADER ROW ────────────────────────────────────────────────
  ctx.font = '300 29px "Inter", sans-serif';
  ctx.fillStyle = "rgba(27, 14, 65, 0.45)";
  ctx.textAlign = "left";
  ctx.fillText("YOUR PATTERN", PAD, y);

  const dateStr = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".");
  ctx.fillStyle = "rgba(27, 14, 65, 0.4)";
  ctx.font = '300 27px "Inter", sans-serif';
  ctx.textAlign = "right";
  ctx.fillText(dateStr, W - PAD, y);
  ctx.textAlign = "left";
  y += 38;

  thinDash(y); y += 110;

  // ── ARCHETYPE ─────────────────────────────────────────────────
  ctx.fillStyle = "#1B0E41";
  ctx.font = '400 85px "Forum", serif';
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
  ctx.fillStyle = "rgba(27, 14, 65, 0.45)";
  ctx.font = '300 29px "Inter", sans-serif';
  ctx.fillText(`${firstName}'s style is:`.toUpperCase(), PAD, y);
  y += 70;

  const wordSizes = [50, 42, 37];
  const pctSizes  = [42, 37, 33];
  words.forEach((word, i) => {
    ctx.font = `400 ${wordSizes[i]}px "Inter", sans-serif`;
    ctx.fillStyle = "#1B0E41";
    ctx.textAlign = "left";
    ctx.fillText(word.toUpperCase(), PAD, y);

    ctx.font = `300 ${pctSizes[i]}px "Inter", sans-serif`;
    ctx.fillStyle = "rgba(27, 14, 65, 0.5)";
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
      ctx.strokeStyle = "rgba(27, 14, 65, 0.4)";
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
      ctx.strokeStyle = "rgba(27, 14, 65, 0.15)";
      ctx.lineWidth = (0.3 / 100) * side;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(nx, ny, (isH ? 1.3 : 0.6) / 100 * side, 0, Math.PI * 2);
    ctx.fillStyle = isH ? "#1B0E41" : "rgba(27, 14, 65, 0.3)";
    ctx.fill();

    // Labels (matches SVG: fontSize 1.85, dx ±2.2, dy -2.2/-3.5/4)
    const onRight = node.x > 58;
    const onTop   = node.y < 12;
    const onBot   = node.y > 88;
    const ldx = (onRight ? -2.2 : 2.2) / 100 * side;
    const ldy = (onTop ? 4 : onBot ? -3.5 : -2.2) / 100 * side;
    ctx.fillStyle = isH ? "#1B0E41" : "rgba(27, 14, 65, 0.4)";
    ctx.font = `${isH ? "400" : "300"} ${Math.round((1.85 / 100) * side)}px "Inter", sans-serif`;
    ctx.textAlign = onRight ? "right" : "left";
    ctx.fillText(node.id, nx + ldx, ny + ldy);
  });
  ctx.textAlign = "left";

  // ── FOOTER ────────────────────────────────────────────────────
  ctx.fillStyle = "#1B0E41";
  ctx.font = '300 27px "Inter", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("PATTERN.SHOP", W / 2, H - 54);
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
  const [showTextPath, setShowTextPath]           = useState(false);
  const [wearingToday, setWearingToday]           = useState("");
  const [favoriteOutfit, setFavoriteOutfit]       = useState("");
  const [brands, setBrands]                       = useState("");
  const [error, setError]                         = useState("");
  const [emailError, setEmailError]               = useState("");
  const [sharing, setSharing]                     = useState(false);
  const [signupId, setSignupId]                   = useState(null);
  const [typed, setTyped]                         = useState("");
  const [heroReady, setHeroReady]                 = useState(false);
  const [submitting, setSubmitting]               = useState(false);
  const [waitlistName, setWaitlistName]           = useState("");
  const [waitlistEmail, setWaitlistEmail]         = useState("");
  const [waitlistPhone, setWaitlistPhone]         = useState("");
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistDone, setWaitlistDone]           = useState(false);
  const [waitlistError, setWaitlistError]         = useState("");

  const fileRef0 = useRef(null);
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const fileRefs = [fileRef0, fileRef1, fileRef2];
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    const fit = () => {
      const containerWidth = el.parentElement.clientWidth;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const testSize = 100;
      ctx.font = `400 ${testSize}px Forum`;
      const textWidth = ctx.measureText("PATTERN").width;
      el.style.fontSize = `${(containerWidth / textWidth) * testSize}px`;
    };
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  const HERO_TEXT = "STOP SHOPPING OTHER PEOPLE'S TASTE.";
  useEffect(() => {
    if (step !== "home") return;
    if (typed.length < HERO_TEXT.length) {
      const t = setTimeout(() => setTyped(HERO_TEXT.slice(0, typed.length + 1)), 55);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setHeroReady(true), 300);
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

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!waitlistName.trim()) { setWaitlistError("please enter your name"); return; }
    if (!waitlistEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail.trim())) { setWaitlistError("please enter a valid email"); return; }
    setWaitlistSubmitting(true);
    setWaitlistError("");
    try {
      if (supabase) {
        const { data: existing } = await supabase
          .from("submissions")
          .select("id")
          .eq("email", waitlistEmail.trim().toLowerCase())
          .maybeSingle();
        if (!existing) {
          await supabase.from("submissions").insert({
            id: crypto.randomUUID(),
            name: waitlistName.trim(),
            email: waitlistEmail.trim().toLowerCase(),
            phone: waitlistPhone.trim() || null,
          });
        }
      }
      setWaitlistDone(true);
    } catch {
      setWaitlistError("something went wrong — please try again");
    } finally {
      setWaitlistSubmitting(false);
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

  const formatPhoneE164 = (raw) => {
    const digits = raw.replace(/\D/g, "");
    if (raw.startsWith("+")) return "+" + digits;
    if (digits.length === 10) return "+1" + digits;
    if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
    return "+" + digits;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setEmailError("please enter your name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("please enter a valid email"); return; }
    if (submitting) return;
    setSubmitting(true);
    setEmailError("");
    try {

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
    const textInputs = validPhotos.length === 0 ? {
      wearingToday: wearingToday.trim(),
      favoriteOutfit: favoriteOutfit.trim(),
      brands: brands.trim(),
      description: description.trim() || null,
    } : null;
    const [result] = await Promise.all([
      generateStyleWords(validPhotos, description, thisThatQuestions, thisThatAnswers, lookingFor, textInputs),
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

      const submissionData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        description: description.trim() || null,
        wearing_today: wearingToday.trim() || null,
        favorite_outfit: favoriteOutfit.trim() || null,
        brands: brands.trim() || null,
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
      };

      const emailValue = email.trim().toLowerCase();
      const { data: existing } = await supabase
        .from("submissions")
        .select("id, submission_count")
        .eq("email", emailValue)
        .maybeSingle();

      let err;
      if (existing) {
        const nonNullData = Object.fromEntries(
          Object.entries(submissionData).filter(([, v]) => v !== null && v !== undefined)
        );
        const { error: updateErr } = await supabase
          .from("submissions")
          .update({ ...nonNullData, submission_count: (existing.submission_count || 1) + 1 })
          .eq("email", emailValue);
        err = updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("submissions")
          .insert({ id: submissionId, ...submissionData, submission_count: 1 });
        err = insertErr;
      }
      if (err) console.error("Supabase submissions error:", err.message);
    }

    // TODO: Re-enable once Twilio A2P 10DLC registration is approved
    // try {
    //   const smsRes = await fetch("/api/send-profile-sms", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       phone: formatPhoneE164(phone.trim()),
    //       archetype: finalArchetype,
    //       name: name.trim(),
    //     }),
    //   });
    //   const smsData = await smsRes.json().catch(() => ({}));
    //   if (!smsRes.ok) {
    //     console.error("SMS send failed:", smsData.error || smsRes.status);
    //   } else {
    //     console.log("SMS sent successfully:", smsData);
    //   }
    // } catch (err) {
    //   console.error("SMS send error:", err.message);
    // }

      setStep("results");
    } catch (err) {
      console.error("handleSignup error:", err);
      if (supabase) {
        supabase.from("errors").insert({
          error_message: err?.message || String(err),
          error_stack: err?.stack || null,
          step: "signup",
          phone: phone.trim() || null,
          user_agent: navigator.userAgent,
        }).then(({ error: logErr }) => { if (logErr) console.error("failed to log error:", logErr.message); });
      }
      setEmailError("something went wrong — please try again");
      setStep("signup");
    } finally {
      setSubmitting(false);
    }
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

  const handleTextUpload = async (e) => {
    e.preventDefault();
    if (!wearingToday.trim()) { setError("please describe what you're wearing today"); return; }
    if (!favoriteOutfit.trim()) { setError("please describe your favorite outfit"); return; }
    if (!brands.trim()) { setError("please enter at least one brand you love"); return; }
    setError("");
    setQuestionsLoading(true);
    setStep("questions");

    const questions = await generateThisThatQuestions([], null, {
      wearingToday: wearingToday.trim(),
      favoriteOutfit: favoriteOutfit.trim(),
      brands: brands.trim(),
      description: description.trim() || null,
    });
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
        color: "#1B0E41",
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
        {step === "home" ? (
          <>
            <div className="announcement-bar">COMING SUMMER 2026</div>
            <div className="page" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="home-hero">
                <h1 style={{
                  fontFamily: "'Forum', serif",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 5vw, 72px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#1B0E41",
                  marginBottom: 16,
                  maxWidth: "50vw",
                  minHeight: "2.2em",
                }}>
                  {typed}
                  {!heroReady && (
                    <span style={{
                      display: "inline-block",
                      width: 2,
                      height: "0.85em",
                      background: "#1B0E41",
                      marginLeft: 2,
                      verticalAlign: "middle",
                      animation: "blink 1s step-end infinite",
                    }} />
                  )}
                </h1>
                <p style={{
                  fontSize: 13,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1B0E41",
                  fontWeight: 400,
                  marginBottom: 32,
                  opacity: heroReady ? 1 : 0,
                  animation: heroReady ? "fadeUp 0.5s ease both" : "none",
                }}>
                  START SHOPPING WITH PATTERN.
                </p>
                <button
                  onClick={() => setStep("upload")}
                  style={{
                    ...btnStyle,
                    marginBottom: 12,
                    opacity: heroReady ? 1 : 0,
                    animation: heroReady ? "fadeUp 0.5s ease 0.1s both" : "none",
                  }}
                >
                  GET STARTED
                </button>
                <p style={{
                  fontSize: 13,
                  color: "#1B0E41",
                  opacity: heroReady ? 1 : 0,
                  animation: heroReady ? "fadeUp 0.5s ease 0.2s both" : "none",
                }}>
                  Not ready yet? Join our{" "}
                  <a
                    onClick={() => setStep("waitlist")}
                    style={{ color: "#1B0E41", textDecoration: "underline", cursor: "pointer" }}
                  >
                    waitlist
                  </a>.
                </p>
              </div>
              <div style={{
                marginTop: "auto",
                opacity: heroReady ? 1 : 0,
                animation: heroReady ? "fadeIn 0.6s ease 0.3s both" : "none",
              }}>
                <div ref={wordmarkRef} className="brand-wordmark">PATTERN</div>
                <div className="site-footer">
                  <button className="site-footer-link">CONTACT US</button>
                  <button className="site-footer-link">FREQUENTLY ASKED QUESTIONS</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="page">

          {/* ── WAITLIST ─────────────────────────────────────────────────── */}
          {step === "waitlist" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("home")}
              {!waitlistDone ? (
                <>
                  <h2 style={{
                    fontFamily: "'Forum', serif",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    color: "#1B0E41",
                  }}>
                    stay in the loop.
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(27,14,65,0.6)", marginBottom: 36, letterSpacing: "0.03em", lineHeight: 1.8, textAlign: "center", maxWidth: 360 }}>
                    drop your info and we'll let you know when our full styling product launches — plus remind you to come back and take the test whenever you're ready.
                  </p>
                  <form onSubmit={handleWaitlist} style={{ width: "100%", maxWidth: 400 }}>
                    <div style={{ marginBottom: 14 }}>
                      <input
                        type="text"
                        placeholder="your name"
                        value={waitlistName}
                        onChange={e => { setWaitlistName(e.target.value); setWaitlistError(""); }}
                        style={inputStyle}
                        autoComplete="name"
                      />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <input
                        type="email"
                        placeholder="your email"
                        value={waitlistEmail}
                        onChange={e => { setWaitlistEmail(e.target.value); setWaitlistError(""); }}
                        style={inputStyle}
                        autoComplete="email"
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <input
                        type="tel"
                        placeholder="phone number (optional)"
                        value={waitlistPhone}
                        onChange={e => { setWaitlistPhone(e.target.value); setWaitlistError(""); }}
                        style={inputStyle}
                        autoComplete="tel"
                      />
                    </div>
                    {waitlistError && <p style={{ fontSize: 11, color: "rgba(27,14,65,0.6)", marginBottom: 12 }}>{waitlistError}</p>}
                    <button type="submit" disabled={waitlistSubmitting} style={{ ...btnStyle, width: "100%", textAlign: "center", opacity: waitlistSubmitting ? 0.4 : 1, cursor: waitlistSubmitting ? "default" : "pointer" }}>
                      {waitlistSubmitting ? "saving..." : "join the waitlist →"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 style={{
                    fontFamily: "'Forum', serif",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 16,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    color: "#1B0E41",
                  }}>
                    you're on the list.
                  </h2>
                  <p style={{ fontSize: 12, color: "rgba(27,14,65,0.6)", marginBottom: 36, letterSpacing: "0.03em", lineHeight: 1.8, textAlign: "center", maxWidth: 360 }}>
                    we'll reach out when we launch. and whenever you're ready to take the test, we'll be here.
                  </p>
                  <button onClick={() => setStep("home")} style={{ ...ghostBtnStyle, fontSize: 10, letterSpacing: "0.08em", padding: "10px 20px" }}>
                    back to home
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── SIGNUP ───────────────────────────────────────────────────── */}
          {step === "signup" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("questions")}
              <h2 style={{
                fontFamily: "'Forum', serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.2,
                marginBottom: 14,
                letterSpacing: "-0.01em",
                textAlign: "center",
                color: "#1B0E41",
              }}>
                unlock your results
              </h2>
              <p style={{ fontSize: 13, color: "rgba(27,14,65,0.6)", lineHeight: 1.8, marginBottom: 40, maxWidth: 380, letterSpacing: "0.02em", textAlign: "center" }}>
                get your taste profile now and early access to our full styling product when we launch
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
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="tel"
                    placeholder="phone number (optional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle}
                    autoComplete="tel"
                  />
                </div>
                {emailError && <p style={{ fontSize: 11, color: "rgba(27,14,65,0.6)", marginBottom: 12 }}>{emailError}</p>}
                <button type="submit" disabled={submitting} style={{ ...btnStyle, width: "100%", textAlign: "center", opacity: submitting ? 0.4 : 1, cursor: submitting ? "default" : "pointer" }}>
                  {submitting ? "submitting..." : "reveal my taste →"}
                </button>
              </form>
            </div>
          )}

          {/* ── UPLOAD ───────────────────────────────────────────────────── */}
          {step === "upload" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)", position: "relative" }}>
              {backBtn("home")}
              <h2 style={{
                fontFamily: "'Forum', serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 42px)",
                lineHeight: 1.2,
                marginBottom: 10,
                letterSpacing: "-0.01em",
                textAlign: "center",
                color: "#1B0E41",
              }}>
                show us your style.
              </h2>

              {!showTextPath ? (
                <>
                  <p style={{ fontSize: 11, color: "rgba(27,14,65,0.55)", marginBottom: 36, letterSpacing: "0.04em", lineHeight: 1.6, textAlign: "center" }}>
                    outfit photos, saved inspo, screenshots — anything that shows how you actually dress
                  </p>
                  <form onSubmit={handleUpload} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>

                    {/* Photo slots */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, width: "100%", marginBottom: 16 }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div
                            onClick={() => fileRefs[i].current?.click()}
                            style={{
                              border: "1px dashed rgba(27, 14, 65, 0.25)",
                              cursor: "pointer",
                              overflow: "hidden",
                              aspectRatio: "3 / 4",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              background: photoPreviews[i] ? "transparent" : "#f5f5f5",
                            }}
                          >
                            {photoPreviews[i] ? (
                              <>
                                <img
                                  src={photoPreviews[i]}
                                  alt={`outfit ${i + 1}`}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setPhotoPreviews(prev => { const next = [...prev]; next[i] = null; return next; });
                                    setPhotos(prev => { const next = [...prev]; next[i] = null; return next; });
                                    if (fileRefs[i].current) fileRefs[i].current.value = "";
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: 6,
                                    right: 6,
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    background: "rgba(0,0,0,0.55)",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: 12,
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                  }}
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <span style={{ fontSize: 20, color: "rgba(27,14,65,0.35)", lineHeight: 1 }}>+</span>
                            )}
                          </div>
                          <p style={{ fontSize: 9, color: "rgba(27,14,65,0.45)", letterSpacing: "0.08em", textAlign: "center", textTransform: "uppercase" }}>
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

                    <p style={{ fontSize: 11, color: "rgba(27,14,65,0.5)", marginBottom: 20, letterSpacing: "0.03em", textAlign: "center" }}>
                      don't have outfit photos?{" "}
                      <button
                        type="button"
                        onClick={() => { setShowTextPath(true); setError(""); }}
                        style={{ background: "none", border: "none", padding: 0, color: "#1B0E41", fontSize: 11, letterSpacing: "0.03em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        describe your style instead
                      </button>
                    </p>

                    {/* Optional description */}
                    <textarea
                      placeholder="add more about your style (optional) — vibes, references, what you gravitate toward..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, resize: "none", lineHeight: 1.7, paddingTop: 12, width: "100%", marginBottom: 4 }}
                    />

                    {error && <p style={{ fontSize: 11, color: "rgba(27,14,65,0.6)", marginTop: 10, alignSelf: "flex-start" }}>{error}</p>}
                    <button type="submit" style={{ ...btnStyle, marginTop: 28, width: "100%", textAlign: "center" }}>
                      continue →
                    </button>
                    <p style={{ fontSize: 11, color: "rgba(27,14,65,0.5)", marginTop: 20, letterSpacing: "0.03em", textAlign: "center" }}>
                      don't have time right now?{" "}
                      <button
                        type="button"
                        onClick={() => setStep("waitlist")}
                        style={{ background: "none", border: "none", padding: 0, color: "#1B0E41", fontSize: 11, letterSpacing: "0.03em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        join the waitlist
                      </button>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 11, color: "rgba(27,14,65,0.55)", marginBottom: 36, letterSpacing: "0.04em", lineHeight: 1.6, textAlign: "center" }}>
                    tell us a bit about how you dress
                  </p>
                  <form onSubmit={handleTextUpload} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", marginBottom: 14 }}>
                      <input
                        type="text"
                        placeholder="what are you wearing today? e.g. baggy jeans, a vintage tee, white sneakers"
                        value={wearingToday}
                        onChange={e => { setWearingToday(e.target.value); setError(""); }}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ width: "100%", marginBottom: 14 }}>
                      <input
                        type="text"
                        placeholder="favorite outfit you've worn recently — describe it, what made it work?"
                        value={favoriteOutfit}
                        onChange={e => { setFavoriteOutfit(e.target.value); setError(""); }}
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ width: "100%", marginBottom: 14 }}>
                      <input
                        type="text"
                        placeholder="brands you love e.g. Cos, Zara, Toteme"
                        value={brands}
                        onChange={e => { setBrands(e.target.value); setError(""); }}
                        style={inputStyle}
                      />
                    </div>
                    <textarea
                      placeholder="anything else about your vibe? (optional) — references, aesthetics, what you gravitate toward..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, resize: "none", lineHeight: 1.7, paddingTop: 12, width: "100%", marginBottom: 4 }}
                    />

                    {error && <p style={{ fontSize: 11, color: "rgba(27,14,65,0.6)", marginTop: 10, alignSelf: "flex-start" }}>{error}</p>}
                    <button type="submit" style={{ ...btnStyle, marginTop: 28, width: "100%", textAlign: "center" }}>
                      continue →
                    </button>
                    <p style={{ fontSize: 11, color: "rgba(27,14,65,0.5)", marginTop: 20, letterSpacing: "0.03em", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => { setShowTextPath(false); setError(""); }}
                        style={{ background: "none", border: "none", padding: 0, color: "#1B0E41", fontSize: 11, letterSpacing: "0.03em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                      >
                        ← back to photo upload
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>
          )}

          {/* ── QUESTIONS ────────────────────────────────────────────────── */}
          {step === "questions" && questionsLoading && (
            <div className="generating-layout fade-in">
              <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(27,14,65,0.55)", textTransform: "uppercase" }}>
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
                    fontFamily: "'Forum', serif",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    color: "#1B0E41",
                  }}>
                    a few quick questions.
                  </h2>
                  <p style={{ fontSize: 11, color: "rgba(27,14,65,0.55)", marginBottom: 44, letterSpacing: "0.04em", lineHeight: 1.6, textAlign: "center" }}>
                    this or that — just go with your gut
                  </p>

                  <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 32 }}>
                    {thisThatQuestions?.map((q, i) => (
                      <div key={i}>
                        <p style={{ fontSize: 10, color: "rgba(27,14,65,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                          {i + 1} of {thisThatQuestions.length}
                        </p>
                        <p style={{ fontSize: 13, color: "#1B0E41", marginBottom: 14, lineHeight: 1.6, letterSpacing: "0.01em" }}>
                          at <em style={{ color: "#1B0E41" }}>{q.situation}</em>...
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
                                  background: selected ? "#1B0E41" : "transparent",
                                  color: selected ? "#fff" : "rgba(27,14,65,0.6)",
                                  border: selected ? "1px solid #1B0E41" : "1px solid rgba(27, 14, 65, 0.25)",
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
                      <p style={{ fontSize: 10, color: "rgba(27,14,65,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                        one more
                      </p>
                      <p style={{ fontSize: 13, color: "#1B0E41", marginBottom: 14, lineHeight: 1.6, letterSpacing: "0.01em" }}>
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

                    {error && <p style={{ fontSize: 11, color: "rgba(27,14,65,0.6)" }}>{error}</p>}
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
              <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(27,14,65,0.55)", textTransform: "uppercase" }}>
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
                fontFamily: "'Inter', sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(11px, 1.4vw, 13px)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(27,14,65,0.55)",
                marginBottom: subtitle ? 10 : 36,
                textAlign: "center",
              }}>
                Your style, mapped.
              </h2>
              {subtitle && (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(11px, 1.3vw, 13px)",
                  color: "rgba(27,14,65,0.6)",
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
                background: "#fff",
                border: "1px solid rgba(27,14,65,0.15)",
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
                fontFamily: "'Inter', sans-serif",
              }}>
                {/* Receipt header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontSize: 7.5, color: "rgba(27,14,65,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>your pattern</span>
                  <span style={{ fontSize: 7, color: "rgba(27,14,65,0.4)", letterSpacing: "0.06em" }}>
                    {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, ".")}
                  </span>
                </div>
                <div style={{ borderTop: "1px dashed rgba(27,14,65,0.15)", marginBottom: 12 }} />

                {/* Archetype */}
                <span style={{
                  fontFamily: "'Forum', serif",
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#1B0E41",
                  marginBottom: 12,
                }}>
                  {archetype}
                </span>
                <div style={{ borderTop: "1px dashed rgba(27,14,65,0.15)", marginBottom: 10 }} />

                {/* Style breakdown */}
                <p style={{ fontSize: 7.5, color: "rgba(27,14,65,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {name.split(" ")[0].toLowerCase()}'s style is:
                </p>
                {styleWords.map((word, i) => (
                  <div key={word} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: i < 2 ? 5 : 0,
                  }}>
                    <span style={{ fontSize: [13, 11, 9.5][i], color: "#1B0E41", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {word}
                    </span>
                    <span style={{ fontSize: [11, 9.5, 8.5][i], color: "rgba(27,14,65,0.5)", letterSpacing: "0.06em" }}>
                      {stylePercentages[i]}%
                    </span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed rgba(27,14,65,0.15)", marginTop: 10, marginBottom: 8 }} />

                {/* Constellation */}
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Constellation highlightedWords={styleWords} relevantWords={relevantWords} />
                </div>

                {/* Footer */}
                <p style={{ fontSize: 7, color: "#1B0E41", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, textAlign: "center" }}>
                  pattern.shop
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
        )}
      </div>
    </>
  );
}
