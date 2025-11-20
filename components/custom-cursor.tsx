"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true)
      return
    }

    let animationFrameId: number

    const updateCursor = () => {
      // Increased lerp factor from 0.25 to 0.4 for even faster tracking
      positionRef.current.x += (targetPositionRef.current.x - positionRef.current.x) * 0.4
      positionRef.current.y += (targetPositionRef.current.y - positionRef.current.y) * 0.4

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`
      }

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Hide cursor on touch devices
  if (isTouchDevice) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-99999 -ml-2 -mt-2 will-change-transform"
      style={{ contain: "layout style paint" }}
    >
      <div className="h-4 w-4 rounded-full border border-white/80 bg-white/20" />
    </div>
  )
}
