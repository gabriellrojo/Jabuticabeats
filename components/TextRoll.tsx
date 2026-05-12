"use client"

import React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const STAGGER = 0.035

export default function TextRoll({
  children,
  className,
  center = false,
}: {
  children: string
  className?: string
  center?: boolean
}) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn(
        "relative block overflow-hidden text-white select-none",
        className
      )}
      style={{
        lineHeight: 0.9,
      }}
    >
      {/* Texto de cima */}
      <div>
        {children.split("").map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              key={`top-${i}`}
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: [0.22, 1, 0.36, 1],
                duration: 0.45,
                delay,
              }}
              className="inline-block will-change-transform"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          )
        })}
      </div>

      {/* Texto de baixo */}
      <div className="absolute inset-0">
        {children.split("").map((letter, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i

          return (
            <motion.span
              key={`bottom-${i}`}
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: [0.22, 1, 0.36, 1],
                duration: 0.45,
                delay,
              }}
              className="inline-block will-change-transform"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          )
        })}
      </div>
    </motion.span>
  )
}