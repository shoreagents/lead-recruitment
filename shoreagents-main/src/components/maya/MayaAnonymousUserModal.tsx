"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaAnonymousUserModalProps {
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}

export const MayaAnonymousUserModal = ({ setMessages }: MayaAnonymousUserModalProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  const handleSubmit = () => {
    if (name && email) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Anonymous User: ${name} (${email}) from ${company || 'Unknown Company'}`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, userMessage])
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you ${name}! I've captured your information. This is the anonymous 45-second modal for quick lead capture. 🎯`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, aiResponse])
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Anonymous User Modal</h2>
          <p className="text-sm text-gray-600">45-second quick lead capture</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <Input 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
          <Input 
            placeholder="Your company name" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!name || !email}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          Quick Sign Up
        </Button>
      </div>
    </div>
  )
}
