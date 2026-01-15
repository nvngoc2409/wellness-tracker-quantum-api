import { NextResponse } from "next/server"

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check for required environment variables
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const sheetId = process.env.GOOGLE_SHEET_ID

    if (!serviceAccountEmail || !privateKey || !sheetId) {
      console.error("Missing Google Sheets configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Generate JWT token for Google API authentication
    const jwt = await createJWT(serviceAccountEmail, privateKey.replace(/\\n/g, "\n"))

    // Get access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token")
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Prepare row data
    const timestamp = new Date().toISOString()
    const rowData = [timestamp, name, email, subject, message]

    // Append data to the sheet using Google Sheets API v4
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:E:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      },
    )

    if (!appendResponse.ok) {
      const errorData = await appendResponse.json()
      console.error("Google Sheets API error:", errorData)
      throw new Error("Failed to append data to sheet")
    }

    return NextResponse.json({ success: true, message: "Form submitted successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit form. Please try again later." }, { status: 500 })
  }
}

// Helper function to create JWT for Google API authentication (Node 18 compatible)
async function createJWT(clientEmail: string, privateKey: string): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600, // 1 hour expiration
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`

  // Sign with RSA-SHA256 using Web Crypto API (Node 18 compatible)
  const signature = await signWithRSA(unsignedToken, privateKey)

  return `${unsignedToken}.${signature}`
}

function base64UrlEncode(str: string): string {
  const base64 = Buffer.from(str).toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function signWithRSA(data: string, privateKeyPem: string): Promise<string> {
  // Import the private key
  const pemContents = privateKeyPem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "")

  const binaryKey = Buffer.from(pemContents, "base64")

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  )

  // Sign the data
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, dataBuffer)

  // Convert to base64url
  const signature = Buffer.from(signatureBuffer).toString("base64")
  return signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
