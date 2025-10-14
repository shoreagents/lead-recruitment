'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

let toastStore: {
  toasts: Toast[]
  listeners: ((toasts: Toast[]) => void)[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
} = {
  toasts: [],
  listeners: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2)
    const newToast = { ...toast, id }
    toastStore.toasts.push(newToast)
    toastStore.listeners.forEach(listener => listener(toastStore.toasts))
    
    setTimeout(() => {
      toastStore.removeToast(id)
    }, toast.duration || 5000)
  },
  removeToast: (id) => {
    toastStore.toasts = toastStore.toasts.filter(t => t.id !== id)
    toastStore.listeners.forEach(listener => listener(toastStore.toasts))
  }
}

export const toast = {
  success: (message: string, duration?: number) => 
    toastStore.addToast({ message, type: 'success', duration }),
  error: (message: string, duration?: number) => 
    toastStore.addToast({ message, type: 'error', duration }),
  info: (message: string, duration?: number) => 
    toastStore.addToast({ message, type: 'info', duration })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts([...newToasts])
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
  }, [])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'info': return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10'
      case 'error': return 'border-red-500/30 bg-red-500/10'
      case 'info': return 'border-blue-500/30 bg-blue-500/10'
    }
  }

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.5 }}
              className={`glass-card border ${getColors(toast.type)} p-4 min-w-[300px] max-w-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(toast.type)}
                  <span className="text-white text-sm">{toast.message}</span>
                </div>
                <button
                  onClick={() => toastStore.removeToast(toast.id)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
