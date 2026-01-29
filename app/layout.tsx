import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "WellQ - AI-Powered Quantum Wellness Tracker",
  description:
    "Transform your well-being with WellQ, an intelligent wellness companion that uses advanced AI analysis to provide personalized audio therapy recommendations.",
  generator: "v0.app",

  icons: {
    icon: "/images/icons/wellq_icon_2.jpg",
    apple: "/images/icons/wellq_icon_2.jpg",
  },

  // iOS Smart App Banner
  other: {
    "apple-itunes-app": "app-id=6755653422",
  },

  // Android App link
  alternates: {
    types: {
      "android-app": "android-app://com.wellquantum",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
