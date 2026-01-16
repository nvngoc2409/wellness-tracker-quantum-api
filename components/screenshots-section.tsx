"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/animated-section"

const ITEM_WIDTH = 260
const GAP = 24 // gap-6 = 24px

const screenshots = [
  { id: 1, title: "Goals & Insights", description: "AI-powered wellness", image: "/images/1.webp" },
  { id: 2, title: "Scalar Energy", description: "Healing frequencies", image: "/images/2.webp" },
  { id: 3, title: "Quantum Therapy", description: "Healing sessions", image: "/images/3.webp" },
  { id: 4, title: "Audio Player", description: "Immersive playback", image: "/images/4.png" },
]

export function ScreenshotsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      setContainerWidth(containerRef.current!.offsetWidth)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const translateX =
    containerWidth / 2 -
    ITEM_WIDTH / 2 -
    activeIndex * (ITEM_WIDTH + GAP)

  return (
    <section id="screenshots" className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="scale">
          <div ref={containerRef} className="relative overflow-hidden">
            {/* Track */}
            <div
              className="flex flex-nowrap gap-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {screenshots.map((s, index) => {
                const isActive = index === activeIndex

                return (
                  <div
                    key={s.id}
                    className={cn(
                      "shrink-0 cursor-pointer transition-all duration-500",
                      isActive ? "scale-100 opacity-100" : "scale-90 opacity-40",
                    )}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div className="relative w-[260px] h-[520px] rounded-[2rem] overflow-hidden shadow-2xl">
                      {isActive && (
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-cyan-600/40 rounded-[2.5rem] blur-xl" />
                      )}

                      <div className="relative w-full h-full bg-gray-900 border-4 border-gray-800 rounded-[2rem] overflow-hidden">
                        <Image src={s.image} alt={s.title} fill sizes="auto" className="object-cover" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "transition-all duration-300",
                    index === activeIndex
                      ? "w-8 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-2 h-2 rounded-full bg-muted-foreground/30",
                  )}
                />
              ))}
            </div>

            {/* Info */}
            <div className="text-center mt-6">
              <h3 className="text-xl font-semibold text-white">
                {screenshots[activeIndex].title}
              </h3>
              <p className="text-muted-foreground">
                {screenshots[activeIndex].description}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
