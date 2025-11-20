"use client"
import { useReveal } from "@/hooks/use-reveal"
import { products, type Product } from "@/lib/products"
import { ProductDetailModal } from "@/components/product-detail-modal"
import { useState } from "react"
import Image from "next/image"

export function ProductsSection() {
  const { ref: sectionRef, isVisible: isRevealed } = useReveal(0.3)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex min-h-screen w-screen shrink-0 flex-col px-4 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-8 md:px-12 md:pt-40 md:pb-12 lg:px-16 overflow-x-hidden"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className={`mb-6 sm:mb-8 md:mb-12 shrink-0 transition-all duration-1000 ${
              isRevealed ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-md"
            }`}
          >
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">Products</h2>
            <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-foreground/80">
              Explore our comprehensive range of premium dental supplies designed for excellence
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }} onWheel={(e) => e.stopPropagation()}>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm transition-all duration-700 hover:border-foreground/20 hover:bg-foreground/10 ${
                    isRevealed ? "translate-y-0 opacity-100 blur-0" : "translate-y-12 opacity-0 blur-md"
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="relative aspect-square overflow-hidden bg-foreground/5">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.name} - ${product.description}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-opacity duration-500 group-hover:opacity-80"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-4 text-left">
                    <h3 className="mb-1 font-sans text-base font-medium text-foreground transition-colors group-hover:text-foreground">
                      {product.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-foreground/70 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono text-lg font-semibold text-foreground">{product.price}</span>
                      <span className="text-xs text-foreground/60 transition-all group-hover:text-foreground/90">
                        View →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
