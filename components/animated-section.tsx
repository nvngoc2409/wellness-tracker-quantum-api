"use client"

import type React from "react"

import { useScrollAnimation } from "../hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-in"
    | "fade-left"
    | "fade-right"
    | "scale"
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  animation = "fade-up",
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  })

  const animationClasses = {
    "fade-up": {
      initial: "opacity-0 translate-y-10",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      initial: "opacity-0 -translate-y-10",
      visible: "opacity-100 translate-y-0",
    },
    "fade-in": {
      initial: "opacity-0",
      visible: "opacity-100",
    },
    "fade-left": {
      initial: "opacity-0 -translate-x-20",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      initial: "opacity-0 translate-x-20",
      visible: "opacity-100 translate-x-0",
    },
    scale: {
      initial: "opacity-0 scale-80",
      visible: "opacity-100 scale-110",
    },
  } as const

  const { initial, visible } = animationClasses[animation]

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        isVisible ? visible : initial,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
