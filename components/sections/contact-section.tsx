"use client"

import { Mail, MapPin, Phone, Send, Twitter, Instagram, Linkedin, Dribbble } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { toast } from "sonner"

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission (replace with actual API call later)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success("Message sent successfully! We'll get back to you soon.")
      setFormData({ name: "", email: "", message: "" })
      setErrors({})
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address")
      return
    }

    if (!validateEmail(newsletterEmail)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubscribing(true)

    try {
      // Simulate newsletter subscription (replace with actual API call later)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Thanks for subscribing! You'll receive our latest updates.")
      setNewsletterEmail("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <section
      ref={ref}
      className="relative z-20 flex min-h-screen w-screen shrink-0 snap-start flex-col px-6 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-16 md:pt-40 md:pb-12 lg:px-20 overflow-x-hidden"
    >
      <div className="h-full flex flex-col w-full">
        {/* Title */}
        <div
          className={`mb-8 sm:mb-12 shrink-0 transition-all duration-700 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-none tracking-tight text-foreground whitespace-nowrap">
            Let's talk
          </h2>
          <p className="mt-2 font-mono text-sm text-foreground/60">/ Get in touch</p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left side - Contact Info & Socials */}
          <div className="lg:w-[40%] flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              {/* Email Box */}
              <a
                href="mailto:info@glindent.co.uk"
                className={`group flex items-center gap-5 p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-foreground group-hover:bg-white/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1">Email</span>
                  <span className="text-base sm:text-lg text-foreground font-medium">info@glindent.co.uk</span>
                </div>
              </a>

              {/* Phone Box */}
              <div
                className={`group flex items-center gap-5 p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-foreground group-hover:bg-white/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1">Phone</span>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <a href="tel:01202402675" className="text-base sm:text-lg text-foreground font-medium hover:text-white/80 transition-colors">01202 402675</a>
                    <span className="hidden sm:block text-foreground/40">|</span>
                    <a href="tel:07717886717" className="text-base sm:text-lg text-foreground font-medium hover:text-white/80 transition-colors">07717 886717</a>
                  </div>
                </div>
              </div>

              {/* Address Box */}
              <div
                className={`group flex items-center gap-5 p-5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-foreground group-hover:bg-white/20 transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1">Address</span>
                  <p className="text-base sm:text-lg text-foreground font-medium leading-snug">
                    Bourne House, 23 Hinton Road<br />
                    Bournemouth, BH1 2EF
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div
              className={`flex flex-col gap-4 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider">Follow Us</span>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Dribbble, label: "Dribbble" }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-foreground transition-all hover:bg-white hover:text-[#007A72] hover:scale-110"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="lg:w-[60%]">
            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <label className="mb-2 block font-mono text-xs text-foreground/60 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-base text-foreground placeholder:text-foreground/30 transition-all focus:bg-white/10 focus:outline-none ${
                      errors.name ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                >
                  <label className="mb-2 block font-mono text-xs text-foreground/60 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-base text-foreground placeholder:text-foreground/30 transition-all focus:bg-white/10 focus:outline-none ${
                      errors.email ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-white/30"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <label className="mb-2 block font-mono text-xs text-foreground/60 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: undefined })
                  }}
                  className={`w-full resize-none rounded-xl border bg-white/5 px-4 py-3.5 text-base text-foreground placeholder:text-foreground/30 transition-all focus:bg-white/10 focus:outline-none ${
                    errors.message ? "border-red-400 focus:border-red-400" : "border-white/10 focus:border-white/30"
                  }`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              <div
                className={`transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: "500ms" }}
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[200px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>

        {/* Newsletter Signup - Integrated at bottom */}
        <div
          className={`mt-12 sm:mt-16 border-t border-white/20 pt-8 sm:pt-12 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-sans text-2xl font-light text-foreground mb-2">
                Stay updated
              </h3>
              <p className="text-sm text-foreground/60 max-w-md">
                Subscribe to our newsletter for the latest products, dental tips, and exclusive offers.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 w-full md:w-auto md:min-w-[400px]">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 transition-all focus:bg-white/15 focus:border-white/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="flex items-center justify-center px-6 rounded-xl bg-white text-[#007A72] font-medium transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
