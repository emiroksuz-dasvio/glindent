"use client"

import { useParams, useRouter } from "next/navigation"
import { getProductById } from "@/lib/products"
import { MagneticButton } from "@/components/magnetic-button"
import { useState, useEffect } from "react"
import { GrainOverlay } from "@/components/grain-overlay"
import { GlindentLogo } from "@/components/glindent-logo"
import Image from "next/image"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const product = getProductById(params.id as string)
  const [selectedColor, setSelectedColor] = useState(0)

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    if (!product) return

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.detailedDescription,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": "Glindent"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://glindent.co.uk/products/${product.id}`,
        "priceCurrency": "GBP",
        "price": product.price.replace(/[£,]/g, ''),
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Glindent"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "24"
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Update meta tags dynamically
    document.title = `${product.name} | Glindent`
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', product.detailedDescription)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = product.detailedDescription
      document.head.appendChild(meta)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [product])

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-light text-foreground">Product not found</h1>
          <MagneticButton onClick={() => router.push("/")} variant="primary">
            Return Home
          </MagneticButton>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <GrainOverlay />

      <header
        className="fixed left-0 right-0 top-0 z-40"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: '1px solid var(--header-border)'
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => router.push("/")} className="transition-all hover:brightness-90 p-2 rounded-md">
            <GlindentLogo variant="green" className="h-8 w-auto" />
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground px-2 py-1 rounded-md"
          >
            <span>←</span>
            <span>Back to Products</span>
          </button>
          <div className="font-mono text-sm text-foreground/40">Product Details</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <div className="aspect-square relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={`${product.name} - Premium dental supply from Glindent`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 font-sans text-4xl font-light leading-tight text-foreground md:text-5xl">
              {product.name}
            </h1>
            <p className="mb-6 font-mono text-4xl font-semibold text-foreground">{product.price}</p>
            <p className="mb-8 text-lg leading-relaxed text-foreground/80">{product.detailedDescription}</p>

            <div className="mb-8">
              <h3 className="mb-4 font-sans text-xl font-medium text-foreground">Available Colors</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(index)}
                    className={`group relative flex h-16 w-16 flex-col items-center justify-center rounded-xl border-2 transition-all ${
                      selectedColor === index
                        ? "scale-110 border-foreground shadow-lg"
                        : "border-foreground/20 hover:border-foreground/40"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full border border-foreground/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="mt-1 text-xs text-foreground/70">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 font-sans text-xl font-medium text-foreground">Specifications</h3>
              <div className="space-y-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between border-b border-foreground/10 pb-3 last:border-0"
                  >
                    <span className="text-foreground/60">{spec.label}</span>
                    <span className="font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 font-sans text-xl font-medium text-foreground">Shipping Information</h3>
              <div className="space-y-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-foreground/60">🚚</span>
                  <div>
                    <div className="font-medium text-foreground">Standard Delivery</div>
                    <div className="text-sm text-foreground/70">{product.shipping.standard}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-foreground/60">⚡</span>
                  <div>
                    <div className="font-medium text-foreground">Express Delivery</div>
                    <div className="text-sm text-foreground/70">{product.shipping.express}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-foreground/60">🎁</span>
                  <div>
                    <div className="font-medium text-foreground">Free Shipping</div>
                    <div className="text-sm text-foreground/70">{product.shipping.freeShippingThreshold}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <MagneticButton size="lg" variant="primary" className="flex-1">
                Buy Now
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" className="flex-1">
                Add to Cart
              </MagneticButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
