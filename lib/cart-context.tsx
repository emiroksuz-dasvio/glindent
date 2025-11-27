"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, selectedColor?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "glindent-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (product: Product, selectedColor = 0) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, selectedColor }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price.replace(/[£,]/g, ""))
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
