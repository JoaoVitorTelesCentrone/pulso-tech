'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'

export function TopLoader() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const prevPathname = useRef(pathname)
  const completeTimer = useRef<ReturnType<typeof setTimeout>>()
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) return
      if (href === pathname) return

      clearTimeout(completeTimer.current)
      clearTimeout(hideTimer.current)
      setVisible(true)
      setWidth(15)
      requestAnimationFrame(() => requestAnimationFrame(() => setWidth(72)))
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    setWidth(100)
    completeTimer.current = setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 350)

    return () => {
      clearTimeout(completeTimer.current)
      clearTimeout(hideTimer.current)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="top-loader"
          className="fixed top-0 left-0 z-[200] h-[2px] bg-electric"
          style={{ width: `${width}%` }}
          animate={{ width: `${width}%` }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
