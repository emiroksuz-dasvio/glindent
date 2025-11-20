"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
import { MagneticButton } from "@/components/magnetic-button"

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      return
    }

    setIsSubmitting(true)

    // Simulate form submission (replace with actual API call later)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", email: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <section
      ref={ref}
      className="relative z-20 flex min-h-screen w-screen shrink-0 snap-start flex-col px-4 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16 overflow-x-hidden"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
      }}
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
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm touch-manipulation min-h-[120px] ${
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
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm min-h-[120px] ${
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
                  className={`flex flex-col items-center text-center p-4 sm:p-5 md:p-6 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full min-h-[120px] ${
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border-b-2 border-foreground/20 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:border-foreground focus:outline-none touch-manipulation min-h-12"
                    placeholder="Your name"
                  />
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full border-b-2 border-foreground/20 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:border-foreground focus:outline-none touch-manipulation min-h-12"
                    placeholder="your@email.com"
                  />
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
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full resize-none border-b-2 border-foreground/20 bg-transparent py-3 sm:py-3.5 text-sm sm:text-base text-foreground placeholder:text-foreground/30 transition-all focus:border-foreground focus:outline-none touch-manipulation"
                    placeholder="Tell us about your project..."
                  />
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
                  {submitSuccess && (
                    <p className="mt-4 text-center font-mono text-sm text-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
                      ✓ Message sent successfully!
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
