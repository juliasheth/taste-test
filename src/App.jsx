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
    .app { font-family: 'DM Mono', monospace; background: #0a0a0a; color: #fff; min-height: 100vh; }
    .page { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    input, textarea, button { font-family: 'DM Mono', monospace; }
    input:focus, textarea:focus { outline: none; }
    input::placeholder, textarea::placeholder { color: #444; }
    button { cursor: pointer; }

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

    /* ── Split layout (style input) ── */
    .split-layout {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 100vh;
    }
    .split-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 88px 0 64px;
    }
    .split-right { display: none; }

    @media (min-width: 860px) {
      .split-layout { grid-template-columns: 1fr 1fr; gap: 80px; }
      .split-left   { padding: 80px 0; }
      .split-right  {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px 0;
      }
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

    /* ── Results ── */
    .results-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      padding: 72px 0 88px;
    }
    @media (min-width: 860px) {
      .results-layout {
        grid-template-columns: 1fr 1fr;
        gap: 64px;
        align-items: stretch;
        min-height: calc(100vh - 82px);
        padding: 80px 0;
      }
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
  fontSize: 14,
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

const generateStyleWords = async (description, imageBase64 = null) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const system = `You are a style analyst. Given a user's style description or image, choose words that best capture their aesthetic from the list below.

You MUST only choose from this exact list: ${NODE_IDS.join(", ")}

Return ONLY a valid JSON object in exactly this format:
{"words":["word1","word2","word3"],"relevant":["word1","word2","word3","word4","word5","word6","word7","word8","word9","word10","word11","word12","word13","word14","word15","word16","word17","word18","word19","word20"]}

Rules:
- "words": exactly 3 words that BEST define their core aesthetic
- "relevant": exactly 20 words total — include all 3 from "words", plus 17 more that paint a picture of the full aesthetic landscape around this person's taste. Spread these across diverse corners of the style universe: include some closely related words, some in adjacent territories, and a few from contrasting areas that still illuminate who they are by contrast. The goal is a constellation that feels like a natural sky of stars, not a tight cluster.
- All 20 must come from the provided list`;

  const content = imageBase64
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: description ? `Style description: ${description}` : "Analyze the aesthetic in this image." },
      ]
    : description;

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
        max_tokens: 300,
        system,
        messages: [{ role: "user", content }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const match = data.content[0].text.match(/\{[\s\S]*?\}/);
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
    // Ensure all 3 words are in relevant
    const relevantWithWords = [...new Set([...words, ...relevant])].slice(0, 20);
    return { words, relevant: relevantWithWords };
  } catch {
    return null;
  }
};

// ─── CONSTELLATION ────────────────────────────────────────────────────────────
// viewBox is 0 0 100 100 — node x/y map directly to SVG coordinates
const Constellation = ({ highlightedWords, relevantWords }) => {
  const highlighted = new Set(highlightedWords || []);
  const relevant = new Set(relevantWords || []);

  // Determine which nodes to show
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

  // Determine label position to minimize edge-clipping and overlaps
  const getLabelProps = (node) => {
    const onRight = node.x > 58;
    const onTop   = node.y < 12;
    const onBot   = node.y > 88;
    const textAnchor = onRight ? "end" : "start";
    const dx = onRight ? -2.2 : 2.2;
    const dy = onTop ? 4 : onBot ? -3.5 : -2.2;
    return { dx, dy, textAnchor };
  };

  // Three connection lines between highlighted nodes (no filled polygon)
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
        const fill = isH ? "#fff" : showLabels ? "#5a5a5a" : "#333";
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
                fill={isH ? "#fff" : "#555"}
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
              fill={isGlow ? "#fff" : "#555"}
              style={{ transition: "fill 0.35s ease" }}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ─── SHARE CARD ──────────────────────────────────────────────────────────────
const createShareCard = async (words, relevant) => {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  await Promise.all([
    document.fonts.load('italic 400 80px "Playfair Display"'),
    document.fonts.load('300 18px "DM Mono"'),
  ]);

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#fff";
  ctx.font = 'italic 400 72px "Playfair Display", serif';
  ctx.fillText("my style map", 80, 130);

  ctx.fillStyle = "#aaa";
  ctx.font = '300 22px "DM Mono", monospace';
  ctx.fillText("GENERATED BY COVEY", 82, 222);

  const sizes = [120, 104, 90];
  let ty = 360;
  words.forEach((word, i) => {
    ctx.fillStyle = "#fff";
    ctx.font = `italic 400 ${sizes[i] || 74}px "Playfair Display", serif`;
    ctx.fillText(word, 80, ty);
    ty += (sizes[i] || 74) * 1.25;
  });

  // Use relevant nodes; fall back to nearest if not provided
  const relevantIds = relevant && relevant.length > 0 ? relevant : getDefaultRelevant(words);
  const highlighted = new Set(words);
  const visibleNodes = STYLE_NODES.filter(n => relevantIds.includes(n.id));
  const hNodes = visibleNodes.filter(n => highlighted.has(n.id));

  const padL = 80, padR = 80, padTop = 740, padBot = 80;
  const cW = W - padL - padR, cH = H - padTop - padBot;
  // Preserve aspect ratio (nodes live in a 100x100 space — fit square in available area)
  const side = Math.min(cW, cH);
  const offX = padL + (cW - side) / 2;
  const offY = padTop + (cH - side) / 2;
  const cx = (x) => offX + (x / 100) * side;
  const cy = (y) => offY + (y / 100) * side;

  // Three connection lines (no filled triangle)
  if (hNodes.length === 3) {
    const [a, b, c] = hNodes;
    const pairs = [[a, b], [b, c], [a, c]];
    pairs.forEach(([p1, p2]) => {
      ctx.beginPath();
      ctx.moveTo(cx(p1.x), cy(p1.y));
      ctx.lineTo(cx(p2.x), cy(p2.y));
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 9]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  visibleNodes.forEach(node => {
    const isH = highlighted.has(node.id);
    const nx = cx(node.x), ny = cy(node.y);
    if (isH) {
      ctx.beginPath();
      ctx.arc(nx, ny, side * 0.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(nx, ny, isH ? side * 0.013 : side * 0.006, 0, Math.PI * 2);
    ctx.fillStyle = isH ? "#fff" : "#3a3a3a";
    ctx.fill();

    // Label
    const onRight = node.x > 58;
    const onTop   = node.y < 12;
    const onBot   = node.y > 88;
    const ldx = onRight ? -(side * 0.022) : (side * 0.022);
    const ldy = onTop ? (side * 0.04) : onBot ? -(side * 0.035) : -(side * 0.022);
    ctx.fillStyle = isH ? "#fff" : "#4a4a4a";
    ctx.font = `${isH ? "400" : "300"} ${Math.round(side * 0.013)}px "DM Mono", monospace`;
    ctx.textAlign = onRight ? "right" : "left";
    ctx.fillText(node.id, nx + ldx, ny + ldy);
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "#fff";
  ctx.font = '300 22px "DM Mono", monospace';
  ctx.fillText("get your style map at findmycovey.com", 80, H - 48);

  return canvas;
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]                           = useState("home");
  const [name, setName]                           = useState("");
  const [email, setEmail]                         = useState("");
  const [description, setDescription]             = useState("");
  const [photo, setPhoto]                         = useState(null);
  const [photoPreview, setPhotoPreview]           = useState(null);
  const [styleWords, setStyleWords]               = useState([]);
  const [relevantWords, setRelevantWords]         = useState([]);
  const [error, setError]                         = useState("");
  const [sharing, setSharing]                     = useState(false);
  const [waitlistError, setWaitlistError]         = useState("");
  const [typed, setTyped]                         = useState("");
  const [heroReady, setHeroReady]                 = useState(false);
  const fileRef = useRef(null);

  const HERO_TEXT = "shop with people who get it.";

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
      const canvas = await createShareCard(styleWords, relevantWords);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      const file = new File([blob], "my-taste.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "my taste.", text: `my style is ${styleWords.join(", ")}` });
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhoto(await resizeImage(file));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!description.trim() && !photo) { setError("describe your style or add a photo to continue"); return; }
    setError("");
    setStep("generating");

    const [result] = await Promise.all([
      generateStyleWords(description, photo),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]);
    const finalWords    = result?.words    || ["minimal", "editorial", "dark"];
    const finalRelevant = result?.relevant || getDefaultRelevant(finalWords);
    setStyleWords(finalWords);
    setRelevantWords(finalRelevant);
    setStep("email");
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setWaitlistError("please enter your name"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setWaitlistError("please enter a valid email"); return; }
    setWaitlistError("");

    if (supabase) {
      const { error: err } = await supabase.from("signups").insert({
        name: name.trim(),
        email: email.trim(),
        description: description.trim(),
        style_words: styleWords,
      });
      if (err) console.error("Supabase error:", err);
    }

    setStep("results");
  };

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
                    covey
                  </span>
                  <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase" }}>
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
                    a platform where you can connect with others who share your style preferences (your covey) to get personalized style inspiration and recommendations
                  </p>
                  <button onClick={() => setStep("style")} style={{ ...btnStyle, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s both" : "none" }}>
                    Discover your aesthetic →
                  </button>
                  <p style={{ fontSize: 11, color: "#555", marginTop: 16, letterSpacing: "0.04em", lineHeight: 1.6, opacity: heroReady ? 1 : 0, animation: heroReady ? "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.32s both" : "none" }}>
                    sign up to map your style and get early access when we launch
                  </p>
                </div>
              </div>
            )}

            {/* ── STYLE INPUT ──────────────────────────────────────────────── */}
            {step === "style" && (
              <div className="split-layout fade-up">
                <div className="split-left">
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 4vw, 42px)",
                    lineHeight: 1.2,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                  }}>
                    describe your style.
                  </h2>
                  <p style={{ fontSize: 11, color: "#aaa", marginBottom: 36, letterSpacing: "0.04em", lineHeight: 1.6 }}>
                    prose, references, vibes — or just a photo.
                  </p>

                  <form onSubmit={handleGenerate} style={{ width: "100%", maxWidth: 400 }}>
                    <textarea
                      placeholder="I'm drawn to clean lines and dark palettes, vintage pieces with a quiet edge..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={5}
                      style={{ ...inputStyle, resize: "none", height: 130, lineHeight: 1.7, paddingTop: 4 }}
                    />

                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        marginTop: 16,
                        border: "1px dashed #2a2a2a",
                        cursor: "pointer",
                        overflow: "hidden",
                        minHeight: photoPreview ? "auto" : 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {photoPreview
                        ? <img src={photoPreview} alt="style reference" style={{ width: "100%", display: "block", maxHeight: 220, objectFit: "cover" }} />
                        : <p style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.08em" }}>+ add a photo reference</p>
                      }
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />

                    {error && <p style={{ fontSize: 11, color: "#999", marginTop: 10 }}>{error}</p>}
                    <button type="submit" style={{ ...btnStyle, marginTop: 28 }}>generate →</button>
                  </form>
                </div>

                <div className="split-right" style={{ opacity: 0.65 }}>
                  <Constellation highlightedWords={[]} relevantWords={[]} />
                </div>
              </div>
            )}

            {/* ── GENERATING ───────────────────────────────────────────────── */}
            {step === "generating" && (
              <div className="generating-layout fade-in">
                <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#aaa", textTransform: "uppercase" }}>
                  reading your taste...
                </p>
                <div style={{ width: "100%", maxWidth: 560 }}>
                  <AnimatedConstellation />
                </div>
              </div>
            )}

            {/* ── EMAIL GATE ───────────────────────────────────────────────── */}
            {step === "email" && (
              <div className="generating-layout fade-up" style={{ gap: 0 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "#999", marginBottom: 16, textTransform: "uppercase" }}>
                  your style is
                </p>
                {styleWords.map((word, i) => (
                  <div
                    key={word}
                    className="word-reveal"
                    style={{
                      animationDelay: `${i * 0.22}s`,
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "clamp(38px, 5.5vw, 60px)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      textAlign: "center",
                    }}
                  >
                    {word}
                  </div>
                ))}

                <div style={{ marginTop: 52, width: "100%", maxWidth: 400 }}>
                  <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.04em", marginBottom: 28, lineHeight: 1.6, textAlign: "center" }}>
                    enter your email to reveal your style map and get early access when we launch
                  </p>
                  <form onSubmit={handleWaitlist}>
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
                    <div style={{ marginBottom: 24 }}>
                      <input
                        type="email"
                        placeholder="your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={inputStyle}
                        autoComplete="email"
                      />
                    </div>
                    {waitlistError && <p style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>{waitlistError}</p>}
                    <button type="submit" style={{ ...btnStyle, width: "100%", textAlign: "center" }}>
                      reveal my style map →
                    </button>
                  </form>
                </div>
              </div>
            )}

          {/* ── RESULTS ────────────────────────────────────────────────── */}
            {step === "results" && (
              <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "72px 0 88px", minHeight: "calc(100vh - 82px)" }}>
                <h2 style={{
                  fontFamily: "'DM Mono', monospace",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "clamp(11px, 1.4vw, 13px)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: 36,
                  textAlign: "center",
                }}>
                  Your style, mapped.
                </h2>

                {/* Share card preview */}
                <div style={{
                  background: "#0a0a0a",
                  border: "1px solid #2e2e2e",
                  borderRadius: 16,
                  width: "100%",
                  maxWidth: 280,
                  aspectRatio: "9 / 16",
                  padding: "20px 20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 28,
                  flexShrink: 0,
                  overflow: "hidden",
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 18,
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                  }}>my style map</span>
                  <p style={{ fontSize: 9.5, color: "#aaa", letterSpacing: "0.14em", marginBottom: 14, textTransform: "uppercase" }}>
                    generated by covey
                  </p>
                  {styleWords.map((word, i) => (
                    <div key={word} style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: [36, 31, 27][i],
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    }}>
                      {word}
                    </div>
                  ))}
                  <div style={{ flex: 1, marginTop: 12, minHeight: 0 }}>
                    <Constellation highlightedWords={styleWords} relevantWords={relevantWords} />
                  </div>
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
