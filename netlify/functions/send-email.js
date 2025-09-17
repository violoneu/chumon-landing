// netlify/functions/send-email.js
// CommonJS, zero external deps
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
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
    const { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } = process.env;
    if (!RESEND_API_KEY) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing RESEND_API_KEY" }),
      };
    }

    const data = JSON.parse(event.body || "{}");
    const { name, email, phone, message, hp } = data;

    // honeypot
    if (hp) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true }),
      };
    }

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields." }),
      };
    }

    const from = FROM_EMAIL || "noreply@chumon.ca";
    const to = TO_EMAIL || "hello@chumon.ca";
    const subject = `Contact site — ${name}`;
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

    // Resend HTTP API
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        reply_to: email, // Resend supports snake_case
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("Resend error:", resp.status, errText);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Email provider error" }),
      };
    }

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
};

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
