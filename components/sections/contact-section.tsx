"use client"

import { MapPin, Phone, Send, Instagram, Linkedin, Mail } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"
import { useState, type FormEvent } from "react"
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

  return (
    <section
      ref={ref}
      className="relative z-20 flex min-h-screen w-screen shrink-0 snap-start flex-col px-6 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-16 md:pt-40 md:pb-12 lg:px-20 overflow-x-hidden"
    >
      <div className="flex-1 flex flex-col w-full justify-start">
        {/* Title */}
        <div
          className={`mb-6 sm:mb-8 md:mb-12 shrink-0 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-none tracking-tight text-foreground whitespace-nowrap">
            Let's talk
          </h2>
          <p className="mt-2 font-mono text-sm text-foreground/60">/ Get in touch</p>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start lg:items-stretch overflow-y-auto lg:overflow-y-visible max-h-[calc(100vh-20rem)] lg:max-h-none">
          
          {/* Left Card - Contact Information */}
          <div 
            className={`flex flex-col justify-between rounded-3xl bg-white p-8 sm:p-10 shadow-md shadow-black/5 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Contact Information</h3>
              <p className="text-gray-500 mb-10">Fill up the form and our Team will get back to you within 24 hours.</p>
              
              <div className="space-y-8">
                {/* Email */}
                <a href="mailto:info@glindent.co.uk" className="group flex items-start gap-5 transition-transform hover:translate-x-2 duration-300">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)" }}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-1">Email</span>
                    <span className="text-lg text-gray-900 font-medium group-hover:text-teal-600 transition-colors">info@glindent.co.uk</span>
                  </div>
                </a>

                {/* Phone */}
                <div className="group flex items-start gap-5 transition-transform hover:translate-x-2 duration-300">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)" }}
                  >
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</span>
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <a href="tel:01202402675" className="text-lg text-gray-900 font-medium hover:text-teal-600 transition-colors">01202 402675</a>
                      <span className="hidden sm:block text-gray-300">|</span>
                      <a href="tel:07717886717" className="text-lg text-gray-900 font-medium hover:text-teal-600 transition-colors">07717 886717</a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="group flex items-start gap-5 transition-transform hover:translate-x-2 duration-300">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)" }}
                  >
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-1">Address</span>
                    <p className="text-lg text-gray-900 font-medium leading-snug">
                      Bourne House, 23 Hinton Road<br />
                      Bournemouth, BH1 2EF
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <span className="font-mono text-xs text-gray-400 uppercase tracking-wider block mb-5">Follow Us</span>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: "Instagram", href: "#", color: "hover:bg-pink-600 hover:border-pink-600" },
                  { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:bg-blue-600 hover:border-blue-600" }
                ].map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-300 hover:text-white hover:scale-110 hover:shadow-lg ${color}`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card - Contact Form */}
          <div 
            className={`flex flex-col rounded-3xl bg-white p-8 sm:p-10 shadow-md shadow-black/5 transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.name ? "focus:ring-red-400" : "focus:ring-teal-500/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className={`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.email ? "focus:ring-red-400" : "focus:ring-teal-500/20"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[120px]">
                <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    if (errors.message) setErrors({ ...errors, message: undefined })
                  }}
                  className={`w-full flex-1 resize-none rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.message ? "focus:ring-red-400" : "focus:ring-teal-500/20"
                  }`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full h-14 px-8 rounded-xl font-semibold text-base transition-all duration-300 overflow-hidden flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                  }}
                >
                  {/* Shine effect on hover */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                  
                  {/* Button content */}
                  <span className="relative flex items-center gap-2.5 text-white">
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
