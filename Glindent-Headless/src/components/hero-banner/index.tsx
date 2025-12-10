import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel, Keyboard } from "swiper";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../horizontal-layout";

// @ts-ignore - Import Swiper bundle CSS
import "swiper/swiper-bundle.css";

interface HeroSlide {
  id: number;
  badge: string;
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
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
];

const HeroBanner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Use navigation context for horizontal slider
  const { scrollToSection } = useNavigation();

  // Set mounted after initial render to avoid jarring animations on page load
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsAnimating(true);
    setActiveIndex(swiper.realIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Handle keyboard navigation - only up/down for slides
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      swiper.slideNext();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      swiper.slidePrev();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const scrollToProducts = () => {
    scrollToSection(2); // Products is index 2
  };

  const scrollToContact = () => {
    scrollToSection(4); // Contact is index 4
  };

  return (
    <section
      id="hero"
      className="hero-section horizontal-section"
    >
      <style jsx global>{`
        .hero-section {
          position: relative;
          display: flex;
          min-height: 100vh;
          height: 100vh;
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          padding: 6rem 1.5rem 1.5rem;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .hero-section {
            padding: 7rem 2rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .hero-section {
            padding: 8rem 4rem 3rem;
          }
        }
        @media (min-width: 1024px) {
          .hero-section {
            padding: 8rem 5rem 3rem;
          }
        }
        
        .hero-swiper {
          height: 100%;
          width: 100%;
        }
        
        .hero-swiper .swiper-slide {
          height: 100% !important;
        }
        
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          flex: 1;
          padding-top: 1rem;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
          }
        }
        @media (min-width: 1280px) {
          .hero-grid {
            gap: 4rem;
          }
        }
        
        .slider-container {
          position: relative;
          display: block;
          align-self: center;
          height: 280px;
          order: 1;
        }
        @media (min-width: 640px) {
          .slider-container {
            height: 350px;
          }
        }
        @media (min-width: 768px) {
          .slider-container {
            height: 450px;
          }
        }
        @media (min-width: 1024px) {
          .slider-container {
            order: 2;
            height: 550px;
          }
        }
        @media (min-width: 1280px) {
          .slider-container {
            height: 600px;
          }
        }
        
        .text-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 48rem;
          order: 2;
        }
        @media (min-width: 1024px) {
          .text-content {
            order: 1;
          }
        }
        
        .hero-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.875rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
        }
        
        .hero-description {
          max-width: 36rem;
          font-size: 0.875rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
        @media (min-width: 640px) {
          .hero-description {
            font-size: 1rem;
          }
        }
        @media (min-width: 768px) {
          .hero-description {
            font-size: 1.125rem;
          }
        }
        
        .glass-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 0.375rem 1rem;
        }
        
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.95);
          color: #007A72;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          background: white;
        }
        
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        .slide-indicator {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .slide-indicator:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        .slide-indicator.active {
          background: white;
          height: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .image-card {
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          overflow: hidden;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        @media (min-width: 640px) {
          .image-card {
            border-radius: 1.5rem;
          }
        }
        
        .image-glow {
          position: absolute;
          inset: -1.5rem;
          background: linear-gradient(
            to bottom right,
            rgba(58, 204, 255, 0.2) 0%,
            rgba(0, 168, 154, 0.15) 50%,
            rgba(0, 196, 180, 0.2) 100%
          );
          border-radius: 1.5rem;
          filter: blur(3rem);
          z-index: -1;
        }
        
        @keyframes scrollBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
        
        .scroll-arrow {
          animation: scrollBounce 1.5s ease-in-out infinite;
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="hero-grid">
          {/* Image Slider - First on mobile, second on desktop */}
          <div className="slider-container">
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
              className="hero-swiper"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
                      className="image-card"
                      style={{
                        boxShadow:
                          activeIndex === index
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                            : "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {/* Glass background */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(4px)",
                        }}
                      />

                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        layout="fill"
                        objectFit="cover"
                        priority
                        style={{
                          transform: activeIndex === index ? "scale(1)" : "scale(1.05)",
                          transition: "transform 0.7s ease",
                        }}
                      />

                      {/* Gradient overlays for depth */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to bottom right, transparent, transparent, rgba(0,0,0,0.2))",
                        }}
                      />

                      {/* Inner border glow */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "inherit",
                          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
                        }}
                      />
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
                      className="image-glow"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Slide indicators */}
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperRef.current?.slideTo(index)}
                  className={`slide-indicator ${activeIndex === index ? "active" : ""}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text Content - Second on mobile, first on desktop */}
          <div className="text-content">
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <span className="glass-badge">
                    <span style={{ fontSize: "0.75rem", color: "white", lineHeight: 1 }}>
                      {heroSlides[activeIndex].badge}
                    </span>
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="hero-title"
                >
                  {heroSlides[activeIndex].title.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < heroSlides[activeIndex].title.length - 1 && <br />}
                    </span>
                  ))}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="hero-description"
                >
                  {heroSlides[activeIndex].description}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    <button onClick={scrollToProducts} className="btn-primary">
                      Shop Now
                    </button>
                    <button onClick={scrollToContact} className="btn-secondary">
                      Contact Us
                    </button>
                  </div>
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
          onClick={scrollToProducts}
          style={{
            marginTop: "auto",
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Scroll to explore</span>
          <svg
            className="scroll-arrow"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "1.5rem",
          zIndex: 20,
          display: "flex",
          alignItems: "baseline",
          gap: "0.25rem",
          fontFamily: "monospace",
          color: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <span style={{ fontSize: "1.5rem", fontWeight: 300 }}>{String(activeIndex + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.5)" }}>/</span>
        <span style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.5)" }}>
          {String(heroSlides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default observer(HeroBanner);
