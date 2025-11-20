"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { ToothParticles } from "@/components/tooth-particles"
import { AboutSection } from "@/components/sections/about-section"
import { ProductsSection } from "@/components/sections/products-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FAQSection } from "@/components/sections/faq-section"
import { GlindentLogo } from "@/components/glindent-logo"
import { ChevronDown } from "lucide-react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Framer Motion values for smooth animations
  const x = useMotionValue(0)
  const springX = useSpring(x, { 
    stiffness: 300, 
    damping: 30,
    mass: 0.8 
  })
  
  // Parallax gradient that follows scroll position - initialize at correct position
  const gradientX = useMotionValue(0)
  const springGradientX = useSpring(gradientX, { stiffness: 80, damping: 20 })
  
  const isAnimating = useRef(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    setIsLoaded(true)
    // Initialize gradient position on mount
    gradientX.set(0)
  }, [])

  // Update gradient position based on horizontal scroll
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      // Move gradient opposite to scroll direction for parallax effect
      // Increased scale factor for faster, more visible color changes
      gradientX.set(latest * 0.5)
    })

    return () => unsubscribe()
  }, [x, gradientX])

  const scrollToSection = (index: number) => {
    if (index < 0 || index > 4 || isAnimating.current) return
    
    isAnimating.current = true
    setCurrentSection(index)
    
    const targetX = -index * (typeof window !== 'undefined' ? window.innerWidth : 0)
    
    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      onComplete: () => {
        isAnimating.current = false
      }
    })
  }

  // Touch gesture navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchStartX.current - touchEndX
      const deltaY = touchStartY.current - touchEndY

      // Horizontal swipe detected
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (deltaX < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  // Wheel navigation with smooth transitions
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null
    let accumulatedDelta = 0

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Ignore wheel events during animation
      if (isAnimating.current) return

      // Accumulate scroll delta
      accumulatedDelta += e.deltaY

      // Clear existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }

      // After user stops scrolling for 150ms, decide direction
      wheelTimeout = setTimeout(() => {
        const threshold = 50

        if (accumulatedDelta > threshold && currentSection < 4) {
          scrollToSection(currentSection + 1)
        } else if (accumulatedDelta < -threshold && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }

        accumulatedDelta = 0
      }, 150)
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [currentSection])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault()
        if (currentSection < 4) {
          scrollToSection(currentSection + 1)
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        if (currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      } else if (e.key === "Home") {
        e.preventDefault()
        scrollToSection(0)
      } else if (e.key === "End") {
        e.preventDefault()
        scrollToSection(4)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#00A89A]">
      <CustomCursor />
      <GrainOverlay />
      <ToothParticles currentSection={currentSection} />

      {/* Static Gradient Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(315deg, #00A89A 0%, #3ACCFF 100%)',
          transform: 'translateX(0px)',
          width: '500%',
          left: '-100%'
        }}
      />
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          x: springGradientX,
          background: 'linear-gradient(315deg, #00A89A 0%, #3ACCFF 100%)',
          width: '500%',
          left: '-100%',
          willChange: 'transform',
          opacity: isLoaded ? 1 : 0
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/20" />

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-12 md:py-6 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid var(--header-border)',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingTop: 'max(1rem, env(safe-area-inset-top))'
        }}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform active:scale-95 touch-manipulation min-h-11"
        >
          <GlindentLogo variant="white" className="h-7 sm:h-8 md:h-9 w-auto" />
        </button>

        <div className="hidden items-center gap-4 sm:gap-6 md:gap-8 lg:flex">
          {["Home", "About Us", "Products", "FAQ", "Contact"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollToSection(2)}
          className="hidden lg:block font-sans text-sm font-medium text-foreground/80 transition-colors hover:text-foreground active:text-foreground touch-manipulation min-h-11 px-4"
        >
          Shop Now
        </button>
        
        {/* Mobile Navigation Dots */}
        <div className="flex lg:hidden items-center gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className="touch-manipulation p-2"
              aria-label={`Go to section ${index + 1}`}
            >
              <div className={`w-2 h-2 rounded-full transition-all ${
                currentSection === index 
                  ? 'bg-foreground w-6' 
                  : 'bg-foreground/30'
              }`} />
            </button>
          ))}
        </div>
      </nav>

      <motion.div
        ref={scrollContainerRef}
        style={{ x: springX }}
        className={`relative z-10 flex h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <section 
          className="relative flex min-h-screen w-screen shrink-0 flex-col px-4 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
          }}
        >
          <div className="relative z-10 flex h-full flex-col justify-start">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 pt-4 md:pt-8 lg:items-start">
              {/* Image Area - First on mobile, second on desktop */}
              <div className="relative block lg:order-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 self-start">
                <div className="relative w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px]">
                  {/* Glass effect container */}
                  <div className="glass absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <Image
                      src="/hero-dental.jpg"
                      alt="Professional dental care - Patient receiving quality dental treatment"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -inset-4 bg-linear-to-br from-primary/20 to-accent/20 rounded-2xl sm:rounded-3xl blur-2xl -z-10 opacity-50" />
                </div>
              </div>

              {/* Text Content - Second on mobile, first on desktop */}
              <div className="flex flex-col justify-start max-w-3xl lg:order-1">
                <div className="glass mb-4 sm:mb-6 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-2xl px-3 py-1.5 sm:px-4 duration-700 w-fit">
                  <p className="text-xs sm:text-sm leading-none text-white">High-Quality Dental Supplies</p>
                </div>
                <h1 className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-white duration-1000">
                  <span className="text-balance">
                    Where quality
                    <br />
                    meets care
                  </span>
                </h1>
                <p className="mb-6 sm:mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-sm sm:text-base md:text-lg leading-relaxed text-white/95 duration-1000 delay-200">
                  <span className="text-pretty">
                    We believe dental professionals deserve materials they can trust. That's why Glindent delivers
                    world-class products, supported by responsive service and a commitment to helping you achieve the best
                    results for your patients.
                  </span>
                </p>

                <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 sm:gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
                  <Link href="/products" className="w-full sm:w-auto">
                    <MagneticButton size="lg" variant="primary" className="w-full sm:w-auto min-h-12">
                      Shop Now
                    </MagneticButton>
                  </Link>
                  <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(4)} className="w-full sm:w-auto min-h-12">
                    Contact Us
                  </MagneticButton>
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection(1)}
              className="mt-auto mb-8 flex flex-col items-center gap-2 transition-transform duration-1000 delay-500 hover:scale-105 animate-in fade-in lg:self-start"
            >
              <p className="text-[13px] font-medium text-white/90">Scroll to explore</p>
              <div className="animate-bounce">
                <ChevronDown className="h-5 w-5 text-white/90" strokeWidth={2} />
              </div>
            </button>
          </div>
        </section>

        <AboutSection scrollToSection={scrollToSection} />
        <ProductsSection />
        <FAQSection />
        <ContactSection />
      </motion.div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
