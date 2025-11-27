export type ProductCategory = "zirconia" | "imaging" | "composites" | "accessories"

export interface Product {
  id: string
  name: string
  price: string
  image: string
  description: string
  detailedDescription: string
  category: ProductCategory
  colors: {
    name: string
    hex: string
  }[]
  specifications: {
    label: string
    value: string
  }[]
  shipping: {
    standard: string
    express: string
    freeShippingThreshold: string
  }
}

export const categories: { value: ProductCategory; label: string }[] = [
  { value: "zirconia", label: "Zirconia Discs" },
  { value: "imaging", label: "Imaging" },
  { value: "composites", label: "Composites" },
  { value: "accessories", label: "Accessories" },
]

export const products: Product[] = [
  {
    id: "pre-shaded-zirconia",
    name: "Pre Shaded (Super Translucency) Zirconia Disc",
    price: "£46.00",
    image: "/products/pre-shaded-zirconia.jpg",
    description: "High-quality pre-shaded zirconia disc with superior translucency for natural-looking restorations.",
    detailedDescription:
      "Our pre-shaded zirconia discs offer exceptional translucency and natural aesthetics, perfect for anterior restorations. The super translucent formula provides lifelike color gradients that mimic natural teeth, reducing chairside time and improving patient satisfaction.",
    category: "zirconia",
    colors: [
      { name: "A1", hex: "#F5F5DC" },
      { name: "A2", hex: "#F0E68C" },
      { name: "A3", hex: "#E6D8AD" },
      { name: "B1", hex: "#FAEBD7" },
    ],
    specifications: [
      { label: "Material", value: "Zirconia (ZrO2)" },
      { label: "Translucency", value: "Super High (>50%)" },
      { label: "Flexural Strength", value: "1200 MPa" },
      { label: "Disc Diameter", value: "98mm" },
      { label: "Thickness", value: "10-25mm" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "x-ray-film",
    name: "Self-Developing X-Ray Film (x 25)",
    price: "£50.00",
    image: "/products/x-ray-film.jpg",
    description: "Convenient self-developing X-ray film pack containing 25 sheets for quick and reliable imaging.",
    detailedDescription:
      "Self-developing X-ray films that eliminate the need for processing equipment. Perfect for chairside diagnostics with instant results. High-resolution imaging with excellent contrast for accurate diagnosis.",
    category: "imaging",
    colors: [{ name: "Standard", hex: "#E8E8E8" }],
    specifications: [
      { label: "Film Size", value: "30mm x 40mm" },
      { label: "Pack Quantity", value: "25 sheets" },
      { label: "Development Time", value: "Self-developing" },
      { label: "Resolution", value: "20 lp/mm" },
      { label: "Shelf Life", value: "24 months" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "multi-layer-zirconia",
    name: "Multi-Layer (Super High Translucency) Zirconia Disc",
    price: "£119.00",
    image: "/products/multi-layer-zirconia.jpg",
    description: "Premium multi-layer zirconia disc with exceptional translucency for aesthetic anterior restorations.",
    detailedDescription:
      "Our multi-layer zirconia discs feature gradient translucency from cervical to incisal areas, providing the most natural-looking restorations. Ideal for highly aesthetic cases where lifelike appearance is critical.",
    category: "zirconia",
    colors: [
      { name: "BL1", hex: "#F8F8F0" },
      { name: "BL2", hex: "#F5F5E8" },
      { name: "BL3", hex: "#F0F0DC" },
      { name: "BL4", hex: "#EBE8D0" },
    ],
    specifications: [
      { label: "Material", value: "Multi-layer Zirconia" },
      { label: "Translucency", value: "Super High (>55%)" },
      { label: "Flexural Strength", value: "1100 MPa" },
      { label: "Disc Diameter", value: "98mm" },
      { label: "Layers", value: "5 gradient layers" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "white-zirconia",
    name: "White (High Translucency) Zirconia Disc",
    price: "£39.00",
    image: "/products/white-zirconia.jpg",
    description: "Versatile white zirconia disc with high translucency for both anterior and posterior applications.",
    detailedDescription:
      "Our white zirconia discs offer excellent versatility for all restoration types. High translucency provides good aesthetics while maintaining superior strength for posterior applications.",
    category: "zirconia",
    colors: [{ name: "White", hex: "#FFFFFF" }],
    specifications: [
      { label: "Material", value: "Zirconia (ZrO2)" },
      { label: "Translucency", value: "High (45%)" },
      { label: "Flexural Strength", value: "1400 MPa" },
      { label: "Disc Diameter", value: "98mm" },
      { label: "Thickness", value: "10-25mm" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "modelling-wax",
    name: "Dental Modelling Wax",
    price: "£19.00",
    image: "/products/modelling-wax.jpg",
    description: "Professional-grade modelling wax for precise dental work and temporary restorations.",
    detailedDescription:
      "High-quality modelling wax with excellent carving properties and dimensional stability. Perfect for wax-ups, temporary restorations, and diagnostic models.",
    category: "accessories",
    colors: [
      { name: "Pink", hex: "#FFB6C1" },
      { name: "Blue", hex: "#87CEEB" },
      { name: "Green", hex: "#90EE90" },
    ],
    specifications: [
      { label: "Type", value: "Modelling Wax" },
      { label: "Melting Point", value: "65°C" },
      { label: "Weight", value: "250g" },
      { label: "Hardness", value: "Medium" },
      { label: "Application", value: "All dental wax-ups" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "g-ceram-blocks",
    name: "G-Ceram Blocks",
    price: "£75.00",
    image: "/products/g-ceram-blocks.jpg",
    description: "High-strength ceramic blocks for CAD/CAM fabrication of durable dental restorations.",
    detailedDescription:
      "Premium ceramic blocks designed for CAD/CAM milling systems. Exceptional strength and aesthetics for long-lasting restorations with superior marginal fit.",
    category: "accessories",
    colors: [
      { name: "A1", hex: "#F5F5DC" },
      { name: "A2", hex: "#F0E68C" },
      { name: "A3", hex: "#E6D8AD" },
      { name: "B1", hex: "#FAEBD7" },
      { name: "C2", hex: "#E8DCC0" },
    ],
    specifications: [
      { label: "Material", value: "Lithium Disilicate" },
      { label: "Flexural Strength", value: "400 MPa" },
      { label: "Block Size", value: "14mm x 16mm" },
      { label: "Compatibility", value: "All CAD/CAM systems" },
      { label: "Sintering", value: "Not required" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "universal-composite",
    name: "Universal Composite Resin",
    price: "£85.00",
    image: "/products/universal-composite.jpg",
    description: "Versatile universal composite resin suitable for all cavity classes and restoration types.",
    detailedDescription:
      "Our universal composite resin offers exceptional handling and polishability. Nano-hybrid formula provides superior strength and aesthetics for all restoration types.",
    category: "composites",
    colors: [
      { name: "A1", hex: "#F5F5DC" },
      { name: "A2", hex: "#F0E68C" },
      { name: "A3", hex: "#E6D8AD" },
      { name: "B1", hex: "#FAEBD7" },
      { name: "C2", hex: "#E8DCC0" },
    ],
    specifications: [
      { label: "Type", value: "Nano-hybrid composite" },
      { label: "Filler Content", value: "82% by weight" },
      { label: "Curing Time", value: "20 seconds" },
      { label: "Syringe Size", value: "4g" },
      { label: "Application", value: "All cavity classes" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "bulk-fill-composite",
    name: "Bulk Fill Composite",
    price: "£95.00",
    image: "/products/bulk-fill-composite.jpg",
    description: "Time-saving bulk fill composite with excellent depth of cure and polishability.",
    detailedDescription:
      "Revolutionary bulk fill technology allows 4mm increments with reliable polymerization. Reduces placement time while maintaining excellent mechanical properties.",
    category: "composites",
    colors: [
      { name: "Universal", hex: "#F0E68C" },
      { name: "A2", hex: "#F0E68C" },
      { name: "A3", hex: "#E6D8AD" },
    ],
    specifications: [
      { label: "Type", value: "Bulk fill composite" },
      { label: "Depth of Cure", value: "4mm" },
      { label: "Filler Content", value: "80% by weight" },
      { label: "Curing Time", value: "10 seconds" },
      { label: "Syringe Size", value: "4g" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
  {
    id: "light-curing-composite",
    name: "Light-Curing Composite",
    price: "£110.00",
    image: "/products/light-curing-composite.jpg",
    description: "Premium light-curing composite with superior handling and aesthetic properties.",
    detailedDescription:
      "Premium light-curing composite featuring advanced nano-technology for exceptional aesthetics and durability. Extended working time allows precise sculpting before curing.",
    category: "composites",
    colors: [
      { name: "A1", hex: "#F5F5DC" },
      { name: "A2", hex: "#F0E68C" },
      { name: "A3", hex: "#E6D8AD" },
      { name: "B1", hex: "#FAEBD7" },
      { name: "C2", hex: "#E8DCC0" },
      { name: "Bleach", hex: "#FFFFF0" },
    ],
    specifications: [
      { label: "Type", value: "Nano-ceramic composite" },
      { label: "Filler Content", value: "85% by weight" },
      { label: "Working Time", value: "3 minutes" },
      { label: "Curing Time", value: "20 seconds" },
      { label: "Syringe Size", value: "4g" },
    ],
    shipping: {
      standard: "3-5 business days - £5.99",
      express: "1-2 business days - £12.99",
      freeShippingThreshold: "Orders over £100",
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
