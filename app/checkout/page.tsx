"use client"

import { useCart } from "@/lib/cart-context"
import { GrainOverlay } from "@/components/grain-overlay"
import { GlindentLogo } from "@/components/glindent-logo"
import { MagneticButton } from "@/components/magnetic-button"
import { CustomCursor } from "@/components/custom-cursor"
import { AnimatedBackground } from "@/components/animated-background"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Shield, Check, Package } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  company: string
  address: string
  apartment: string
  city: string
  postcode: string
  phone: string
  saveInfo: boolean
}

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    postcode: "",
    phone: "",
    saveInfo: false,
  })

  const shippingCost = totalPrice >= 100 ? 0 : 5.99
  const grandTotal = totalPrice + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success("Order placed successfully! We'll send you a confirmation email shortly.")
    clearCart()
    setIsProcessing(false)
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <CustomCursor />
      <GrainOverlay />
      <AnimatedBackground />

      {/* Header - exact same as main page */}
      <nav
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 md:px-16 md:py-6"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid var(--header-border)'
        }}
      >
        <Link href="/" className="flex items-center gap-2 transition-transform active:scale-95 touch-manipulation min-h-11">
          <GlindentLogo variant="white" className="h-7 sm:h-8 md:h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Secure Checkout</span>
          </div>
        </div>
      </nav>

      {/* Main Content - matches section layout exactly */}
      <div className="relative z-10 flex min-h-screen w-full flex-col px-6 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-16 md:pt-40 md:pb-12 lg:px-20">
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <Link 
            href="/"
            className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>
        </motion.div>

        {/* Title - matches other section titles */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-none tracking-tight text-foreground mb-6 sm:mb-8 md:mb-12"
        >
          Checkout
        </motion.h1>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-1 flex-col items-center justify-center text-center py-12"
          >
            <div className="glass rounded-3xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-light text-white mb-3">Your cart is empty</h2>
              <p className="text-white/60 mb-8 text-sm leading-relaxed">
                Looks like you haven't added any products yet. Browse our collection of premium dental supplies.
              </p>
              <Link href="/">
                <MagneticButton variant="primary" size="lg">
                  Browse Products
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 grid lg:grid-cols-[1fr_440px] gap-6 lg:gap-10 xl:gap-16">
            {/* Left Column - Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              {/* Contact Information */}
              <section className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">1</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-white">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2.5">Phone Number <span className="text-white/40">(optional)</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                      placeholder="+44 1234 567890"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">2</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-white">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2.5">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2.5">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2.5">Company <span className="text-white/40">(optional)</span></label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                      placeholder="Dental Practice Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2.5">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                      placeholder="123 High Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2.5">Apartment, suite, etc. <span className="text-white/40">(optional)</span></label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                      placeholder="Suite 100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2.5">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2.5">Postcode</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3.5 text-white text-base placeholder:text-white/35 focus:border-white/25 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all duration-200"
                        placeholder="SW1A 1AA"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-4 group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="h-5 w-5 rounded-md border-2 border-white/20 bg-white/5 peer-checked:bg-white peer-checked:border-white transition-all duration-200" />
                      <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Save this information for next time</span>
                  </label>
                </div>
              </section>

              {/* Payment Info */}
              <section className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-white" />
                    <h2 className="text-lg sm:text-xl font-medium text-white">Payment Method</h2>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 border-2 border-dashed border-white/15 p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-white/50" />
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    Payment integration coming soon
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    We accept all major credit cards, PayPal, and bank transfers.
                    <br />Orders will be processed manually for now.
                  </p>
                </div>
              </section>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden pt-2 pb-4">
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full min-h-14"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Place Order • £${grandTotal.toFixed(2)}`}
                </MagneticButton>
              </div>
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:sticky lg:top-32 h-fit space-y-5"
            >
              <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-medium text-white flex items-center gap-3">
                      <Package className="h-5 w-5" />
                      Order Summary
                    </h2>
                    <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">{totalItems} items</span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="p-5 sm:p-6 space-y-4 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                      <div className="relative h-18 w-18 rounded-xl overflow-hidden bg-white/10 shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-white/50 mb-2">
                          {item.product.colors[item.selectedColor]?.name || "Default"}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5 bg-white/10 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-l-lg transition-all"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium text-white w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-r-lg transition-all"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              removeItem(item.product.id)
                              toast.success(`${item.product.name} removed`)
                            }}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-bold text-white">
                          £{(parseFloat(item.product.price.replace(/[£,]/g, "")) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          £{item.product.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="p-5 sm:p-6 border-t border-white/10 space-y-3 bg-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span className="text-white font-medium">£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span className="text-white font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : (
                        `£${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {totalPrice < 100 && (
                    <div className="flex items-center gap-2 text-xs text-white/50 py-2 px-3 bg-white/5 rounded-lg">
                      <Truck className="h-3.5 w-3.5 shrink-0" />
                      <span>Add £{(100 - totalPrice).toFixed(2)} more for free shipping</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-2xl font-bold text-white">£{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button (Desktop) */}
                <div className="p-5 sm:p-6 pt-0 hidden lg:block">
                  <MagneticButton
                    variant="primary"
                    size="lg"
                    className="w-full min-h-14"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </MagneticButton>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="glass rounded-2xl p-4 flex items-center justify-around">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white/70" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">Secure</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white/70" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">Fast Delivery</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white/70" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
