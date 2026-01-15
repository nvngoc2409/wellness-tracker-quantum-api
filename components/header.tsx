"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/30 border-b border-purple-900/50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/app-icon.png" alt="WellQ App Icon" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              WellQ
            </span>
          </Link>

          {/* Desktop Navigation - Use onClick with smooth scroll */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => handleScroll(e, "#features")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScroll(e, "#how-it-works")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#screenshots"
              onClick={(e) => handleScroll(e, "#screenshots")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Screenshots
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Contact
            </a>
            <a
              href="#download"
              onClick={(e) => handleScroll(e, "#download")}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Download
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0"
              onClick={() => {
                const element = document.getElementById("download")
                if (element) {
                  const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80
                  window.scrollTo({ top: offsetTop, behavior: "smooth" })
                }
              }}
            >
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu - Use onClick with smooth scroll */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-900/50 pt-4">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={(e) => handleScroll(e, "#features")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleScroll(e, "#how-it-works")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                How It Works
              </a>
              <a
                href="#screenshots"
                onClick={(e) => handleScroll(e, "#screenshots")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Screenshots
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Contact
              </a>
              <a
                href="#download"
                onClick={(e) => handleScroll(e, "#download")}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Download
              </a>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 w-full">
                Get Started Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
