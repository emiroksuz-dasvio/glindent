"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCards, Mousewheel, Keyboard } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import Image from "next/image"
import Link from "next/link"
import { MagneticButton } from "@/components/magnetic-button"
import { motion, AnimatePresence } from "framer-motion"

// Import Swiper styles
import "swiper/swiper-bundle.css"

interface HeroSlide {
  id: number
  badge: string
  title: string[]
  description: string
  image: string
  imageAlt: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "High-Quality Dental Supplies",
    title: ["Where quality", "meets care"],
    description:
      "We believe dental professionals deserve materials they can trust. That's why Glindent delivers world-class products, supported by responsive service and a commitment to helping you achieve the best results for your patients.",
    image: "/hero-dental.jpg",
    imageAlt: "Professional dental care - Patient receiving quality dental treatment",
  },
  {
    id: 2,
    badge: "Premium Zirconia Discs",
    title: ["Precision", "crafted for you"],
    description:
      "Our zirconia discs offer exceptional translucency and strength, designed for dental professionals who demand the highest quality materials for their restorations.",
    image: "/dental-zirconia-discs-white-ceramic-material.jpg",
    imageAlt: "Premium zirconia dental discs for professional restorations",
  },
  {
    id: 3,
    badge: "Trusted by Professionals",
    title: ["40+ years of", "excellence"],
    description:
      "Backed by Gülsa Medical's four decades of expertise, Glindent brings world-renowned dental materials to the UK market with unmatched quality and service.",
    image: "/modern-dental-laboratory-with-advanced-equipment.jpg",
    imageAlt: "Modern dental laboratory with advanced equipment",
  },
]

interface HeroSliderProps {
  scrollToSection: (index: number) => void
  onSlideEnd?: () => void
}

export function HeroSlider({ scrollToSection, onSlideEnd }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)

  // Set mounted after initial render to avoid jarring animations on page load
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSlideChange = (swiper: SwiperType) => {
    setIsAnimating(true)
    setActiveIndex(swiper.realIndex)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Handle keyboard navigation - only up/down for slides
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const swiper = swiperRef.current
    if (!swiper) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      e.stopPropagation()
      
      // If at last slide, trigger page change
      if (swiper.realIndex === heroSlides.length - 1) {
        onSlideEnd?.()
      } else {
        swiper.slideNext()
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      e.stopPropagation()
      swiper.slidePrev()
    }
  }, [onSlideEnd])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Prevent page scroll when interacting with hero slider
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const swiper = swiperRef.current
      if (!swiper) return

      // Only handle vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // At last slide and scrolling down - allow page scroll
        if (swiper.isEnd && e.deltaY > 0) {
          return
        }
        // At first slide and scrolling up - allow page scroll
        if (swiper.isBeginning && e.deltaY < 0) {
          return
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <section className="relative flex min-h-screen w-screen shrink-0 flex-col px-6 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-16 md:pt-32 md:pb-12 lg:px-20">
      <div className="relative z-10 flex h-full flex-col justify-start flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 pt-4 md:pt-8 lg:items-center flex-1">
          {/* Image Slider - First on mobile, second on desktop */}
          <div className="relative block lg:order-2 self-center h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px]">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              direction="vertical"
              effect="cards"
              cardsEffect={{
                perSlideOffset: 10,
                perSlideRotate: 2,
                rotate: true,
                slideShadows: false,
              }}
              speed={500}
              mousewheel={{
                sensitivity: 0.8,
                forceToAxis: true,
                thresholdDelta: 20,
              }}
              loop={false}
              grabCursor={true}
              modules={[EffectCards, Mousewheel, Keyboard]}
              onSlideChange={handleSlideChange}
              onReachEnd={() => {
                // Optional: trigger callback when reaching end
              }}
              className="h-full w-full hero-swiper"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={slide.id} className="h-full!">
                  <div className="relative w-full h-full">
                    {/* Card container with proper border radius */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        scale: isMounted ? (activeIndex === index ? 1 : 0.97) : 1,
                        opacity: 1,
                        rotateY: isMounted && activeIndex === index ? [0, 1.5, -1.5, 0] : 0,
                        rotateX: isMounted && activeIndex === index ? [0, -2, 2, 0] : 0,
                      }}
                      transition={{
                        scale: { duration: 0.5, ease: "easeOut" },
                        opacity: { duration: 0.3 },
                        rotateY: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
                        rotateX: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" },
                      }}
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden"
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        boxShadow: activeIndex === index 
                          ? "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                          : "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {/* Glass background */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                      
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700"
                        style={{
                          transform: activeIndex === index ? "scale(1)" : "scale(1.05)",
                        }}
                        priority={index === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      
                      {/* Gradient overlays for depth */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-white/5" />
                      <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/20" />
                      
                      {/* Inner border glow */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/20" />
                    </motion.div>

                    {/* Decorative glow */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isMounted ? (activeIndex === index ? [0.4, 0.6, 0.4] : 0.2) : 0.3,
                        scale: isMounted ? (activeIndex === index ? [1, 1.03, 1] : 0.98) : 1,
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                      className="absolute -inset-6 bg-linear-to-br from-cyan-500/20 via-teal-500/15 to-emerald-500/20 rounded-3xl blur-3xl -z-10"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Slide indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-white h-8 shadow-lg"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text Content - Second on mobile, first on desktop */}
          <div className="flex flex-col justify-center max-w-3xl lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="glass inline-block rounded-2xl px-3 py-1.5 sm:px-4"
                >
                  <p className="text-xs sm:text-sm leading-none text-white">
                    {heroSlides[activeIndex].badge}
                  </p>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-white"
                >
                  <span className="text-balance">
                    {heroSlides[activeIndex].title.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < heroSlides[activeIndex].title.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-white/90"
                >
                  <span className="text-pretty">{heroSlides[activeIndex].description}</span>
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center pt-2"
                >
                  <Link href="/products" className="w-full sm:w-auto">
                    <MagneticButton size="lg" variant="primary" className="w-full sm:w-auto min-h-12">
                      Shop Now
                    </MagneticButton>
                  </Link>
                  <MagneticButton
                    size="lg"
                    variant="secondary"
                    onClick={() => scrollToSection(4)}
                    className="w-full sm:w-auto min-h-12"
                  >
                    Contact Us
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={() => scrollToSection(1)}
          className="mt-auto mb-4 flex flex-col items-center gap-2 transition-transform hover:scale-105 lg:self-start"
        >
          <p className="text-[13px] font-medium text-white/90">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="h-5 w-5 text-white/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 sm:right-8 md:right-16 lg:right-20 z-20">
        <div className="flex items-baseline gap-1 font-mono text-white/80">
          <span className="text-2xl sm:text-3xl font-light">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="text-sm text-white/50">/</span>
          <span className="text-sm text-white/50">{String(heroSlides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  )
}
