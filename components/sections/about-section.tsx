"use client"

import { MagneticButton } from "@/components/magnetic-button"
import { useReveal } from "@/hooks/use-reveal"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

export function AboutSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showGradient, setShowGradient] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      
      setShowGradient(!isAtBottom)
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      // Initial check
      handleScroll()
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-screen shrink-0 snap-start flex-col px-6 pt-32 pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16"
    >
      <div className="h-full flex flex-col">
        {/* Title - aligned with other sections */}
        <div
          className={`mb-8 shrink-0 md:mb-12 transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 scale-100 opacity-100 blur-0" : "-translate-y-20 scale-95 opacity-0 blur-sm"
          }`}
        >
          <h2 className="font-sans text-4xl font-light leading-none tracking-tight text-foreground whitespace-nowrap md:text-5xl lg:text-6xl">
            Our Story
          </h2>
        </div>

        {/* Scrollable Content Area with Gradient Overlay */}
        <div className="relative flex-1 overflow-hidden">
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto pr-2" 
            style={{ scrollbarWidth: "thin" }}
          >
                        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-16 lg:gap-24 pb-8">
            {/* Left side - Story */}
            <div className="space-y-6 md:w-[48%]">
              <div
                className={`relative h-56 overflow-hidden rounded-2xl transition-all duration-700 ease-out md:h-72 ${
                  isVisible ? "translate-y-0 opacity-100 blur-0" : "-translate-y-12 opacity-0 blur-sm"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <Image
                  src="/modern-dental-laboratory-with-advanced-equipment.jpg"
                  alt="Modern dental laboratory with advanced equipment - Glindent"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />
              </div>

              <div className="space-y-3 md:space-y-4">
                <p
                  className={`text-sm leading-relaxed text-foreground/90 transition-all duration-700 ease-out md:text-base ${
                    isVisible ? "translate-x-0 opacity-100 blur-0" : "-translate-x-12 opacity-0 blur-sm"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  Our journey started in Izmir, Turkey, where Gülsa Medical Devices and Materials has been supporting
                  dentists and labs for more than four decades. Built on a commitment to quality and trust, Gülsa grew
                  into one of Turkey's most respected names in dental care, now serving professionals across the world.
                </p>
                <p
                  className={`text-sm leading-relaxed text-foreground/90 transition-all duration-700 ease-out md:text-base ${
                    isVisible ? "translate-x-0 opacity-100 blur-0" : "-translate-x-12 opacity-0 blur-sm"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  Glindent was created to bring that same dedication closer to the UK. We know how important it is for
                  dental professionals to have reliable materials at hand, that's why we make Gülsa's products, from
                  world-class zirconia discs to restorative and CAD/CAM solutions, available with faster delivery and
                  local service you can count on.
                </p>
              </div>
            </div>

          {/* Right side - Stats with creative layout */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-12 md:w-[48%]">
            {[
              { number: "40+", label: "Years", sublabel: "Supporting dental professionals", direction: "right" },
              { number: "1000+", label: "Products", sublabel: "Premium dental supplies", direction: "left" },
              { number: "Global", label: "Reach", sublabel: "Serving worldwide", direction: "right" },
            ].map((stat, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return stat.direction === "left"
                    ? "-translate-x-24 rotate-[-2deg] scale-90 opacity-0 blur-sm"
                    : "translate-x-24 rotate-[2deg] scale-90 opacity-0 blur-sm"
                }
                return "translate-x-0 rotate-0 scale-100 opacity-100 blur-0"
              }

              return (
                <div
                  key={i}
                  className={`group flex cursor-default items-baseline gap-4 border-l border-foreground/30 pl-4 transition-all duration-1000 ease-out hover:border-foreground/60 md:gap-8 md:pl-8 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${500 + i * 200}ms`,
                    marginLeft: i % 2 === 0 ? "0" : "auto",
                    maxWidth: i % 2 === 0 ? "100%" : "85%",
                  }}
                >
                  <div className="text-4xl font-light text-foreground transition-all duration-500 group-hover:text-primary md:text-5xl lg:text-6xl xl:text-7xl">
                    {stat.number}
                  </div>
                  <div className="transition-all duration-500 group-hover:brightness-90">
                    <div className="font-sans text-base font-light text-foreground transition-colors duration-500 group-hover:text-foreground/80 md:text-xl">
                      {stat.label}
                    </div>
                    <div className="font-mono text-xs text-foreground/60 transition-colors duration-500 group-hover:text-foreground/80">
                      {stat.sublabel}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
          </div>

          {/* Gradient Overlay - appears at bottom when scrollable */}
          <div 
            className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none transition-opacity duration-300 ${
              showGradient ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 20%, hsl(var(--background) / 0.7) 40%, hsl(var(--background) / 0.4) 60%, hsl(var(--background) / 0.1) 80%, transparent 100%)'
            }}
          />
        </div>

        {/* Buttons - Always Visible */}
        <div
          className={`mt-8 flex shrink-0 flex-wrap gap-3 transition-all duration-1000 ease-out md:mt-12 md:gap-4 ${
            isVisible ? "translate-y-0 scale-100 opacity-100 blur-0" : "translate-y-16 scale-95 opacity-0 blur-sm"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(2)}>
            Shop Products
          </MagneticButton>
          <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(4)}>
            Contact Us
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
