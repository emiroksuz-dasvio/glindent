import { observer } from "mobx-react-lite";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigation } from "../horizontal-layout";

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showGradient, setShowGradient] = useState(true);
  const isInView = useInView(sectionRef, { once: true, margin: "-30%" });
  
  // Use navigation context for horizontal slider
  const { scrollToSection } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowGradient(!isAtBottom);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const stats = [
    { number: "40+", label: "Years", sublabel: "Supporting dental professionals", direction: "right" },
    { number: "1000+", label: "Products", sublabel: "Premium dental supplies", direction: "left" },
    { number: "Global", label: "Reach", sublabel: "Serving worldwide", direction: "right" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section horizontal-section"
    >
      <style jsx global>{`
        .about-section {
          display: flex;
          min-height: 100vh;
          height: 100vh;
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          overflow: hidden;
          padding: 6rem 1.5rem 1.5rem;
        }
        @media (min-width: 640px) {
          .about-section {
            padding: 7rem 2rem 2rem;
          }
        }
        @media (min-width: 768px) {
          .about-section {
            padding: 10rem 4rem 3rem;
          }
        }
        @media (min-width: 1024px) {
          .about-section {
            padding: 10rem 5rem 3rem;
          }
        }
        
        .about-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.875rem, 5vw, 3.75rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0 0 1.5rem 0;
          white-space: nowrap;
        }
        @media (min-width: 640px) {
          .about-title {
            margin-bottom: 2rem;
          }
        }
        @media (min-width: 768px) {
          .about-title {
            margin-bottom: 3rem;
          }
        }
        
        .about-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .about-grid {
            flex-direction: row;
            justify-content: space-between;
            gap: 4rem;
          }
        }
        @media (min-width: 1024px) {
          .about-grid {
            gap: 6rem;
          }
        }
        
        .story-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .story-column {
            width: 48%;
          }
        }
        
        .about-image-wrapper {
          position: relative;
          height: 14rem;
          overflow: hidden;
          border-radius: 1rem;
        }
        @media (min-width: 768px) {
          .about-image-wrapper {
            height: 18rem;
          }
        }
        
        .about-description {
          font-size: 0.875rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
        @media (min-width: 768px) {
          .about-description {
            font-size: 1rem;
          }
        }
        
        .stats-column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .stats-column {
            width: 48%;
            gap: 3rem;
          }
        }
        
        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(255, 255, 255, 0.3);
          cursor: default;
          transition: border-color 0.2s ease;
        }
        .stat-item:hover {
          border-color: rgba(255, 255, 255, 0.6);
        }
        @media (min-width: 768px) {
          .stat-item {
            gap: 2rem;
            padding-left: 2rem;
          }
        }
        
        .stat-number {
          font-size: 2.25rem;
          font-weight: 300;
          color: white;
          transition: color 0.5s ease;
        }
        .stat-item:hover .stat-number {
          color: #3ACCFF;
        }
        @media (min-width: 768px) {
          .stat-number {
            font-size: 3rem;
          }
        }
        @media (min-width: 1024px) {
          .stat-number {
            font-size: 3.75rem;
          }
        }
        @media (min-width: 1280px) {
          .stat-number {
            font-size: 4.5rem;
          }
        }
        
        .stat-label {
          font-size: 1rem;
          font-weight: 300;
          color: white;
          display: block;
        }
        @media (min-width: 768px) {
          .stat-label {
            font-size: 1.25rem;
          }
        }
        
        .stat-sublabel {
          font-size: 0.75rem;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.6);
          display: block;
        }
        
        .about-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .about-btn-primary {
          background: rgba(255, 255, 255, 0.95);
          color: #007A72;
        }
        .about-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          background: white;
        }
        
        .about-btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }
        .about-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
      `}</style>

      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <motion.h2
          className="about-title"
          initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Our Story
        </motion.h2>

        {/* Scrollable Content Area */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <div
            ref={scrollRef}
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: "0.5rem",
              scrollbarWidth: "thin",
            }}
          >
            <div className="about-grid" style={{ paddingBottom: "2rem" }}>
              {/* Left Side - Story */}
              <div className="story-column">
                {/* Image */}
                <motion.div
                  className="about-image-wrapper"
                  initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                >
                  <Image
                    src="/modern-dental-laboratory-with-advanced-equipment.jpg"
                    alt="Modern dental laboratory with advanced equipment - Glindent"
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.1))",
                    }}
                  />
                </motion.div>

                {/* Descriptions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <motion.p
                    className="about-description"
                    initial={{ opacity: 0, x: -12, filter: "blur(8px)" }}
                    animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
                  >
                    Our journey started in Izmir, Turkey, where Gülsa Medical Devices and Materials has been supporting
                    dentists and labs for more than four decades. Built on a commitment to quality and trust, Gülsa grew
                    into one of Turkey's most respected names in dental care, now serving professionals across the world.
                  </motion.p>
                  <motion.p
                    className="about-description"
                    initial={{ opacity: 0, x: -12, filter: "blur(8px)" }}
                    animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
                  >
                    Glindent was created to bring that same dedication closer to the UK. We know how important it is for
                    dental professionals to have reliable materials at hand, that's why we make Gülsa's products, from
                    world-class zirconia discs to restorative and CAD/CAM solutions, available with faster delivery and
                    local service you can count on.
                  </motion.p>
                </div>
              </div>

              {/* Right Side - Stats */}
              <div className="stats-column">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="stat-item"
                    initial={{
                      opacity: 0,
                      x: stat.direction === "left" ? -24 : 24,
                      rotate: stat.direction === "left" ? -2 : 2,
                      scale: 0.9,
                      filter: "blur(8px)",
                    }}
                    animate={
                      isInView
                        ? { opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" }
                        : {}
                    }
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.2 }}
                    style={{
                      marginLeft: i % 2 === 0 ? "0" : "auto",
                      maxWidth: i % 2 === 0 ? "100%" : "85%",
                    }}
                  >
                    <span className="stat-number">{stat.number}</span>
                    <div>
                      <span className="stat-label">{stat.label}</span>
                      <span className="stat-sublabel">{stat.sublabel}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "8rem",
              pointerEvents: "none",
              transition: "opacity 0.3s ease",
              opacity: showGradient ? 1 : 0,
              background:
                "linear-gradient(to top, rgba(0, 122, 114, 1) 0%, rgba(0, 122, 114, 0.9) 20%, rgba(0, 122, 114, 0.7) 40%, rgba(0, 122, 114, 0.4) 60%, rgba(0, 122, 114, 0.1) 80%, transparent 100%)",
            }}
          />
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
          style={{
            marginTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <button onClick={() => scrollToSection(2)} className="about-btn about-btn-primary">
            Shop Products
          </button>
          <button onClick={() => scrollToSection(4)} className="about-btn about-btn-secondary">
            Contact Us
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default observer(AboutSection);
