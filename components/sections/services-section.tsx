"use client"

import { useReveal } from "@/hooks/use-reveal"
import { useState } from "react"
import Image from "next/image"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-8 pt-20 md:px-16 md:pt-0 lg:px-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Our Products
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Premium dental supplies</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-x-16 md:gap-y-12 lg:gap-x-24">
          {[
            {
              title: "Zirconia Discs",
              description: "High-strength zirconia for all your restorative needs",
              direction: "top",
              image: "/dental-zirconia-discs-white-ceramic-material.jpg",
            },
            {
              title: "X-Ray Film",
              description: "Crystal-clear imaging for accurate diagnostics",
              direction: "right",
              image: "/dental-x-ray-film-medical-imaging.jpg",
            },
            {
              title: "Composite Materials",
              description: "Superior aesthetics with exceptional durability",
              direction: "left",
              image: "/dental-composite-materials-tooth-colored-filling.jpg",
            },
            {
              title: "Dental Instruments",
              description: "Precision tools for every procedure",
              direction: "bottom",
              image: "/dental-instruments-surgical-tools.jpg",
            },
          ].map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              index={i}
              isVisible={isVisible}
              onClick={() => setSelectedProduct(i)}
            />
          ))}
        </div>
      </div>

      {selectedProduct !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-foreground/20 bg-background/95 p-8 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20"
            >
              ✕
            </button>
            <Image
              src={
                [
                  "/placeholder.svg?height=400&width=600&query=dental zirconia discs white ceramic material",
                  "/placeholder.svg?height=400&width=600&query=dental x-ray film medical imaging",
                  "/placeholder.svg?height=400&width=600&query=dental composite materials tooth colored filling",
                  "/placeholder.svg?height=400&width=600&query=dental instruments surgical tools",
                ][selectedProduct] || "/placeholder.svg"
              }
              alt="Product"
              width={1200}
              height={640}
              className="mb-6 h-64 w-full rounded-xl object-cover"
            />
            <h3 className="mb-4 font-sans text-3xl font-light text-foreground">
              {["Zirconia Discs", "X-Ray Film", "Composite Materials", "Dental Instruments"][selectedProduct]}
            </h3>
            <p className="mb-6 text-foreground/80">
              {
                [
                  "Our premium zirconia discs offer exceptional strength and natural aesthetics for all your restorative dentistry needs. Available in multiple shades and translucencies.",
                  "Experience superior image quality with our advanced X-ray film technology. Perfect clarity for confident diagnosis and treatment planning.",
                  "Create beautiful, lasting restorations with our composite materials. Excellent shade matching and superior polish retention.",
                  "Professional-grade instruments designed for precision and durability. Ergonomic designs for comfortable, efficient procedures.",
                ][selectedProduct]
              }
            </p>
            <div className="flex gap-4">
              <button className="rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-all hover:brightness-90">
                Add to Cart
              </button>
              <button className="rounded-lg border border-foreground/20 px-6 py-3 font-medium text-foreground transition-colors hover:bg-foreground/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function ProductCard({
  product,
  index,
  isVisible,
  onClick,
}: {
  product: { title: string; description: string; direction: string; image: string }
  index: number
  isVisible: boolean
  onClick: () => void
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (product.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <button
      onClick={onClick}
      className={`group cursor-pointer text-left transition-all duration-700 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          width={800}
          height={320}
          className="h-48 w-full object-cover transition-opacity duration-500 group-hover:opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-foreground px-6 py-2 font-medium text-background">View Details</span>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
        <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
      </div>
      <h3 className="mb-2 font-sans text-2xl font-light text-foreground transition-colors duration-300 group-hover:text-foreground/80 md:text-3xl">
        {product.title}
      </h3>
      <p className="max-w-sm text-sm leading-relaxed text-foreground/80 transition-colors duration-300 group-hover:text-foreground/60 md:text-base">
        {product.description}
      </p>
    </button>
  )
}
