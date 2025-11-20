"use client"

import { useReveal } from "@/hooks/use-reveal"
import { useState } from "react"

const faqs = [
  {
    number: "1",
    question: "How to place an order?",
    answer:
      "If you're wondering how to place an order, we've got you covered. Our user-friendly platform makes ordering dental supplies a breeze. Simply browse our catalog, select the items you need, and proceed to checkout.",
  },
  {
    number: "2",
    question: "Payment & Shipping",
    answer:
      "When it comes to payment and shipping, we aim to provide a seamless experience. We offer various secure payment options and reliable shipping services to ensure your orders are delivered safely and on time.",
  },
  {
    number: "3",
    question: "Secure Ordering & Payment Options",
    answer:
      "Rest assured, your security is our priority. We have implemented robust measures for secure ordering and offer multiple payment options, giving you the flexibility and peace of mind while making transactions.",
  },
  {
    number: "4",
    question: "Returns & Refunds",
    answer:
      "We understand that returns and refunds are part of the purchasing process. Our dedicated team is here to guide you through the process and ensure that you have a hassle-free experience in case you need to return or seek a refund for any products.",
  },
]

export function FAQSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section ref={ref} className="flex min-h-screen w-screen shrink-0 flex-col px-4 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16 overflow-x-hidden"
      style={{
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
      }}
    >
      <div className="h-full flex flex-col">
        <h2
          className={`mb-6 sm:mb-8 md:mb-12 shrink-0 font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-none tracking-tight text-foreground whitespace-nowrap transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
          }`}
        >
          FAQ
        </h2>

        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center gap-3 sm:gap-4 md:gap-6 border-b border-foreground/10 py-5 sm:py-6 md:py-8 text-left transition-all duration-300 hover:border-foreground/20 touch-manipulation min-h-[60px]"
              >
                <div className="flex w-10 sm:w-12 md:w-16 shrink-0 items-center justify-center">
                  <span className="font-sans text-3xl sm:text-4xl md:text-5xl font-light text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60">
                    {faq.number}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center">
                    <h3 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-foreground transition-colors duration-300 group-hover:text-foreground/80 truncate">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      openIndex === index ? "max-h-96 opacity-100 mt-2 sm:mt-3" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-pretty font-sans text-sm sm:text-base md:text-lg leading-relaxed text-foreground/70">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end">
                  <div
                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-45" : "rotate-0"}`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-foreground/40 transition-colors duration-300 group-hover:text-foreground/60"
                    >
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
