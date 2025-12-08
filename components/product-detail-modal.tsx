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
import { Plus, Minus, ShoppingBag, Check, X } from "lucide-react"

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
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
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (typeof window === 'undefined') return
      // Only enable on large screens
      if (window.innerWidth < 1024) return
      const scrollTop = scrollContainer.scrollTop
      // Threshold after which the image moves to center
      const threshold = 120
      setImgCentered(scrollTop > threshold)
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    // initial check
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
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
        className="relative flex flex-col max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.98) translateY(8px)",
          transition: "opacity 150ms ease-out, transform 150ms ease-out",
        }}
      >
        {/* Close Button - Fixed Position */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-900 hover:rotate-90 hover:scale-110"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-8 pt-12 lg:p-12"
        >
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-start">
            {/* Product Image */}
            <div
              ref={imgWrapRef}
              className="relative lg:sticky"
              style={{
                top: imgCentered ? "50%" : "0px",
                transform: imgCentered ? "translateY(-50%)" : "translateY(0)",
                transition: "top 300ms ease, transform 300ms ease",
              }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 p-8">
                <div className="aspect-square relative flex items-center justify-center w-full lg:w-[400px]">
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
              <h2 className="mb-3 font-sans text-3xl font-light leading-tight text-gray-900 md:text-4xl">
                {product.name}
              </h2>
              <p className="mb-4 font-mono text-3xl font-semibold text-teal-600">{product.price}</p>
              <p className="mb-8 text-base leading-relaxed text-gray-600">{product.detailedDescription}</p>

              {/* Colors */}
              <div className="mb-8">
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-gray-500">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      className={`group relative flex h-14 w-14 flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                        selectedColor === index
                          ? "ring-2 ring-teal-500 ring-offset-2 bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className="h-6 w-6 rounded-full shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="mt-1 text-[10px] font-medium text-gray-600">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-gray-500">Specifications</h3>
                <div className="space-y-1 rounded-2xl bg-gray-50 p-6">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between py-2 text-sm border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-500">{spec.label}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="mb-8">
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-gray-500">Shipping Information</h3>
                <div className="space-y-4 rounded-2xl bg-gray-50 p-6">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-lg">🚚</span>
                    <div>
                      <div className="font-medium text-gray-900">Standard Delivery</div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.shipping.standard}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-lg">⚡</span>
                    <div>
                      <div className="font-medium text-gray-900">Express Delivery</div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.shipping.express}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-lg">🎁</span>
                    <div>
                      <div className="font-medium text-gray-900">Free Shipping</div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.shipping.freeShippingThreshold}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-gray-500">Quantity</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-medium text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(99, q + 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-teal-600 text-lg ml-2">£{(parseFloat(product.price.replace(/[£,]/g, "")) * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  className="group relative flex-1 h-14 overflow-hidden rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                  }}
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
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Buy Now</span>
                  </span>
                </button>

                <button
                  className="group flex-1 h-14 rounded-xl border-2 border-gray-200 bg-white font-semibold text-gray-900 transition-all duration-300 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50"
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
                  <span className="flex items-center justify-center gap-2">
                    {justAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="mb-4 font-sans text-lg font-medium text-gray-900">You might also like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-xs font-semibold text-gray-900">
                        {relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
