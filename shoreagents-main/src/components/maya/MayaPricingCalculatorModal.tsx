"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaPricingCalculatorModalProps {
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}

export const MayaPricingCalculatorModal = ({ setMessages }: MayaPricingCalculatorModalProps) => {
  const [teamSize, setTeamSize] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')

  const handleSubmit = () => {
    if (teamSize && budget) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Pricing Request: ${teamSize} team members, $${budget} budget, ${timeline || 'No timeline specified'}`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, userMessage])
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Got it! I'll calculate pricing for ${teamSize} team members with a $${budget} budget. This is the pricing calculator modal. 💰`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, aiResponse])
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-lime-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pricing Calculator Modal</h2>
          <p className="text-sm text-gray-600">Calculate your team pricing</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
          <Input 
            placeholder="Number of team members" 
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
          <Input 
            placeholder="Your budget (e.g., 5000)" 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeline (Optional)</label>
          <Input 
            placeholder="Project timeline" 
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!teamSize || !budget}
          className="w-full bg-lime-600 hover:bg-lime-700"
        >
          Calculate Pricing
        </Button>
      </div>
    </div>
  )
}
