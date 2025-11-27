"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { ToothParticles } from "@/components/tooth-particles"
import { AnimatedBackground } from "@/components/animated-background"
import { AboutSection } from "@/components/sections/about-section"
import { ProductsSection } from "@/components/sections/products-section"
import { ContactSection } from "@/components/sections/contact-section"
import { HeroSlider } from "@/components/hero-slider"
import { useRef, useEffect, useState } from "react"
import { FAQSection } from "@/components/sections/faq-section"
import { GlindentLogo } from "@/components/glindent-logo"
import { motion, useMotionValue, useSpring, animate, AnimatePresence } from "framer-motion"
import { CartMenu } from "@/components/cart-menu"
import { Menu, X } from "lucide-react"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Framer Motion values for smooth animations
  const x = useMotionValue(0)
  const springX = useSpring(x, { 
    stiffness: 300, 
    damping: 30,
    mass: 0.8 
  })
  
  const isAnimating = useRef(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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

  // Keyboard navigation - only horizontal arrows for page navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating.current) return

      // Only ArrowRight and ArrowLeft for page navigation
      if (e.key === "ArrowRight") {
        e.preventDefault()
        if (currentSection < 4) {
          scrollToSection(currentSection + 1)
        }
      } else if (e.key === "ArrowLeft") {
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
      // ArrowUp and ArrowDown are now handled by HeroSlider for slide navigation
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <CustomCursor />
      <GrainOverlay />
      <ToothParticles currentSection={currentSection} />
      <AnimatedBackground />

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 md:px-16 md:py-6 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid var(--header-border)'
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

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => scrollToSection(2)}
            className="font-sans text-sm font-medium text-foreground/80 transition-colors hover:text-foreground active:text-foreground touch-manipulation min-h-11 px-4"
          >
            Shop Now
          </button>
          <CartMenu />
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <CartMenu />
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="touch-manipulation p-2 min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Slide-out Panel - Glassmorphism */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 bottom-0 w-[300px] overflow-hidden"
              style={{
                background: "linear-gradient(165deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "-10px 0 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
              
              {/* Close button */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/10 border border-white/20 touch-manipulation active:scale-90 transition-transform"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Menu content */}
              <div className="relative flex flex-col h-full pt-20 pb-8 px-5 overflow-y-auto">
                {/* Logo area */}
                <div className="mb-8 px-2">
                  <GlindentLogo variant="white" className="h-7 w-auto opacity-90" />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {["Home", "About Us", "Products", "FAQ", "Contact"].map((item, index) => (
                    <button
                      key={item}
                      onClick={() => {
                        scrollToSection(index)
                        setMobileMenuOpen(false)
                      }}
                      className={`group relative text-left py-4 px-4 rounded-2xl text-base font-medium transition-all duration-150 ${
                        currentSection === index
                          ? "text-white bg-white/15 border border-white/20"
                          : "text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15"
                      }`}
                    >
                      {/* Active indicator line */}
                      {currentSection === index && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                      )}
                      
                      <span className="flex items-center gap-3">
                        <span className={`text-xs font-mono ${
                          currentSection === index ? "text-white/70" : "text-white/40"
                        }`}>
                          0{index + 1}
                        </span>
                        {item}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Divider */}
                <div className="my-6 h-px bg-white/15" />

                {/* Section indicator */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          scrollToSection(idx)
                          setMobileMenuOpen(false)
                        }}
                        className={`h-2 rounded-full transition-all duration-200 ${
                          currentSection === idx
                            ? "w-8 bg-white"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-white/50">
                    {String(currentSection + 1).padStart(2, '0')}/05
                  </span>
                </div>

                {/* Bottom section */}
                <div className="mt-auto space-y-4">
                  <button
                    onClick={() => {
                      scrollToSection(2)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full py-4 px-4 bg-white text-[#007A72] rounded-2xl font-semibold text-center active:scale-[0.98] transition-transform shadow-lg"
                  >
                    Shop Now
                  </button>
                  
                  <p className="text-center text-xs text-white/40">
                    Use ← → keys to navigate
                  </p>
                </div>
              </div>
              
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-20 left-0 w-32 h-32 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={scrollContainerRef}
        style={{ x: springX }}
        className={`relative z-10 flex h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroSlider 
          scrollToSection={scrollToSection} 
          onSlideEnd={() => {
            if (currentSection === 0) {
              scrollToSection(1)
            }
          }}
        />

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
