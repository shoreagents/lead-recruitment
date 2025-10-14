"use client"

import React, { useEffect, useState } from 'react'
import { Star, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SideNav() {
  const router = useRouter()
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    // Add delay before triggering the page load effect
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [])

  const handlePhilippinesGotTalent = () => {
    // Navigate to employees page
    router.push('/we-got-talent')
  }

  const handleBookConsultations = () => {
    // Add your Book Consultations action here
    router.push('/gettingstart')
    // Example: window.open('/book-consultation', '_blank')
  }

  return (
    <>
      {/* Desktop SideNav - Right Side */}
      <div className="hidden lg:block fixed top-20 right-0 z-50 group">
        <div className={`flex flex-col space-y-3 pr-2 transition-all duration-900 ease-in-out ${isPageLoaded ? 'group-hover:-pr-10 hover:-mr-8' : '-pr-10 -mr-10'}`}>
          {/* Philippines Got Talent Button */}
          <div className={`flex items-center transition-all duration-300 ease-in-out ${isPageLoaded ? 'group-hover:translate-x-0 translate-x-37' : 'translate-x-0'}`}>
            <button 
              onClick={handlePhilippinesGotTalent}
              className={`bg-gradient-to-r from-lime-400 to-lime-500 border-2 border-lime-600 rounded-2xl px-6 py-5 shadow-[6px_6px_0px_#166534] min-w-[200px] h-16 flex items-center justify-start transition-all duration-300 ease-in-out hover:from-lime-500 hover:to-lime-600 hover:shadow-[8px_8px_0px_#166534] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[3px_3px_0px_#166534] active:translate-y-0 active:scale-95 ${isPageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-100'}`}
            >
              <Star className="w-7 h-7 mr-3 text-white flex-shrink-0 drop-shadow-sm" />
              <div className="flex flex-col items-start justify-center h-full space-y-0 flex-grow">
                <span className="text-xs leading-none text-white font-semibold">PHILIPPINES</span>
                <span className="text-xs leading-none text-white font-semibold">GOT</span>
                <span className="font-black text-xs leading-none text-white">TALENT!</span>
              </div>
              <ArrowRight className="w-5 h-5 ml-3 text-white flex-shrink-0 drop-shadow-sm" />
            </button>
          </div>
          
          {/* Book Consultations Button */}
          <div className={`flex items-center transition-all duration-300 ease-in-out ${isPageLoaded ? 'group-hover:translate-x-0 translate-x-37' : 'translate-x-0'}`}>
            <button 
              onClick={handleBookConsultations}
              className={`bg-gradient-to-r from-lime-400 to-lime-500 border-2 border-lime-600 rounded-2xl px-6 py-5 shadow-[6px_6px_0px_#166534] min-w-[200px] h-16 flex items-center justify-start transition-all duration-300 ease-in-out hover:from-lime-500 hover:to-lime-600 hover:shadow-[8px_8px_0px_#166534] hover:scale-105 hover:-translate-y-1 cursor-pointer active:shadow-[3px_3px_0px_#166534] active:translate-y-0 active:scale-95 ${isPageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-100'}`}
            >
              <svg className="w-7 h-7 mr-3 text-white flex-shrink-0 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex flex-col items-start justify-center h-full space-y-0 flex-grow">
                <span className="text-xs leading-none text-white font-semibold">BOOK</span>
                <span className="font-black text-xs leading-none text-white">CONSULTATIONS!</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}