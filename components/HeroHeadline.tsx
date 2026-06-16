'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

interface HeroHeadlineProps {
  title: string
  slug: string
}

export function HeroHeadline({ title, slug }: HeroHeadlineProps) {
  const words = title.split(' ')

  return (
    <Link href={`/post/${slug}`} className="block max-w-3xl group mb-6">
      <h1 className="font-syne font-extrabold text-white leading-[0.92] tracking-[-0.04em] text-3xl sm:text-4xl lg:text-5xl group-hover:text-electric transition-colors duration-300">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
    </Link>
  )
}
