"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/animated-section"

const ITEM_WIDTH = 260
const GAP = 24
const AUTO_PLAY_INTERVAL = 4000
const RESTART_DELAY = 6000

interface Screenshot {
  id: number
  image: string
}

/**
 * Tính offset ngắn nhất trong carousel vòng tròn
 */
function getShortestOffset(
  target: number,
  current: number,
  total: number
) {
  const forward = (target - current + total) % total
  const backward = forward - total

  return Math.abs(forward) <= Math.abs(backward)
    ? forward
    : backward
}

export function ScreenshotsSection() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch("/api/screenshots")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setScreenshots(data)
          setIsInitialized(true)
        }
      })
      .catch(err => console.error(err))
  }, [])

  /* ================= AUTOPLAY ================= */
  const clearTimers = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }, [])

  const startAutoPlay = useCallback(() => {
    clearTimers()
    if (screenshots.length <= 1 || !isInitialized) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % screenshots.length)
    }, AUTO_PLAY_INTERVAL)
  }, [screenshots.length, isInitialized, clearTimers])

  useEffect(() => {
    startAutoPlay()
    return () => clearTimers()
  }, [startAutoPlay, clearTimers])

  const goToIndex = useCallback(
    (newIndex: number, fromUser = false) => {
      clearTimers()
      setCurrentIndex(newIndex)

      if (fromUser) {
        setTimeout(startAutoPlay, RESTART_DELAY)
      }
    },
    [clearTimers, startAutoPlay]
  )

  /* ================= VISIBLE ITEMS ================= */
  const getVisibleScreenshots = () => {
    const total = screenshots.length
    if (!total) return []

    const itemsToShow = Math.min(5, total)
    const sideCount = Math.floor(itemsToShow / 2)

    return screenshots
      .map((item, index) => {
        const offset = getShortestOffset(index, currentIndex, total)
        return {
          ...item,
          originalIndex: index,
          offset,
        }
      })
      .filter(item => Math.abs(item.offset) <= sideCount)
  }

  const visibleItems = getVisibleScreenshots()

  if (!isInitialized) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        Screens not found.
      </section>
    )
  }

  /* ================= RENDER ================= */
  return (
    <section
      id="screenshots"
      className="py-20 lg:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection animation="scale" className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              WellQ screens
            </span>
          </h2>
          <div className="relative">
            {/* CAROUSEL */}
            <div className="relative h-[560px] flex justify-center items-center">
              {visibleItems.map(item => {
                const abs = Math.abs(item.offset)

                const scale =
                  abs === 0 ? 1 : abs === 1 ? 0.82 : 0.68

                const opacity =
                  abs === 0 ? 1 : abs === 1 ? 0.65 : 0.4

                const translateX =
                  item.offset * (ITEM_WIDTH + GAP)

                return (
                  <div
                    key={`${item.id}-${item.originalIndex}`}
                    className={cn(
                      "absolute cursor-pointer select-none",
                      "will-change-transform",
                      abs === 0 && "z-20"
                    )}
                    style={{
                      width: ITEM_WIDTH,
                      transform: `
                        translateX(${translateX}px)
                        scale(${scale})
                      `,
                      opacity,
                      transition: `
                        transform 700ms cubic-bezier(0.22,1,0.36,1),
                        opacity 500ms ease-out
                      `,
                    }}
                    onClick={() =>
                      item.originalIndex !== currentIndex &&
                      goToIndex(item.originalIndex, true)
                    }
                  >
                    <div className="relative w-full aspect-[9/19] max-h-[520px] rounded-[2.5rem] overflow-hidden bg-black border-8 border-gray-800 shadow-2xl">
                      {/* Glow cho item active */}
                      {abs === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-cyan-500/30 blur-2xl -z-10 animate-pulse-slow" />
                      )}

                      <Image
                        src={item.image}
                        alt={`Screenshot ${item.id}`}
                        fill
                        sizes="260px"
                        className="object-cover"
                        priority={abs === 0}
                        draggable={false}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-3 mt-10">
              {screenshots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx, true)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    idx === currentIndex
                      ? "w-10 h-3 bg-gradient-to-r from-purple-500 to-pink-500"
                      : "w-3 h-3 bg-gray-500/40 hover:bg-gray-400/60"
                  )}
                  aria-label={`Screenshot ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
