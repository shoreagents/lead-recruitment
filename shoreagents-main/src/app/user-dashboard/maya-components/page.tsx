"use client"

import { useState } from 'react'
import { MayaAnonymousUserForm } from '@/components/maya'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function MayaComponentsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Maya Santos, your ShoreAgents AI assistant. I can help you with information about our services, team, pricing, and more. How can I assist you today?",
      timestamp: new Date(),
    }
  ])
  const [currentStep, setCurrentStep] = useState<string | null>('name')
  const [formData, setFormData] = useState<any>({})

  const generateMessageId = () => Date.now().toString()

  const handleStepChange = (step: string | null) => {
    setCurrentStep(step)
  }

  const handleFormDataChange = (data: any) => {
    setFormData(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Maya Components Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat Messages</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-lime-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
          </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Component */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Maya Form</h2>
            <div className="space-y-4">
              {currentStep && (
                             <MayaAnonymousUserForm
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  onFormDataChange={handleFormDataChange}
                               setMessages={setMessages}
                               generateMessageId={generateMessageId}
                               formData={formData}
                             />
                           )}
                           
              {!currentStep && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                       </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Form Completed!</h3>
                  <p className="text-gray-600 mb-4">Thank you for providing your information.</p>
                  <button
                    onClick={() => {
                      setCurrentStep('name')
                      setFormData({})
                      setMessages([{
                        id: '1',
                        role: 'assistant',
                        content: "Hello! I'm Maya Santos, your ShoreAgents AI assistant. I can help you with information about our services, team, pricing, and more. How can I assist you today?",
                        timestamp: new Date(),
                      }])
                    }}
                    className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                  >
                    Start Over
                  </button>
                                   </div>
                                 )}
                                           </div>
                                           </div>
                                         </div>
                                         
        {/* Form Data Display */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Data</h2>
          <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
                             </div>
            </div>
          </div>
  )
}