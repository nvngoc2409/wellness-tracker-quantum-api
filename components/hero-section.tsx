"use client";
import { useState } from "react"
import { DownloadButtons } from "./download-buttons"
import Image from "next/image"
import { AnimatedSection } from "./animated-section"

const screens = [
  { id: 1, src: "/images/2.webp", alt: "Goals & Insights" },
  { id: 2, src: "/images/4.png", alt: "Shapes Company Dashboard" },
  { id: 3, src: "/images/3.webp", alt: "Wellness Tracking" }
]

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handlePhoneClick = (index: number) => {
    if (isAnimating || index === activeIndex) return
    
    setIsAnimating(true)
    setActiveIndex(index)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  const getPhoneStyle = (index: number) => {
    const positions = [
      // Left position
      {
        transform: 'translateX(-180px) translateY(80px) translateZ(-100px) rotateY(25deg) rotateZ(-5deg) scale(0.7)',
        opacity: 0.4,
        zIndex: 1
      },
      // Center position (active)
      {
        transform: 'translateX(0) translateY(0) translateZ(0) rotateY(0deg) rotateZ(0deg) scale(1)',
        opacity: 1,
        zIndex: 10
      },
      // Right position
      {
        transform: 'translateX(180px) translateY(110px) translateZ(-120px) rotateY(-25deg) rotateZ(5deg) scale(0.7)',
        opacity: 0.4,
        zIndex: 1
      }
    ]

    const relativeIndex = (index - activeIndex + 3) % 3
    return positions[relativeIndex]
  }
  return (
    <section className="relative pt-[8.5rem] pb-20 lg:pb-32 lg:pt-[11.5rem] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatedSection key={1} animation="fade-left" delay={1 * 100}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-purple-200">AI-Powered Wellness</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Transform Your</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Well-Being
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience personalized audio therapy powered by AI. Track your mood, energy, stress, and sleep — then
                receive brainwave-stimulating frequencies tailored just for you.
              </p>

              <DownloadButtons />

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10 pt-10 border-t border-purple-900/30">
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="w-px h-10 bg-purple-900/30" />
                <div>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-sm text-muted-foreground">App Rating</div>
                </div>
                <div className="w-px h-10 bg-purple-900/30" />
                <div>
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-muted-foreground">Audio Tracks</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection key={"hero2"} animation="fade-right" delay={1 * 100}>
            {/* App Preview - 3D Layout */}
            <div className="relative flex justify-center items-center min-h-[700px]">
            {/* Decorative Elements */}
            <div className="absolute top-10 -left-10 w-20 h-20 pointer-events-none">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl rotate-12 opacity-60 blur-sm animate-pulse" />
            </div>
            
            <div className="absolute -top-5 left-20 w-12 h-12 pointer-events-none">
              <svg viewBox="0 0 50 50" className="w-full h-full text-cyan-400 opacity-70">
                <polygon points="25,5 45,45 5,45" fill="currentColor" />
              </svg>
            </div>

            <div className="absolute bottom-20 -left-5 pointer-events-none">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-yellow-400 opacity-70" />
                ))}
              </div>
            </div>

            <div className="absolute top-1/4 -right-10 w-32 h-32 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full text-blue-500 opacity-50">
                <polygon points="50,15 90,85 10,85" fill="currentColor" />
              </svg>
            </div>

            {/* Main Phone Container */}
            <div className="relative w-full max-w-md min-h-[700px] flex items-center justify-center" style={{ perspective: '1200px' }}>
              {/* Glow effect for center phone */}
              <div className="absolute inset-0 -inset-6 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-cyan-600/30 rounded-[3rem] blur-3xl animate-pulse pointer-events-none" 
                   style={{ 
                     opacity: 1,
                     zIndex: 5 
                   }} 
              />

              {/* Phone mockups */}
              {screens.map((screen, index) => {
                const style = getPhoneStyle(index)
                const isCenter = (index - activeIndex + 3) % 3 === 1
                
                return (
                  <div
                    key={screen.id}
                    className={`absolute transition-all duration-600 ease-out ${
                      isCenter ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                    }`}
                    style={{
                      ...style,
                      transformStyle: 'preserve-3d',
                      pointerEvents: isAnimating ? 'none' : 'auto'
                    }}
                    onClick={() => handlePhoneClick(index)}
                  >
                    <div className={`w-[300px] md:w-[340px] h-[620px] md:h-[700px] rounded-[3rem] bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-2xl ${
                      isCenter ? 'ring-2 ring-purple-500/50' : ''
                    }`}>
                      {/* Phone notch */}
                      {isCenter && (
                        <div className="absolute left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-10" />
                      )}
                      
                      <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-950 relative">
                        <Image
                          src={screen.src}
                          alt={screen.alt}
                          fill
                          sizes="( max-width: 768px ) 300px, 340px"
                          className="w-full h-full object-cover"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
