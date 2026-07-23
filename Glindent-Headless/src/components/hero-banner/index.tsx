import { observer } from "mobx-react-lite";
import { IkasImage } from "@ikas/storefront";
import { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel, Keyboard } from "swiper";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "../horizontal-layout";

// Import Swiper CSS - using core CSS for better ikas compatibility
import "swiper/css";
import "swiper/css/effect-cards";

// ========================
// IKAS PROPS INTERFACE
// ========================
interface HeroBannerProps {
  // Slide 1
  slide1Badge?: string;
  slide1Title?: string;
  slide1Description?: string;
  slide1Image?: IkasImage;
  // Slide 2
  slide2Badge?: string;
  slide2Title?: string;
  slide2Description?: string;
  slide2Image?: IkasImage;
  // Slide 3
  slide3Badge?: string;
  slide3Title?: string;
  slide3Description?: string;
  slide3Image?: IkasImage;
  // Button texts
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

interface HeroSlide {
  id: number;
  badge: string;
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
}

// Default slides (fallback if not provided from IKAS)
const defaultSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "High-Quality Dental Supplies",
    title: ["Where quality", "meets care"],
    description:
      "We believe dental professionals deserve materials they can trust. That's why Glindent delivers world-class products, supported by responsive service and a commitment to helping you achieve the best results for your patients.",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop&q=80",
    imageAlt: "Professional dental care - Patient receiving quality dental treatment",
  },
  {
    id: 2,
    badge: "Premium Zirconia Discs",
    title: ["Precision", "crafted for you"],
    description:
      "Our zirconia discs offer exceptional translucency and strength, designed for dental professionals who demand the highest quality materials for their restorations.",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=600&fit=crop&q=80",
    imageAlt: "Premium zirconia dental discs for professional restorations",
  },
  {
    id: 3,
    badge: "Trusted by Professionals",
    title: ["40+ years of", "excellence"],
    description:
      "Backed by Gülsa Medical's four decades of expertise, Glindent brings world-renowned dental materials to the UK market with unmatched quality and service.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop&q=80",
    imageAlt: "Modern dental laboratory with advanced equipment",
  },
];

const HeroBanner: React.FC<HeroBannerProps> = (props) => {
  const {
    slide1Badge,
    slide1Title,
    slide1Description,
    slide1Image,
    slide2Badge,
    slide2Title,
    slide2Description,
    slide2Image,
    slide3Badge,
    slide3Title,
    slide3Description,
    slide3Image,
    primaryButtonText = "Shop Now",
    secondaryButtonText = "Contact Us",
  } = props;

  // Build slides from IKAS props or use defaults
  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      badge: slide1Badge || defaultSlides[0].badge,
      title: slide1Title ? slide1Title.split("\n") : defaultSlides[0].title,
      description: slide1Description || defaultSlides[0].description,
      image: slide1Image?.src || defaultSlides[0].image,
      imageAlt: defaultSlides[0].imageAlt,
    },
    {
      id: 2,
      badge: slide2Badge || defaultSlides[1].badge,
      title: slide2Title ? slide2Title.split("\n") : defaultSlides[1].title,
      description: slide2Description || defaultSlides[1].description,
      image: slide2Image?.src || defaultSlides[1].image,
      imageAlt: defaultSlides[1].imageAlt,
    },
    {
      id: 3,
      badge: slide3Badge || defaultSlides[2].badge,
      title: slide3Title ? slide3Title.split("\n") : defaultSlides[2].title,
      description: slide3Description || defaultSlides[2].description,
      image: slide3Image?.src || defaultSlides[2].image,
      imageAlt: defaultSlides[2].imageAlt,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Use navigation context for horizontal slider
  const { scrollToId } = useNavigation();

  // Set mounted after initial render to avoid jarring animations on page load
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSlideChange = (swiper: any) => {
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

  // Navigate by section id — positions come from the ikas panel and can change
  const scrollToProducts = () => scrollToId("products");
  const scrollToContact = () => scrollToId("contact");
  const scrollToAbout = () => scrollToId("about");

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
          min-height: calc(var(--vh, 1vh) * 100);
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          padding: 4.5rem 1.25rem 1rem;
          overflow: hidden;
        }
        @media (min-width: 480px) {
          .hero-section {
            padding: 5rem 1.5rem 1.5rem;
          }
        }
        @media (min-width: 640px) {
          .hero-section {
            padding: 5.5rem 2rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .hero-section {
            padding: 6rem 3rem 2rem;
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
          gap: 1rem;
          flex: 1;
          padding-top: 0;
        }
        @media (min-width: 480px) {
          .hero-grid {
            gap: 1.25rem;
          }
        }
        @media (min-width: 640px) {
          .hero-grid {
            gap: 1.5rem;
          }
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
          height: 220px;
          order: 1;
        }
        @media (min-width: 400px) {
          .slider-container {
            height: 260px;
          }
        }
        @media (min-width: 480px) {
          .slider-container {
            height: 280px;
          }
        }
        @media (min-width: 640px) {
          .slider-container {
            height: 320px;
          }
        }
        @media (min-width: 768px) {
          .slider-container {
            height: 400px;
          }
        }
        @media (min-width: 1024px) {
          .slider-container {
            order: 2;
            height: 500px;
          }
        }
        @media (min-width: 1280px) {
          .slider-container {
            height: 580px;
          }
        }
        
        .text-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 48rem;
          order: 2;
          padding-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .text-content {
            padding-bottom: 1rem;
          }
        }
        @media (min-width: 1024px) {
          .text-content {
            order: 1;
            padding-bottom: 0;
          }
        }
        
        .hero-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.5rem, 6vw, 4.5rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0;
        }
        @media (min-width: 400px) {
          .hero-title {
            font-size: clamp(1.75rem, 6vw, 4.5rem);
          }
        }
        
        .hero-description {
          max-width: 36rem;
          font-size: 0.8rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
        @media (min-width: 400px) {
          .hero-description {
            font-size: 0.85rem;
            line-height: 1.6;
          }
        }
        @media (min-width: 640px) {
          .hero-description {
            font-size: 0.95rem;
          }
        }
        @media (min-width: 768px) {
          .hero-description {
            font-size: 1.05rem;
          }
        }
        @media (min-width: 1024px) {
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
          height: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        /* Smaller dots on mobile */
        @media (max-width: 768px) {
          .slide-indicator {
            width: 0.25rem;
            height: 0.25rem;
          }
          .slide-indicator.active {
            height: 0.75rem;
          }
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
              onSwiper={(swiper: any) => (swiperRef.current = swiper)}
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
              onSlideChange={(swiper: any) => handleSlideChange(swiper)}
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
                        unoptimized
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
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  <span className="glass-badge">
                    <span style={{ fontSize: "0.7rem", color: "white", lineHeight: 1 }}>
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
                  style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.25rem" }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button onClick={scrollToProducts} className="btn-primary">
                      {primaryButtonText}
                    </button>
                    <button onClick={scrollToContact} className="btn-secondary">
                      {secondaryButtonText}
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
          onClick={scrollToAbout}
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
