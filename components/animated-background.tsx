"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(315deg, #00A89A 0%, #00B8A9 25%, #3ACCFF 50%, #00C4B4 75%, #00A89A 100%)",
            "linear-gradient(315deg, #00B8A9 0%, #3ACCFF 25%, #00C4B4 50%, #00A89A 75%, #00B8A9 100%)",
            "linear-gradient(315deg, #3ACCFF 0%, #00C4B4 25%, #00A89A 50%, #00B8A9 75%, #3ACCFF 100%)",
            "linear-gradient(315deg, #00C4B4 0%, #00A89A 25%, #00B8A9 50%, #3ACCFF 75%, #00C4B4 100%)",
            "linear-gradient(315deg, #00A89A 0%, #00B8A9 25%, #3ACCFF 50%, #00C4B4 75%, #00A89A 100%)",
          ],
        }}
        transition={{
          duration: 60,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Subtle floating gradient orbs for depth */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[80vh] w-[80vh] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #3ACCFF 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 100, 50, -50, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.1, 1, 0.95, 1],
        }}
        transition={{
          duration: 90,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #00A89A 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -80, -40, 40, 0],
          y: [0, -40, -80, -40, 0],
          scale: [1, 0.95, 1, 1.1, 1],
        }}
        transition={{
          duration: 80,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/4 h-[50vh] w-[50vh] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #00C4B4 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 60, -30, 30, 0],
          y: [0, -60, 30, -30, 0],
          scale: [1, 1.05, 0.98, 1.02, 1],
        }}
        transition={{
          duration: 70,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      {/* Dark overlay for content contrast */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}
