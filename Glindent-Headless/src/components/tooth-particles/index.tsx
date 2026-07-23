import React, { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

export function ToothParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize particles (30 for gentle presence)
    const particleCount = 30
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      // Gentle drift
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      // Slightly larger sizes for better visibility
      size: Math.random() * 22 + 14,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.6,
      // Increased opacity for better visibility
      opacity: Math.random() * 0.08 + 0.04
    }))

    // Create particle elements. Position lives entirely in `transform` so the
    // animation loop never touches layout-triggering properties (left/top).
    const elements: HTMLElement[] = particlesRef.current.map((particle) => {
      const img = document.createElement("img")
      img.src = "/tooth-icon.png"
      img.alt = ""
      img.style.position = "absolute"
      img.style.left = "0"
      img.style.top = "0"
      img.style.width = `${particle.size}px`
      img.style.height = `${particle.size}px`
      img.style.opacity = String(particle.opacity)
      img.style.pointerEvents = "none"
      img.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) translate(-50%, -50%) rotate(${particle.rotation}deg)`
      container.appendChild(img)
      return img
    })

    // Animation loop — elements are held by reference, no per-frame DOM queries
    const animate = () => {
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed

        // Wrap around edges
        if (particle.x < -100) particle.x = window.innerWidth + 100
        if (particle.x > window.innerWidth + 100) particle.x = -100
        if (particle.y < -100) particle.y = window.innerHeight + 100
        if (particle.y > window.innerHeight + 100) particle.y = -100

        // Update DOM element (compositor-only property)
        const img = elements[index]
        if (img) {
          img.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0) translate(-50%, -50%) rotate(${particle.rotation}deg)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const start = () => {
      if (animationRef.current === undefined) animate()
    }

    const stop = () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
    }

    // Don't burn CPU while the tab is in the background
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stop()
      else start()
    }

    if (document.visibilityState !== 'hidden') start()

    // Handle window resize
    const handleResize = () => {
      particlesRef.current.forEach((particle) => {
        if (particle.x > window.innerWidth) particle.x = window.innerWidth * Math.random()
        if (particle.y > window.innerHeight) particle.y = window.innerHeight * Math.random()
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      // Cleanup particle elements
      container.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="tooth-particles-container"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      />
      <style jsx global>{`
        .tooth-particles-container img {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  )
}

export default ToothParticles
