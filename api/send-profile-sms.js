import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, archetype, name } = req.body;
  if (!phone || !archetype) return res.status(400).json({ error: "Phone and archetype required" });

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const firstName = name ? name.split(" ")[0] : null;
  const greeting = firstName ? `hey ${firstName}! ` : "";
  const message = `${greeting}your taste profile is ready — you're ${archetype}. see your full results at takethetastetest.com`;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SMS send error:", err.message);
    res.status(400).json({ error: err.message });
  }
}
