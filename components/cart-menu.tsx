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
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl overflow-hidden z-50"
          style={{
            animation: "fadeInScale 150ms ease-out forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-gray-900" />
              <h2 className="text-sm font-medium text-gray-900">Your Cart</h2>
              <span className="text-xs text-gray-500">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-80 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-200 mb-3" />
                <p className="text-sm text-gray-900">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">Add items from the products section</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="group relative flex gap-4 p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate pr-4">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.product.colors[item.selectedColor]?.name || "Default"}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold text-gray-900">
                          {item.product.price}
                        </p>
                        
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-medium text-gray-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  £{totalPrice.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
                  <button
                    className="group relative w-full h-12 rounded-xl font-semibold text-sm text-white hover:scale-[1.02] active:scale-100 transition-all duration-300 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                    }}
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                    <span className="relative flex items-center justify-center gap-2">
                      Checkout
                    </span>
                  </button>
                </Link>
                
                <button
                  onClick={() => {
                    clearCart()
                    toast.success("Cart cleared")
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
                >
                  Clear cart
                </button>
              </div>
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
