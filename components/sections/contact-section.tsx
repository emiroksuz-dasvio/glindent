"use client"

import { Mail, MapPin, Phone, Send } from "lucide-react"
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
      <div className="h-full flex flex-col">
        {/* Title */}
        <div
          className={`mb-6 sm:mb-8 md:mb-12 shrink-0 transition-all duration-700 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-none tracking-tight text-foreground whitespace-nowrap">
            Let's talk
          </h2>
          <p className="mt-1.5 sm:mt-2 font-mono text-xs sm:text-sm text-foreground/60">/ Get in touch</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-20 xl:gap-24">
            {/* Left side - Contact Info Boxes */}
            <div className="lg:w-[42%]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Email Box */}
                <a
                  href="mailto:info@glindent.co.uk"
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl touch-manipulation min-h-[120px] transition-all duration-500 hover:bg-white/20 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "100ms" }}
                >
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-foreground mb-2 sm:mb-3" />
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1.5 sm:mb-2">Email</span>
                  <p className="text-sm sm:text-base text-foreground break-all">
                    info@glindent.co.uk
                  </p>
                </a>

                {/* Phone Box */}
                <div
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl min-h-[120px] transition-all duration-500 hover:bg-white/20 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-foreground mb-2 sm:mb-3" />
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1.5 sm:mb-2">Phone</span>
                  <div className="flex flex-col gap-1">
                    <a
                      href="tel:01202402675"
                      className="text-sm sm:text-base text-foreground touch-manipulation"
                    >
                      01202 402675
                    </a>
                    <a
                      href="tel:07717886717"
                      className="text-sm sm:text-base text-foreground touch-manipulation"
                    >
                      07717 886717
                    </a>
                  </div>
                </div>

                {/* Address Box - Centered below first two */}
                <div
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full min-h-[120px] transition-all duration-500 hover:bg-white/20 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  }`}
                  style={{ transitionDelay: "300ms" }}
                >
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-foreground mb-2 sm:mb-3" />
                  <span className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1.5 sm:mb-2">Address</span>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground">
                    Bourne House, 23 Hinton Road<br />
                    Bournemouth, BH1 2EF
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div
                className={`flex flex-wrap justify-center sm:justify-start lg:justify-between items-center w-full pt-6 sm:pt-8 md:pt-10 lg:pt-20 gap-3 sm:gap-4 transition-all duration-700 ${
                  isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                {["Twitter", "Instagram", "LinkedIn", "Dribbble"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="group relative lg:flex-1 text-center font-mono text-xs text-foreground/60 uppercase tracking-wider transition-all hover:text-foreground touch-manipulation min-h-11 flex items-center px-2"
                  >
                    {social}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right side - Contact Form */}
            <div className="lg:w-[52%]">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                    className={`w-full border-b-2 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:outline-none touch-manipulation min-h-12 ${
                      errors.name ? "border-red-400 focus:border-red-400" : "border-foreground/20 focus:border-foreground"
                    }`}
                    placeholder="Your name"
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
                    className={`w-full border-b-2 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:outline-none touch-manipulation min-h-12 ${
                      errors.email ? "border-red-400 focus:border-red-400" : "border-foreground/20 focus:border-foreground"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
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
                    rows={5}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value })
                      if (errors.message) setErrors({ ...errors, message: undefined })
                    }}
                    className={`w-full resize-none border-b-2 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:outline-none touch-manipulation ${
                      errors.message ? "border-red-400 focus:border-red-400" : "border-foreground/20 focus:border-foreground"
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
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </MagneticButton>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Newsletter Signup - Full Width */}
        <div
          className={`w-full mt-6 sm:mt-8 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="p-4 sm:p-5 md:p-6 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-mono text-xs text-foreground/60 uppercase tracking-wider mb-1">
                  Newsletter
                </h3>
                <p className="text-sm text-foreground/80">
                  Subscribe for updates on new products, tips, and exclusive offers.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 md:min-w-[320px]">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 border-b-2 border-foreground/20 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 transition-all focus:border-foreground focus:outline-none touch-manipulation min-h-10"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="flex items-center justify-center p-2 rounded-lg bg-white/95 text-[#1a365d] transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-10 min-w-10"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
