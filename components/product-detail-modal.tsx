"use client"

import type { Product } from "@/lib/products"
import { MagneticButton } from "@/components/magnetic-button"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const imgWrapRef = useRef<HTMLDivElement | null>(null)
  const [imgCentered, setImgCentered] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const modal = modalRef.current
    if (!modal) return

    const handleScroll = () => {
      if (typeof window === 'undefined') return
      // Only enable on large screens
      if (window.innerWidth < 1024) return
      const scrollTop = modal.scrollTop
      // Threshold after which the image moves to center
      const threshold = 120
      setImgCentered(scrollTop > threshold)
    }

    modal.addEventListener('scroll', handleScroll, { passive: true })
    // initial check
    handleScroll()

    return () => {
      modal.removeEventListener('scroll', handleScroll)
    }
  }, [mounted])

  if (!isOpen || !product || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="glass relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl bg-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-8 left-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xl transition-all hover:bg-white/30 hover:rotate-90"
        >
          ✕
        </button>

        <div className="grid gap-8 p-8 pt-4 lg:grid-cols-[auto_1fr] lg:items-center">
          {/* Product Image - Fixed on scroll */}
          <div
            ref={imgWrapRef}
            className="relative lg:sticky"
            style={{
              top: imgCentered ? "50%" : "32px",
              transform: imgCentered ? "translateY(-50%)" : "translateY(0)",
              transition: "top 300ms ease, transform 300ms ease",
            }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="aspect-square relative flex items-center justify-center p-8 w-full lg:w-[400px]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} - ${product.description}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="mb-3 font-sans text-3xl font-light leading-tight text-white md:text-4xl">
              {product.name}
            </h2>
            <p className="mb-4 font-mono text-3xl font-semibold text-white">{product.price}</p>
            <p className="mb-6 text-base leading-relaxed text-white/90">{product.detailedDescription}</p>

            {/* Colors */}
            <div className="mb-6">
              <h3 className="mb-3 font-sans text-lg font-medium text-white">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    className={`group relative flex h-14 w-14 flex-col items-center justify-center rounded-lg border-2 transition-all ${
                      selectedColor === index
                        ? "scale-110 border-white shadow-lg"
                        : "border-white/30 hover:border-white/50"
                    }`}
                  >
                    <div
                      className="h-7 w-7 rounded-full border border-white/30"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="mt-0.5 text-[10px] text-white/80">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h3 className="mb-3 font-sans text-lg font-medium text-white">Specifications</h3>
              <div className="space-y-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between border-b border-white/20 pb-2 text-sm last:border-0"
                  >
                    <span className="text-white/70">{spec.label}</span>
                    <span className="font-medium text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-6">
              <h3 className="mb-3 font-sans text-lg font-medium text-white">Shipping Information</h3>
              <div className="space-y-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-white/70">🚚</span>
                  <div>
                    <div className="font-medium text-white">Standard Delivery</div>
                    <div className="text-xs text-white/80">{product.shipping.standard}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-white/70">⚡</span>
                  <div>
                    <div className="font-medium text-white">Express Delivery</div>
                    <div className="text-xs text-white/80">{product.shipping.express}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-white/70">🎁</span>
                  <div>
                    <div className="font-medium text-white">Free Shipping</div>
                    <div className="text-xs text-white/80">{product.shipping.freeShippingThreshold}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <MagneticButton size="lg" variant="primary" className="flex-1">
                Buy Now
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" className="flex-1">
                Add to Cart
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
