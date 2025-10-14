"use client"

import React, { useState, useEffect, useCallback } from 'react'

interface CarouselProps {
  children: React.ReactNode
  itemsPerSlide?: number
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function Carousel({ 
  children, 
  itemsPerSlide = 3, 
  className = "", 
  autoPlay = true, 
  autoPlayInterval = 4000 
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const childrenArray = React.Children.toArray(children)
  const totalSlides = Math.ceil(childrenArray.length / itemsPerSlide)
  
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])
  
  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }
  
  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)
    
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, nextSlide])
  
  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden px-4 py-4">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
                     {Array.from({ length: totalSlides }, (_, slideIndex) => (
             <div key={slideIndex} className="w-full flex-shrink-0 px-4 py-2">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-full max-w-6xl mx-auto">
                 {childrenArray
                   .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                   .map((child, index) => (
                     <div key={slideIndex * itemsPerSlide + index} className="h-full px-2">
                       {child}
                     </div>
                   ))}
               </div>
             </div>
           ))}
        </div>
      </div>
      
      {/* Dots Indicator Only */}
      <div className="flex justify-center items-center mt-8">
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                index === currentSlide 
                  ? 'bg-lime-600' 
                  : 'bg-lime-300 hover:bg-lime-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
