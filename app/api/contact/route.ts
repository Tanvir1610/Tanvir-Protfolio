import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { Resend } from "resend"

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;
const emailTo = process.env.EMAIL_TO as string;
const emailFrom = process.env.EMAIL_FROM as string;
const resendKey = process.env.RESEND_KEY as string;

let client: MongoClient | null = null
async function getClient() {
  if (client) return client
  if (!uri) throw new Error("Missing MONGODB_URI")
  const c = new MongoClient(uri)
  client = await c.connect()
  return client
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = (body?.name || "").trim()
    const email = (body?.email || "").trim()
    const message = (body?.message || "").trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const cli = await getClient()
    const db = cli.db(dbName || "portfolio")
    const doc = {
      name,
      email,
      message,
      createdAt: new Date(),
      userAgent: req.headers.get("user-agent") || null,
      ip: req.headers.get("x-forwarded-for") || null,
    }
    await db.collection("contacts").insertOne(doc)

    let emailSent = false
    if (!resendKey || !emailTo || !emailFrom) {
      console.log("[v0] contact: missing email env vars; stored in DB but skipped email", {
        hasResendKey: !!resendKey,
        hasEmailTo: !!emailTo,
        hasEmailFrom: !!emailFrom,
      })
    } else {
      try {
        const resend = new Resend(resendKey)
        const result = await resend.emails.send({
          from: emailFrom,
          to: emailTo,
          subject: `New portfolio message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
          reply_to: email, // makes replying easy
        } as any)
        // Resend types differ in some runtimes; safe-check
        if ((result as any)?.error) {
          console.log("[v0] contact: Resend returned error", (result as any).error)
        } else {
          emailSent = true
        }
      } catch (err: any) {
        console.log("[v0] contact: email send failed", err?.message || err)
      }
    }

    return NextResponse.json({ ok: true, emailSent })
  } catch (e: any) {
    console.log("[v0] contact: unexpected error", e?.message || e)
    return NextResponse.json({ error: "failed_to_process" }, { status: 500 })
  }
}
