"use client"

import type React from "react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "lg"
  onClick?: () => void
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const variants = {
    primary:
      "bg-white/95 text-[#1a365d] hover:bg-white hover:brightness-110 backdrop-blur-md font-semibold",
    secondary: "glass text-white hover:bg-white/30",
    ghost: "bg-transparent text-foreground hover:bg-foreground/20 backdrop-blur-sm",
  }

  const sizes = {
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-full font-medium
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}
