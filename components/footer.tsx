"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import React from "react"

export function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <footer className="border-t border-purple-900/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="3" className="fill-white/80" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" className="stroke-cyan-400" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" className="stroke-cyan-400" />
                  <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" className="stroke-cyan-400" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                WellQ
              </span>
            </Link>

            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Transform your well-being with AI-powered wellness tracking and quantum audio therapy.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a className="text-muted-foreground hover:text-foreground"><Facebook size={20} /></a>
              <a className="text-muted-foreground hover:text-foreground"><Twitter size={20} /></a>
              <a className="text-muted-foreground hover:text-foreground"><Instagram size={20} /></a>
              <a className="text-muted-foreground hover:text-foreground"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" onClick={(e) => handleScroll(e, "#features")} className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" onClick={(e) => handleScroll(e, "#how-it-works")} className="text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#download"
                  onClick={(e) => handleScroll(e, "#download")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Download
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="https://wellq.smexapp.com/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#download"
                  onClick={(e) => handleScroll(e, "#download")} className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-900/50 mt-12 pt-8 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} WellQ. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
