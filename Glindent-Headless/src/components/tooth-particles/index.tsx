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

// ToothParticles - Floating tooth icon overlay effect
export function ToothParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === 'undefined') return

    // Initialize particles - gentle floating effect
    const particleCount = 25
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      // Gentle drift
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      // Varied sizes
      size: Math.random() * 24 + 12,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      // Low opacity for subtle effect
      opacity: Math.random() * 0.045 + 0.015
    }))

    // Create particle elements
    particlesRef.current.forEach((particle, index) => {
      const img = document.createElement("img")
      img.src = "/tooth-icon.png"
      img.style.cssText = `
        position: absolute;
        width: ${particle.size}px;
        height: ${particle.size}px;
        opacity: ${particle.opacity};
        pointer-events: none;
        left: ${particle.x}px;
        top: ${particle.y}px;
        transform: translate(-50%, -50%) rotate(${particle.rotation}deg);
        will-change: transform, left, top;
      `
      img.dataset.index = String(index)
      container.appendChild(img)
    })

    // Animation loop
    const animate = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed

        // Wrap around edges
        if (particle.x < -100) particle.x = width + 100
        if (particle.x > width + 100) particle.x = -100
        if (particle.y < -100) particle.y = height + 100
        if (particle.y > height + 100) particle.y = -100

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
      // Clean up particle elements
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  // Add scroll-based interaction
  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? 1 : -1
      lastScrollY = currentScrollY

      // Add temporary velocity boost to particles based on scroll
      particlesRef.current.forEach((particle) => {
        particle.vy += direction * (Math.random() * 0.3 + 0.1)
        particle.vx += (Math.random() - 0.5) * 0.2
      })

      // Gradually slow down particles
      setTimeout(() => {
        particlesRef.current.forEach((particle) => {
          particle.vx *= 0.95
          particle.vy *= 0.95
          if (Math.abs(particle.vx) < 0.15) particle.vx = (Math.random() - 0.5) * 0.25
          if (Math.abs(particle.vy) < 0.15) particle.vy = (Math.random() - 0.5) * 0.25
        })
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
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
  )
}

export default ToothParticles
