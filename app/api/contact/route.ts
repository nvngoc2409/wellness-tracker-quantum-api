import { NextResponse } from "next/server"
import { google } from "googleapis"

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

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // Prepare row data
    const timestamp = new Date().toISOString()
    const rowData = [timestamp, name, email, subject, message]

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:E", // Assumes columns: Timestamp, Name, Email, Subject, Message
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    })

    return NextResponse.json({ success: true, message: "Form submitted successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit form. Please try again later." }, { status: 500 })
  }
}
