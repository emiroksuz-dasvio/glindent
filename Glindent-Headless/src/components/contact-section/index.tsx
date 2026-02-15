"use client"

import { useState, useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { IkasNavigationLink } from "@ikas/storefront"

// ========================
// IKAS PROPS INTERFACE
// ========================
interface ContactSectionProps {
  // Section titles
  sectionTitle?: string;
  sectionSubtitle?: string;
  // Contact info
  email?: string;
  phone1?: string;
  phone2?: string;
  addressLine1?: string;
  addressLine2?: string;
  // Card texts
  contactCardTitle?: string;
  contactCardDescription?: string;
  formCardTitle?: string;
  submitButtonText?: string;
  // Social media links
  instagramUrl?: string;
  linkedinUrl?: string;
}

// SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
    <path d="m21.854 2.147-10.94 10.939"/>
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const ContactSection: React.FC<ContactSectionProps> = (props) => {
  const {
    sectionTitle = "Let's talk",
    sectionSubtitle = "/ Get in touch",
    email = "info@glindent.co.uk",
    phone1 = "01202 402675",
    phone2 = "07717 886717",
    addressLine1 = "Bourne House, 23 Hinton Road",
    addressLine2 = "Bournemouth, BH1 2EF",
    contactCardTitle = "Contact Information",
    contactCardDescription = "Fill up the form and our Team will get back to you within 24 hours.",
    formCardTitle = "Send a Message",
    submitButtonText = "Send Message",
    instagramUrl = "#",
    linkedinUrl = "#",
  } = props;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", message: "" })
      setErrors({})
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section horizontal-section"
    >
      <div className="contact-container">
        {/* Title */}
        <div className={`section-header ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-subtitle">{sectionSubtitle}</p>
        </div>

        {/* Main Content Grid */}
        <div className="contact-grid">
          {/* Left Card - Contact Information */}
          <div 
            className={`contact-info-card ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div>
              <h3 className="card-title">{contactCardTitle}</h3>
              <p className="card-description">{contactCardDescription}</p>
              
              <div className="contact-items">
                {/* Email */}
                <a href={`mailto:${email}`} className="contact-item">
                  <div className="contact-icon">
                    <MailIcon />
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Email</span>
                    <span className="contact-value">{email}</span>
                  </div>
                </a>

                {/* Phone */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <PhoneIcon />
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Phone</span>
                    <div className="phone-numbers">
                      <a href={`tel:${phone1?.replace(/\s/g, '') || ''}`} className="phone-link">{phone1}</a>
                      {phone2 && (
                        <>
                          <span className="phone-divider">|</span>
                          <a href={`tel:${phone2?.replace(/\s/g, '') || ''}`} className="phone-link">{phone2}</a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPinIcon />
                  </div>
                  <div className="contact-text">
                    <span className="contact-label">Address</span>
                    <p className="address-text">
                      {addressLine1}<br />
                      {addressLine2}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-section">
              <span className="social-label">Follow Us</span>
              <div className="social-links">
                {instagramUrl && (
                  <a href={instagramUrl} className="social-link instagram" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} className="social-link linkedin" aria-label="LinkedIn">
                    <LinkedInIcon />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Card - Contact Form */}
          <div 
            className={`contact-form-card ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="card-title">{formCardTitle}</h3>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={`form-input ${errors.name ? 'has-error' : ''}`}
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className={`form-input ${errors.email ? 'has-error' : ''}`}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="form-group form-group-message">
                <label className="form-label">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: undefined })
                  }}
                  className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="form-error">{errors.message}</p>
                )}
              </div>

              <div className="form-submit">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  <span className="button-shine" />
                  <span className="button-content">
                    {isSubmitting ? (
                      <>
                        <span className="spinner" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        <span>{submitButtonText}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          position: relative;
          z-index: 20;
          display: flex;
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
          min-width: 100vw;
          width: 100vw;
          flex-shrink: 0;
          flex-direction: column;
          padding: 5rem 1.5rem 1.5rem;
          overflow: hidden;
        }
        
        /* Mobile-specific scroll improvements with cross-platform support */
        @media (max-width: 767px) {
          .contact-section {
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
            touch-action: pan-y pinch-zoom;
            padding: 3rem 1rem 2rem;
            /* Cross-platform performance */
            -webkit-transform: translate3d(0, 0, 0);
            -moz-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            will-change: scroll-position;
          }
          
          .contact-container {
            overflow: visible;
            min-height: calc(var(--vh, 1vh) * 100 - 6rem);
            /* iOS Safari specific */
            min-height: -webkit-fill-available;
          }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          @media (max-width: 767px) {
            .contact-section {
              height: -webkit-fill-available;
              -webkit-overflow-scrolling: touch;
              -webkit-transform: translateZ(0);
            }
          }
        }
        
        /* Android specific optimizations */
        @media screen and (max-width: 767px) and (-webkit-min-device-pixel-ratio: 0) {
          .contact-section {
            overscroll-behavior-y: contain;
          }
        }

        @media (min-width: 640px) {
          .contact-section {
            padding: 6rem 2rem 2rem;
          }
        }

        @media (min-width: 768px) {
          .contact-section {
            padding: 7rem 4rem 2rem;
          }
        }

        @media (min-width: 1024px) {
          .contact-section {
            padding: 8rem 5rem 2rem;
          }
        }

        .contact-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .section-header {
          margin-bottom: 1rem;
          flex-shrink: 0;
          transition: all 0.7s ease;
          transform: translateY(-3rem);
          opacity: 0;
        }

        .section-header.visible {
          transform: translateY(0);
          opacity: 1;
        }

        @media (min-width: 640px) {
          .section-header {
            margin-bottom: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .section-header {
            margin-bottom: 2rem;
          }
        }

        .section-title {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 1.875rem;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.025em;
          color: white;
          white-space: nowrap;
        }

        @media (min-width: 640px) {
          .section-title {
            font-size: 2.25rem;
          }
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section-title {
            font-size: 3.75rem;
          }
        }

        .section-subtitle {
          margin-top: 0.5rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          flex: 1;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 0.5rem;
          -webkit-overflow-scrolling: touch;
          min-height: 0;
        }

        .contact-grid::-webkit-scrollbar {
          width: 6px;
        }

        .contact-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .contact-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .contact-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media (min-width: 640px) {
          .contact-grid {
            gap: 1.5rem;
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
          }
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            align-items: start;
            overflow: hidden;
            padding-right: 0;
            height: auto;
            max-height: none;
          }
        }

        .contact-info-card,
        .contact-form-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 1.25rem;
          background: white;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
          transition: all 0.7s ease;
          opacity: 0;
          min-height: auto;
          height: 100%;
        }

        .contact-info-card {
          transform: translateX(-4rem);
        }

        .contact-form-card {
          transform: translateX(4rem);
        }

        .contact-info-card.visible,
        .contact-form-card.visible {
          transform: translateX(0);
          opacity: 1;
        }

        @media (min-width: 640px) {
          .contact-info-card,
          .contact-form-card {
            padding: 1.5rem;
            border-radius: 1.5rem;
            min-height: auto;
            max-height: none;
            height: 100%;
          }
        }

        @media (min-width: 1024px) {
          .contact-info-card,
          .contact-form-card {
            padding: 2rem;
            max-height: none;
            overflow-y: visible;
            height: auto;
          }
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.375rem;
        }

        @media (min-width: 640px) {
          .card-title {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }
        }

        .card-description {
          display: none;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
          .card-description {
            margin-bottom: 2rem;
          }
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .contact-items {
            gap: 1.5rem;
          }
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .contact-item:hover {
          transform: translateX(0.5rem);
        }

        .contact-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.625rem;
          color: white;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          transition: transform 0.3s ease;
        }

        @media (min-width: 640px) {
          .contact-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
          }
        }

        .contact-item:hover .contact-icon {
          transform: scale(1.1);
        }

        .contact-text {
          display: flex;
          flex-direction: column;
          padding-top: 0.125rem;
        }

        .contact-label {
          font-family: monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin-bottom: 0.125rem;
        }

        @media (min-width: 640px) {
          .contact-label {
            font-size: 0.75rem;
            margin-bottom: 0.25rem;
          }
        }

        .contact-value {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          transition: color 0.3s ease;
        }

        @media (min-width: 640px) {
          .contact-value {
            font-size: 1.125rem;
          }
        }

        .contact-item:hover .contact-value {
          color: #0d9488;
        }

        .phone-numbers {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        @media (min-width: 640px) {
          .phone-numbers {
            flex-direction: row;
            gap: 1rem;
          }
        }

        .phone-link {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        @media (min-width: 640px) {
          .phone-link {
            font-size: 1.125rem;
          }
        }

        .phone-link:hover {
          color: #0d9488;
        }

        .phone-divider {
          display: none;
          color: #d1d5db;
        }

        @media (min-width: 640px) {
          .phone-divider {
            display: block;
          }
        }

        .address-text {
          font-size: 1rem;
          font-weight: 500;
          color: #111827;
          line-height: 1.5;
          margin: 0;
        }

        @media (min-width: 640px) {
          .address-text {
            font-size: 1.125rem;
          }
        }

        .social-section {
          margin-top: auto;
          padding-top: 1.25rem;
          border-top: 1px solid #f3f4f6;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .social-section {
            margin-top: auto;
            padding-top: 1.5rem;
          }
        }

        .social-label {
          display: block;
          font-family: monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin-bottom: 0.75rem;
        }

        @media (min-width: 640px) {
          .social-label {
            font-size: 0.75rem;
            margin-bottom: 1rem;
          }
        }

        .social-links {
          display: flex;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .social-links {
            gap: 0.75rem;
          }
        }

        .social-link {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.625rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .social-link {
            width: 3rem;
            height: 3rem;
            border-radius: 0.75rem;
          }
        }

        .social-link:hover {
          transform: scale(1.1);
          color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .social-link.twitter:hover {
          background: #0ea5e9;
          border-color: #0ea5e9;
        }

        .social-link.instagram:hover {
          background: #db2777;
          border-color: #db2777;
        }

        .social-link.linkedin:hover {
          background: #2563eb;
          border-color: #2563eb;
        }

        .social-link.dribbble:hover {
          background: #ec4899;
          border-color: #ec4899;
        }

        .contact-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .contact-form {
            gap: 1.25rem;
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group-message {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 80px;
        }

        @media (min-width: 640px) {
          .form-group-message {
            min-height: 100px;
          }
        }

        .form-label {
          display: block;
          font-family: monospace;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          margin-bottom: 0.375rem;
        }

        @media (min-width: 640px) {
          .form-label {
            margin-bottom: 0.5rem;
          }
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 0.875rem;
          font-size: 0.9rem;
          color: #111827;
          background: #f9fafb;
          border: none;
          border-radius: 0.625rem;
          transition: all 0.2s ease;
        }

        @media (min-width: 640px) {
          .form-input,
          .form-textarea {
            padding: 0.875rem 1rem;
            font-size: 1rem;
            border-radius: 0.75rem;
          }
        }

        .form-input:hover,
        .form-textarea:hover {
          background: #f3f4f6;
        }

        .form-input:focus,
        .form-textarea:focus {
          background: white;
          outline: none;
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
        }

        .form-input.has-error:focus,
        .form-textarea.has-error:focus {
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #9ca3af;
        }

        .form-textarea {
          flex: 1;
          resize: none;
          min-height: 80px;
        }

        @media (min-width: 640px) {
          .form-textarea {
            min-height: 100px;
          }
        }

        .form-error {
          margin-top: 0.25rem;
          font-size: 0.7rem;
          color: #ef4444;
        }

        @media (min-width: 640px) {
          .form-error {
            font-size: 0.75rem;
          }
        }

        .form-submit {
          margin-top: 0.5rem;
        }

        .submit-button {
          position: relative;
          width: 100%;
          height: 3rem;
          padding: 0 1.5rem;
          border: none;
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: white;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .submit-button {
            height: 3.25rem;
            padding: 0 2rem;
            border-radius: 0.75rem;
            font-size: 1rem;
            gap: 0.625rem;
          }
        }

        .submit-button:hover {
          transform: scale(1.02);
        }

        .submit-button:active {
          transform: scale(1);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .button-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-200%);
          transition: transform 0.7s ease-in-out;
        }

        .submit-button:hover .button-shine {
          transform: translateX(200%);
        }

        .button-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}

export default observer(ContactSection)
