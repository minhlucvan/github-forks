import { useEffect, useRef, useState } from "react"

export function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isVisible }
}
