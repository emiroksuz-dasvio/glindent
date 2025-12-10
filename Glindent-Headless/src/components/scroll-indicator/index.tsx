import React, { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  sections: { id: string; label: string }[];
}

export function ScrollIndicator({ sections }: ScrollIndicatorProps) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="scroll-indicator-wrapper">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`scroll-dot ${index === activeSection ? "active" : ""}`}
          aria-label={`Scroll to ${section.label}`}
          title={section.label}
        />
      ))}
      <style jsx>{`
        .scroll-indicator-wrapper {
          position: fixed;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .scroll-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        
        .scroll-dot:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: scale(1.3);
        }
        
        .scroll-dot.active {
          background: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          width: 0.625rem;
          height: 0.625rem;
        }
        
        @media (max-width: 768px) {
          .scroll-indicator-wrapper {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ScrollIndicator;
