'use client'

import { motion, Variants } from 'motion/react'
import { cn } from '@/lib/utils'

type AnimationVariant = 'fade-up' | 'fade-in' | 'blur-in' | 'slide-left'
type AnimateBy = 'word' | 'char' | 'line'

interface TextAnimateProps {
  children: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  animation?: AnimationVariant
  by?: AnimateBy
  delay?: number
  duration?: number
  stagger?: number
  once?: boolean
}

const animationVariants: Record<AnimationVariant, { hidden: object; visible: object }> = {
  'fade-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
}

export function TextAnimate({
  children,
  className,
  as: Tag = 'p',
  animation = 'fade-up',
  by = 'word',
  delay = 0,
  duration = 0.45,
  stagger,
  once = true,
}: TextAnimateProps) {
  const segments =
    by === 'char'
      ? children.split('')
      : by === 'word'
      ? children.split(/(\s+)/)
      : [children]

  const defaultStagger = by === 'char' ? 0.025 : 0.07
  const itemStagger = stagger ?? defaultStagger

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: itemStagger,
      },
    },
  }

  const anim = animationVariants[animation]
  const itemVariants: Variants = {
    hidden: anim.hidden as Variants['hidden'],
    visible: {
      ...(anim.visible as object),
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    // Tag is a plain HTML element; motion.span inside handles stagger
    <Tag className={cn(className)}>
      <motion.span
        style={{ display: 'block' }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.2 }}
        aria-label={children}
      >
        {segments.map((seg, i) =>
          /^\s+$/.test(seg) ? (
            <span key={i} aria-hidden style={{ whiteSpace: 'pre' }}>
              {seg}
            </span>
          ) : (
            <motion.span
              key={i}
              variants={itemVariants}
              style={{ display: 'inline-block' }}
              aria-hidden
            >
              {seg}
            </motion.span>
          )
        )}
      </motion.span>
    </Tag>
  )
}
