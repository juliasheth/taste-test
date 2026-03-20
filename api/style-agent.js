import twilio from "twilio";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── SYSTEM PROMPTS ──────────────────────────────────────────────────────────
// Add new conversation types here as the agent grows.

function buildSystemPrompt(type, profile) {
  const name = profile?.name ? profile.name.split(" ")[0] : "there";
  const archetype = profile?.archetype || "a unique personal style";

  const base = `You are a personal stylist texting with ${name}. Their taste profile is: ${archetype}. Keep all responses conversational and text-appropriate — no markdown, no bullet symbols, just clean plain text.`;

  if (type === "style_session") {
    return `${base}

When they ask for product recommendations, use web_search to find specific items. Search across:
- Premium retailers: Nordstrom, REVOLVE, SSENSE, Shopbop, Bloomingdale's, Saks Fifth Avenue
- Resale platforms: ThredUp, Poshmark, Depop, The RealReal, Vestiaire Collective
- Smaller or indie brands that match their aesthetic

Format product recs like this (one per line, no extra symbols):
Item name — Brand — Price — URL

Max 3-4 items per reply. If they send a photo, acknowledge what you see and use it to inform your recommendations.`;
  }

  // Future types: 'proactive_outreach', 'profile_update', 'check_in'
  return base;
}

// ─── MEDIA HELPERS ───────────────────────────────────────────────────────────

async function downloadAndStoreMedia(twilioMediaUrl, phone, contentType) {
  const mediaRes = await fetch(twilioMediaUrl, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString("base64")}`,
    },
  });

  if (!mediaRes.ok) throw new Error(`Failed to fetch media: ${mediaRes.status}`);

  const buffer = await mediaRes.arrayBuffer();
  const ext = contentType.split("/")[1] || "jpg";
  const filename = `${phone.replace("+", "")}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("user-media")
    .upload(filename, buffer, { contentType });

  if (error) throw new Error(`Supabase storage error: ${error.message}`);

  return filename;
}

async function getSignedUrl(path) {
  const { data } = await supabase.storage
    .from("user-media")
    .createSignedUrl(path, 300); // valid for 5 minutes — enough for Claude to fetch
  return data?.signedUrl || null;
}

// ─── CONVERSATION HELPERS ────────────────────────────────────────────────────

async function findOrCreateConversation(phone) {
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("phone", phone)
    .in("status", ["active", "waiting_for_user"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) return existing;

  const { data: created } = await supabase
    .from("conversations")
    .insert({ phone, type: "style_session", initiated_by: "user" })
    .select()
    .single();

  return created;
}

async function loadHistory(conversationId) {
  const { data } = await supabase
    .from("messages")
    .select("role, content, metadata")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data || [];
}

async function loadProfile(phone) {
  const { data } = await supabase
    .from("submissions")
    .select("name, archetype")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data || {};
}

// ─── BUILD CLAUDE MESSAGES ───────────────────────────────────────────────────

async function buildClaudeMessages(history) {
  const messages = [];

  for (const msg of history) {
    const mediaUrls = msg.metadata?.media_urls || [];

    if (msg.role === "user" && mediaUrls.length > 0) {
      // Build a multimodal message with text + images
      const content = [];

      if (msg.content) content.push({ type: "text", text: msg.content });

      for (const path of mediaUrls) {
        const signedUrl = await getSignedUrl(path);
        if (signedUrl) {
          content.push({ type: "image", source: { type: "url", url: signedUrl } });
        }
      }

      messages.push({ role: "user", content });
    } else {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  return messages;
}

// ─── TWIML RESPONSE HELPERS ──────────────────────────────────────────────────

function twimlMessage(res, text) {
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${text}</Message></Response>`
  );
}

function twimlEmpty(res) {
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Validate the request is genuinely from Twilio
  const valid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    req.headers["x-twilio-signature"],
    `https://${req.headers.host}/api/style-agent`,
    req.body
  );
  if (!valid) return res.status(403).json({ error: "Invalid Twilio signature" });

  const phone = req.body.From;
  const messageBody = req.body.Body || "";
  const numMedia = parseInt(req.body.NumMedia || "0");

  try {
    // 1. Download any photos and store in Supabase Storage
    const mediaStoragePaths = [];
    for (let i = 0; i < numMedia; i++) {
      const contentType = req.body[`MediaContentType${i}`];
      if (contentType?.startsWith("image/")) {
        const path = await downloadAndStoreMedia(
          req.body[`MediaUrl${i}`],
          phone,
          contentType
        );
        mediaStoragePaths.push(path);
      }
    }

    // 2. Find or create an active conversation
    const conversation = await findOrCreateConversation(phone);

    // 3. Save the incoming user message
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      role: "user",
      content: messageBody,
      metadata: mediaStoragePaths.length ? { media_urls: mediaStoragePaths } : {},
    });

    // 4. Load full conversation history + user profile
    const [history, profile] = await Promise.all([
      loadHistory(conversation.id),
      loadProfile(phone),
    ]);

    // 5. Build Claude-compatible message array (handles images via signed URLs)
    const claudeMessages = await buildClaudeMessages(history);

    // 6. Call Claude with web search
    const systemPrompt = buildSystemPrompt(conversation.type, profile);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: claudeMessages,
    });

    // Extract the final text response (after any tool use)
    const assistantText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    // 7. Save assistant message (with tool call log for debugging)
    const toolCalls = response.content.filter((b) => b.type !== "text");
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      role: "assistant",
      content: assistantText,
      tool_calls: toolCalls.length ? toolCalls : null,
    });

    // 8. Mark conversation as waiting for the user's next reply
    await supabase
      .from("conversations")
      .update({ status: "waiting_for_user", updated_at: new Date().toISOString() })
      .eq("id", conversation.id);

    // 9. Respond to Twilio with the reply — TwiML delivers it directly
    twimlMessage(res, assistantText);
  } catch (err) {
    console.error("Style agent error:", err);
    twimlMessage(res, "sorry, something went wrong on my end. try again in a moment!");
  }
}
