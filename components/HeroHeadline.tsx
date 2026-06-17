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
    <Link href={`/post/${slug}`} className="group mb-8 block max-w-4xl">
      <h1 className="brand-poster text-5xl text-bg transition-colors duration-300 group-hover:text-accent sm:text-6xl lg:text-[6.8rem]">
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
