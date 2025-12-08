"use client"

import { useCart } from "@/lib/cart-context"
import { GrainOverlay } from "@/components/grain-overlay"
import { GlindentLogo } from "@/components/glindent-logo"
import { MagneticButton } from "@/components/magnetic-button"
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
      <GrainOverlay />
      <AnimatedBackground />

      {/* Header - exact same as main page */}
      <nav
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 md:px-16 md:py-6"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      >
        <Link href="/" className="flex items-center gap-2 transition-transform active:scale-95 touch-manipulation min-h-11">
          <GlindentLogo variant="white" className="h-7 sm:h-8 md:h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md shadow-sm border border-white/10">
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
            <div className="bg-white rounded-3xl p-12 max-w-md mx-auto shadow-lg shadow-black/5">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
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
              <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">1</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-gray-900">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Phone Number <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                      placeholder="+44 1234 567890"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">2</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Company <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                      placeholder="Dental Practice Ltd"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                      placeholder="123 High Street"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Apartment, suite, etc. <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                      placeholder="Suite 100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-xs text-gray-500 uppercase tracking-wider">Postcode</label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 text-base placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-all duration-200"
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
                      <div className="h-5 w-5 rounded-md border-2 border-gray-300 bg-gray-50 peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-all duration-200" />
                      <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Save this information for next time</span>
                  </label>
                </div>
              </section>

              {/* Payment Info */}
              <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-700" />
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900">Payment Method</h2>
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-sm font-medium mb-1">
                    Payment integration coming soon
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    We accept all major credit cards, PayPal, and bank transfers.
                    <br />Orders will be processed manually for now.
                  </p>
                </div>
              </section>

              {/* Submit Button (Mobile) */}
              <div className="lg:hidden pt-2 pb-4">
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="group relative w-full h-14 rounded-xl font-semibold text-base text-white hover:scale-[1.02] active:scale-100 transition-all duration-300 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                  }}
                >
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isProcessing ? "Processing..." : `Place Order • £${grandTotal.toFixed(2)}`}
                  </span>
                </button>
              </div>
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:sticky lg:top-32 h-fit space-y-5"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-black/5">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-medium text-gray-900 flex items-center gap-3">
                      <Package className="h-5 w-5 text-teal-600" />
                      Order Summary
                    </h2>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{totalItems} items</span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="p-5 sm:p-6 space-y-4 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                  {items.map((item) => (
                    <div key={item.product.id} className="group relative flex gap-4 p-3 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
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
                              onClick={() => {
                                removeItem(item.product.id)
                                toast.success(`${item.product.name} removed`)
                              }}
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
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              £{(parseFloat(item.product.price.replace(/[£,]/g, "")) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
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

                {/* Totals */}
                <div className="p-6 border-t border-gray-100 space-y-3 bg-white">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span className="text-gray-900 font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `£${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {totalPrice < 100 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 py-2 px-3 bg-teal-50 rounded-lg border border-teal-100">
                      <Truck className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span>Add £{(100 - totalPrice).toFixed(2)} more for free shipping</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-gray-100 items-end">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">£{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button (Desktop) */}
                <div className="p-6 pt-0 hidden lg:block bg-white">
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="group relative w-full h-14 rounded-xl font-semibold text-base text-white hover:scale-[1.02] active:scale-100 transition-all duration-300 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
                    }}
                  >
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isProcessing ? "Processing..." : "Place Order"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl p-4 flex items-center justify-around shadow-lg shadow-black/5">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Secure</span>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Fast Delivery</span>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Package className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Quality</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}
