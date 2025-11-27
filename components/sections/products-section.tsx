"use client"
import { useReveal } from "@/hooks/use-reveal"
import { products, categories, type Product, type ProductCategory } from "@/lib/products"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductsSection() {
  const { ref: sectionRef, isVisible: isRevealed } = useReveal(0.3)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex min-h-screen w-screen shrink-0 flex-col px-6 pt-24 pb-6 sm:px-8 sm:pt-28 sm:pb-8 md:px-16 md:pt-40 md:pb-12 lg:px-20 overflow-x-hidden"
      >
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 sm:mb-8 md:mb-12 shrink-0"
          >
            {/* Title and Search/Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">Products</h2>
              
              {/* Search and Filter */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 lg:items-center"
              >
                {/* Search Input */}
                <div className="relative w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-foreground/20 bg-foreground/5 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/40 focus:outline-none transition-colors duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-colors duration-200 ${
                      selectedCategory === "all"
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`rounded-xl px-4 py-2 text-xs font-medium transition-colors duration-200 ${
                        selectedCategory === cat.value
                          ? "bg-foreground text-background"
                          : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }} onWheel={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <p className="text-foreground/60 text-lg">No products found</p>
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                    className="mt-2 text-sm text-foreground/80 underline hover:text-foreground transition-colors"
                  >
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${selectedCategory}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: Math.min(index * 0.05, 0.3),
                        ease: "easeOut"
                      }}
                      onClick={() => handleProductClick(product)}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm text-left transition-colors duration-200 hover:border-foreground/20 hover:bg-foreground/8"
                    >
                      <div className="relative aspect-square overflow-hidden bg-foreground/5">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.name} - ${product.description}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <h3 className="mb-1 font-sans text-base font-medium text-foreground">
                          {product.name}
                        </h3>
                        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-foreground/70 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-mono text-lg font-semibold text-foreground">{product.price}</span>
                          <span className="text-xs text-foreground/60 transition-colors duration-200 group-hover:text-foreground">
                            View →
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
