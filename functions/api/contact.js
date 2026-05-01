const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "hello@abhinv.in";
const DEFAULT_FROM_EMAIL = "Portfolio <hello@abhinv.in>";

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8"
  }
});

const clean = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function onRequestGet(context) {
  const { env } = context;
  return json({
    ok: true,
    configured: Boolean(env.RESEND_API_KEY),
    toEmail: clean(env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL, 200),
    fromEmail: clean(env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL, 200)
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "Email service is not configured." }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const website = clean(payload.website, 200);
  if (website) {
    return json({ ok: true });
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 160);
  const message = clean(payload.message, 4000);

  if (!name || !email || !message) {
    return json({ ok: false, error: "Please add your name, email, and message." }, 400);
  }

  if (!isEmail(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 400);
  }

  const toEmail = clean(env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL, 200);
  const fromEmail = clean(env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL, 200);
  const subject = `Portfolio enquiry from ${name}`;
  const text = [
    "New portfolio enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message
  ].join("\n");

  const html = `
    <div style="font-family:Georgia,serif;line-height:1.55;color:#1a1916">
      <h2 style="margin:0 0 12px">New portfolio enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr style="border:0;border-top:1px solid #d6ccbd;margin:18px 0">
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html
    })
  });

  if (!resendResponse.ok) {
    let error = "Could not send message right now.";
    try {
      const data = await resendResponse.json();
      error = data.message || error;
    } catch {
      // Resend returned a non-JSON error. Keep the public message generic.
    }
    return json({ ok: false, error }, 502);
  }

  return json({ ok: true });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
