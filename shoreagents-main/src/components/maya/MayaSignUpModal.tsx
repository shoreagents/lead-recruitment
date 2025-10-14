"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaSignUpModalProps {
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}

export const MayaSignUpModal = ({ setMessages }: MayaSignUpModalProps) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (firstName && lastName && email && password) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Sign Up: ${firstName} ${lastName} (${email})`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, userMessage])
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Welcome ${firstName}! Your account has been created successfully. This is the sign up modal. 🎉`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, aiResponse])
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sign Up Modal</h2>
          <p className="text-sm text-gray-600">User registration form</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <Input 
              placeholder="First name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <Input 
              placeholder="Last name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <Input 
            type="password" 
            placeholder="Create a password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!firstName || !lastName || !email || !password}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Create Account
        </Button>
      </div>
    </div>
  )
}
