import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const db = await getDb()
    const doc = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
      createdAt: new Date(),
      ip: getIP(req),
      ua: req.headers.get("user-agent") || "",
    }
    await db.collection("contacts").insertOne(doc)

    // Send notification email (optional but recommended)
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const EMAIL_TO = process.env.EMAIL_TO
    const EMAIL_FROM = process.env.EMAIL_FROM || "portfolio@your-domain.com"

    if (RESEND_API_KEY && EMAIL_TO) {
      await sendEmailViaResend(RESEND_API_KEY, {
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject: `New portfolio message from ${doc.name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(doc.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(doc.email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(doc.message).replace(/\n/g, "<br/>")}</p>
          <hr/>
          <small>IP: ${escapeHtml(doc.ip || "")} • UA: ${escapeHtml(doc.ua)}</small>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

function getIP(req: Request) {
  const hdr = (name: string) => (req.headers.get(name) || "").trim()
  return hdr("x-forwarded-for").split(",")[0] || hdr("x-real-ip") || ""
}

async function sendEmailViaResend(key: string, payload: { from: string; to: string; subject: string; html: string }) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    }),
  })
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}
