"use client"

import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeInAnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
  threshold?: number
}

export function FadeInAnimation({ 
  children, 
  delay = 0, 
  duration = 600,
  direction = 'up',
  className = '',
  threshold = 0.1
}: FadeInAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, threshold])

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)'
      case 'down':
        return 'translateY(-30px)'
      case 'left':
        return 'translateX(30px)'
      case 'right':
        return 'translateX(-30px)'
      case 'fade':
        return 'translateY(0px)'
      default:
        return 'translateY(30px)'
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px) translateX(0px)' : getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation wrapper for multiple children
interface StaggeredFadeInProps {
  children: ReactNode[]
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  className?: string
}

export function StaggeredFadeIn({ 
  children, 
  staggerDelay = 100,
  direction = 'up',
  className = ''
}: StaggeredFadeInProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeInAnimation
          key={index}
          delay={index * staggerDelay}
          direction={direction}
        >
          {child}
        </FadeInAnimation>
      ))}
    </div>
  )
}



