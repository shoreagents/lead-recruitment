"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaInterviewRequestModalProps {
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>
}

export const MayaInterviewRequestModal = ({ setMessages }: MayaInterviewRequestModalProps) => {
  const [candidateName, setCandidateName] = useState('')
  const [position, setPosition] = useState('')
  const [interviewDate, setInterviewDate] = useState('')

  const handleSubmit = () => {
    if (candidateName && position) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Interview Request: ${candidateName} for ${position} position${interviewDate ? ` on ${interviewDate}` : ''}`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, userMessage])
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Perfect! I've scheduled an interview for ${candidateName} for the ${position} position. This is the interview request modal. 📅`,
        timestamp: new Date(),
      }
      setMessages?.(prev => [...prev, aiResponse])
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Interview Request Modal</h2>
          <p className="text-sm text-gray-600">Schedule candidate interviews</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
          <Input 
            placeholder="Enter candidate name" 
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <Input 
            placeholder="Job position" 
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interview Date (Optional)</label>
          <Input 
            type="date" 
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!candidateName || !position}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Schedule Interview
        </Button>
      </div>
    </div>
  )
}
