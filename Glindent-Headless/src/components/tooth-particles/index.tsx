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

    // Create particle elements
    particlesRef.current.forEach((particle, index) => {
      const img = document.createElement("img")
      img.src = "/tooth-icon.png"
      img.style.position = "absolute"
      img.style.width = `${particle.size}px`
      img.style.height = `${particle.size}px`
      img.style.opacity = String(particle.opacity)
      img.style.pointerEvents = "none"
      img.style.left = `${particle.x}px`
      img.style.top = `${particle.y}px`
      img.style.transform = `translate(-50%, -50%) rotate(${particle.rotation}deg)`
      img.dataset.index = String(index)
      container.appendChild(img)
    })

    // Animation loop
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

        // Update DOM element
        const img = container.querySelector(`[data-index="${index}"]`) as HTMLElement
        if (img) {
          img.style.left = `${particle.x}px`
          img.style.top = `${particle.y}px`
          img.style.transform = `translate(-50%, -50%) rotate(${particle.rotation}deg)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      particlesRef.current.forEach((particle) => {
        if (particle.x > window.innerWidth) particle.x = window.innerWidth * Math.random()
        if (particle.y > window.innerHeight) particle.y = window.innerHeight * Math.random()
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
      // Cleanup particle elements
      container.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
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
          will-change: transform, left, top;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  )
}

export default ToothParticles
