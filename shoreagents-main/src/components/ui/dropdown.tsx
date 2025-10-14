"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Dropdown({ trigger, children, className, hover = false }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  
  const handleMouseEnter = () => {
    if (hover) setIsOpen(true)
  }
  
  const handleMouseLeave = () => {
    if (hover) setIsOpen(false)
  }

  return (
    <div 
      className="relative" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: () => void
}

export function DropdownItem({ children, href, className, onClick }: DropdownItemProps) {
  const Component = href ? "a" : "button"
  
  return (
    <Component
      href={href}
      onClick={onClick}
              className={cn(
          "block w-full text-left px-4 py-3 text-gray-700 hover:bg-lime-50 hover:text-lime-600 transition-colors duration-200",
          className
        )}
    >
      {children}
    </Component>
  )
}
