"use client"

import { useCart } from "@/lib/cart-context"
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { MagneticButton } from "./magnetic-button"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"

// Cart Dropdown Menu Component
export function CartMenu() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Open cart"
        aria-expanded={isOpen}
      >
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-white/30 bg-white/25 backdrop-blur-3xl shadow-2xl overflow-hidden z-9999"
          style={{
            animation: "fadeInScale 150ms ease-out forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/15">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-white" />
              <h2 className="text-sm font-medium text-white">Your Cart</h2>
              <span className="text-xs text-white/70">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-80 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingBag className="h-12 w-12 text-white/30 mb-3" />
                <p className="text-sm text-white/80">Your cart is empty</p>
                <p className="text-xs text-white/50 mt-1">Add items from the products section</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-xl bg-black/15 border border-white/20"
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white/30 shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-white/70 mt-0.5">
                        {item.product.colors[item.selectedColor]?.name || "Default"}
                      </p>
                      <p className="text-sm font-semibold text-white mt-1">
                        {item.product.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-white/50 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="flex items-center gap-1 bg-white/15 rounded-md border border-white/20">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-white/70 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-white/70 hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Subtotal</span>
                <span className="text-lg font-semibold text-white">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <MagneticButton variant="primary" size="lg" className="w-full">
                  Checkout
                </MagneticButton>
              </Link>
              <button
                onClick={() => {
                  clearCart()
                  toast.success("Cart cleared")
                }}
                className="w-full text-center text-xs text-white/50 hover:text-white transition-colors"
              >
                Clear cart
              </button>
            </div>
          )}
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
