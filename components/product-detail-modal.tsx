"use client"

import type { Product } from "@/lib/products"
import { products } from "@/lib/products"
import { MagneticButton } from "@/components/magnetic-button"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import Link from "next/link"
import { Plus, Minus, ShoppingBag, Check } from "lucide-react"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const imgWrapRef = useRef<HTMLDivElement | null>(null)
  const [imgCentered, setImgCentered] = useState(false)
  
  const { addItem: addToCart, isInCart } = useCart()

  // Get related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
  }, [product])

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1)
    setJustAdded(false)
  }, [product?.id])

  useEffect(() => {
    setMounted(true)
  }, [])

  // ESC key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      // Trigger animation after mount
      requestAnimationFrame(() => setIsVisible(true))
    } else {
      setIsVisible(false)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

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
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onClose}
      style={{
        backgroundColor: isVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 150ms ease-out",
      }}
    >
      <div
        ref={modalRef}
        className="glass relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl bg-black/40"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.98) translateY(8px)",
          transition: "opacity 150ms ease-out, transform 150ms ease-out",
        }}
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

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="mb-3 font-sans text-lg font-medium text-white">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-white/20 bg-white/10">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-12 w-12 items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(99, q + 1))}
                    className="flex h-12 w-12 items-center justify-center text-white/60 hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-white/60">
                  Total: <span className="font-semibold text-white">£{(parseFloat(product.price.replace(/[£,]/g, "")) * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <MagneticButton 
                size="lg" 
                variant="primary" 
                className="flex-1"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product, selectedColor)
                  }
                  toast.success(
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Proceeding to checkout with {quantity} item{quantity > 1 ? 's' : ''}</span>
                    </div>
                  )
                }}
              >
                Buy Now
              </MagneticButton>
              <MagneticButton 
                size="lg" 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product, selectedColor)
                  }
                  setJustAdded(true)
                  setTimeout(() => setJustAdded(false), 2000)
                  toast.success(
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <span>{quantity} × {product.name} added to cart!</span>
                    </div>
                  )
                }}
              >
                {justAdded ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Added!
                  </span>
                ) : (
                  `Add to Cart${quantity > 1 ? ` (${quantity})` : ''}`
                )}
              </MagneticButton>
            </div>

            {/* View full product link */}
            <Link
              href={`/products/${product.id}`}
              className="mt-4 block text-center text-sm text-white/60 hover:text-white transition-colors underline"
              onClick={onClose}
            >
              View full product details →
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/10 p-8">
            <h3 className="mb-4 font-sans text-xl font-medium text-white">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  onClick={onClose}
                  className="group flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-white/90">
                      {relatedProduct.name}
                    </h4>
                    <p className="text-sm font-semibold text-white/80 mt-1">
                      {relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
