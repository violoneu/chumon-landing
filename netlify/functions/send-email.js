// netlify/functions/send-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // tighten to your domain if you prefer
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { name, email, phone, message, hp } = data;

    // Simple spam honeypot: if hidden field 'hp' is filled, drop it
    if (hp) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true }),
      };
    }

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields." }),
      };
    }

    // Use a domain you've verified in Resend (ex: noreply@chumon.ca)
    const from = process.env.FROM_EMAIL || "noreply@chumon.ca";
    const to = process.env.TO_EMAIL || "hello@chumon.ca";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
        <h2>Nouveau message du site Chumon</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Courriel:</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone:</strong> ${escapeHtml(phone || "")}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const subject = `Contact site — ${name}`;

    await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: email, // lets you reply directly to the sender
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}

// Tiny HTML escaper
function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
