"use client"

import { observer } from "mobx-react-lite"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useNavigation } from "../horizontal-layout"


// SVG Icons
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

// GlindentLogo SVG
const GlindentLogo = () => (
  <svg viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-logo">
    <defs>
      <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0d9488"/>
        <stop offset="50%" stopColor="#0891b2"/>
        <stop offset="100%" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
    <text x="0" y="30" fill="url(#footerGradient)" fontSize="28" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
      Glindent
    </text>
  </svg>
)

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: "-50px" })
  const { scrollToSection } = useNavigation()

  // Order based on ikas component rendering: Hero(0), About(1), Contact(2), FAQ(3), Products(4)
  const navLinks = [
    { label: "Home", index: 0 },
    { label: "About", index: 1 },
    { label: "Products", index: 4 },
    { label: "FAQ", index: 3 },
    { label: "Contact", index: 2 },
  ];

  const socialLinks = [
    { icon: <TwitterIcon />, href: "#", label: "Twitter" },
    { icon: <InstagramIcon />, href: "#", label: "Instagram" },
    { icon: <LinkedInIcon />, href: "#", label: "LinkedIn" },
  ]

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Logo & Description */}
          <div className="footer-brand">
            <GlindentLogo />
            <p className="footer-tagline">Way to Dentistry</p>
            <p className="footer-description">
              Premium dental supplies backed by 40+ years of Gülsa Medical expertise.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav">
            <h4 className="footer-nav-title">Quick Links</h4>
            <nav className="footer-nav-links">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollToSection(link.index)}
                  className="footer-nav-link"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            <h4 className="footer-social-title">Follow Us</h4>
            <div className="footer-social-links">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="footer-social-link"
                  aria-label={link.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + 0.1 * index }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="footer-copyright">
            © {new Date().getFullYear()} Glindent. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="/privacy" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-divider">•</span>
            <a href="/terms" className="footer-legal-link">Terms of Service</a>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .footer {
          position: relative;
          padding: 4rem 0 2rem;
          background: #111827;
          color: white;
          overflow: hidden;
        }

        .footer-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-content {
          display: grid;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 4rem;
          }
        }

        .footer-brand {
          max-width: 20rem;
        }

        .footer-logo {
          height: 2rem;
          width: auto;
          margin-bottom: 0.75rem;
        }

        .footer-tagline {
          font-family: monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #0d9488;
          margin-bottom: 1rem;
        }

        .footer-description {
          font-size: 0.875rem;
          color: #9ca3af;
          line-height: 1.6;
        }

        .footer-nav-title,
        .footer-social-title {
          font-family: monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-nav-link {
          font-size: 0.875rem;
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
        }

        .footer-nav-link:hover {
          color: #0d9488;
        }

        .footer-social-links {
          display: flex;
          gap: 0.75rem;
        }

        .footer-social-link {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: #9ca3af;
          transition: all 0.2s;
        }

        .footer-social-link:hover {
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          color: white;
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 2rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }
        }

        .footer-copyright {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .footer-legal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .footer-legal-link {
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal-link:hover {
          color: #0d9488;
        }

        .footer-divider {
          color: #374151;
        }
      `}</style>
    </footer>
  )
}

export default observer(Footer)
