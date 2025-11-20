"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { AboutSection } from "@/components/sections/about-section"
import { ProductsSection } from "@/components/sections/products-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { FAQSection } from "@/components/sections/faq-section"
import { GlindentLogo } from "@/components/glindent-logo"
import { ChevronDown } from "lucide-react"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
      // If shader hasn't loaded after 2 seconds, show fallback
      if (!checkShaderReady()) {
        setShaderError(true)
      }
    }, 2000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
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
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      {/* Fallback gradient background */}
      <div className="fixed inset-0 z-0 bg-linear-to-br from-[#007A72] via-[#3ACCFF] to-background" />

      {/* WebGL Shader Background (enhanced version) */}
      {!shaderError && (
        <div
          ref={shaderContainerRef}
          className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          style={{ contain: "strict" }}
        >
          <Suspense fallback={null}>
            <Shader className="h-full w-full">
              <Swirl
                colorA="#007A72"
                colorB="#3ACCFF"
                speed={0.8}
                detail={0.8}
                blend={50}
                coarseX={40}
                coarseY={40}
                mediumX={40}
                mediumY={40}
                fineX={40}
                fineY={40}
              />
              <ChromaFlow
                baseColor="#007A72"
                upColor="#007A72"
                downColor="#d1d1d1"
                leftColor="#3ACCFF"
                rightColor="#3ACCFF"
                intensity={0.9}
                radius={1.8}
                momentum={25}
                maskType="alpha"
                opacity={0.97}
              />
            </Shader>
          </Suspense>
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px) saturate(120%)',
          WebkitBackdropFilter: 'blur(12px) saturate(120%)',
        }}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <GlindentLogo variant="white" className="h-9 w-auto" />
        </button>

        <div className="hidden items-center gap-8 md:flex">
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
          className="hidden font-sans text-sm font-medium text-foreground/80 transition-colors hover:text-foreground md:block"
        >
          Shop Now
        </button>
      </nav>

      <motion.div
        ref={scrollContainerRef}
        style={{ x: springX }}
        className={`relative z-10 flex h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <section 
          className="relative flex min-h-screen w-screen shrink-0 flex-col px-6 pt-32 pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16"
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              background: `radial-gradient(70% 60% at 20% 30%, rgba(0,0,0,.16) 0%, rgba(0,0,0,.08) 35%, transparent 70%), linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.04))`,
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-start">
            <div className="max-w-3xl pt-4 md:pt-8">
              <div className="glass mb-6 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-2xl px-4 py-1.5 duration-700">
                <p className="text-[14px] leading-none text-white">High-Quality Dental Supplies</p>
              </div>
              <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-white duration-1000 md:text-6xl lg:text-7xl xl:text-8xl">
                <span className="text-balance">
                  Where quality
                  <br />
                  meets care
                </span>
              </h1>
              <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-white/95 duration-1000 delay-200 md:text-lg lg:text-xl">
                <span className="text-pretty">
                  We believe dental professionals deserve materials they can trust. That's why Glindent delivers
                  world-class products, supported by responsive service and a commitment to helping you achieve the best
                  results for your patients.
                </span>
              </p>

              <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
                <Link href="/products">
                  <MagneticButton size="lg" variant="primary">
                    Shop Now
                  </MagneticButton>
                </Link>
                <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(4)}>
                  Contact Us
                </MagneticButton>
              </div>
            </div>

            <button
              onClick={() => scrollToSection(1)}
              className="mt-auto mb-8 flex flex-col items-center gap-2 transition-transform duration-1000 delay-500 hover:scale-105 animate-in fade-in"
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
