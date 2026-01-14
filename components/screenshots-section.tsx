"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const screenshots = [
  {
    id: 1,
    title: "Goals & Insights",
    description: "AI-powered wellness recommendations",
    image: "/images/1.webp",
  },
  {
    id: 2,
    title: "Scalar Energy",
    description: "Select healing frequencies",
    image: "/images/2.webp",
  },
  {
    id: 3,
    title: "Quantum Therapy",
    description: "Browse healing sessions",
    image: "/images/3.webp",
  },
  {
    id: 4,
    title: "Audio Player",
    description: "Immersive playback experience",
    image: "/images/4.png",
  },
]

export function ScreenshotsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="screenshots" className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Experience the </span>
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Beautiful Interface
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A stunning, intuitive design that makes tracking your wellness and exploring audio therapy a pleasure.
          </p>
        </div>

        {/* Screenshots Carousel */}
        <div className="relative">
          {/* Main display */}
          <div className="flex justify-center items-center gap-4 md:gap-8">
            {screenshots.map((screenshot, index) => {
              const isActive = index === activeIndex
              const isPrev = index === (activeIndex - 1 + screenshots.length) % screenshots.length
              const isNext = index === (activeIndex + 1) % screenshots.length
              const isVisible = isActive || isPrev || isNext

              return (
                <div
                  key={screenshot.id}
                  className={cn(
                    "transition-all duration-500 cursor-pointer",
                    isActive && "z-20 scale-100",
                    isPrev && "z-10 scale-75 opacity-50 -translate-x-4 hidden md:block",
                    isNext && "z-10 scale-75 opacity-50 translate-x-4 hidden md:block",
                    !isVisible && "hidden",
                  )}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    className={cn(
                      "relative rounded-[2rem] overflow-hidden shadow-2xl",
                      isActive && "w-[260px] md:w-[300px] h-[520px] md:h-[600px]",
                      !isActive && "w-[200px] h-[400px]",
                    )}
                  >
                    {/* Glow effect for active */}
                    {isActive && (
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-cyan-600/40 rounded-[2.5rem] blur-xl" />
                    )}

                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-gray-900 border-4 border-gray-800">
                      <Image
                        src={screenshot.image || "/placeholder.svg"}
                        alt={screenshot.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((screenshot, index) => (
              <button
                key={screenshot.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "transition-all duration-300",
                  index === activeIndex
                    ? "w-8 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`View ${screenshot.title}`}
              />
            ))}
          </div>

          {/* Active screenshot info */}
          <div className="text-center mt-6">
            <h3 className="text-xl font-semibold text-white">{screenshots[activeIndex].title}</h3>
            <p className="text-muted-foreground">{screenshots[activeIndex].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
