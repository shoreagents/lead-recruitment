"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_CONFIG, getRandomWelcomeMessage } from '@/lib/ai-config'
import { PricingCalculatorModal } from '@/components/ui/pricing-calculator-modal'
import { InterviewRequestModal } from '@/components/ui/interview-request-modal'
import { AnonymousUserModal } from '@/components/ui/anonymous-user-modal'
import { useChatContext, Message, Conversation } from '@/lib/chat-context'
import { MayaTextField, MayaNameFields, MayaAnonymousUserForm } from '@/components/maya'


// Component that uses searchParams
function ChatPageContent() {
  const { user } = useUserAuth()
  const searchParams = useSearchParams()
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    addMessage,
    clearMessages,
    addConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversationId,
    setIsLoading,
    generateAIResponse
  } = useChatContext()
  
  const [inputValue, setInputValue] = useState('')
  
  // Modal states
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showAnonymousModal, setShowAnonymousModal] = useState(false)
  
  // Contact collection states
  const [isCollectingContact, setIsCollectingContact] = useState(false)
  const [contactStep, setContactStep] = useState<'name' | 'email' | 'company' | null>(null)
  const [contactData, setContactData] = useState<{name?: string; email?: string; company?: string}>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Wrapper function for setMessages prop compatibility
  const handleSetMessages = (messageOrMessages: Message | Message[] | ((prev: Message[]) => Message[])) => {
    if (Array.isArray(messageOrMessages)) {
      // If it's an array, replace all messages
      messageOrMessages.forEach(msg => addMessage(msg))
    } else if (typeof messageOrMessages === 'function') {
      // If it's a function, we can't easily handle this with addMessage
      // For now, we'll just ignore it since MayaTextField doesn't use this pattern
    } else {
      // If it's a single message, add it
      addMessage(messageOrMessages)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add dashboard-page class to body to prevent scrolling
  useEffect(() => {
    document.body.classList.add('dashboard-page')
    return () => {
      document.body.classList.remove('dashboard-page')
    }
  }, [])

  // Handle loading specific conversation from URL
  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId && conversationId !== currentConversationId) {
      // Find the conversation in the list
      const conversation = conversations.find(c => c.id === conversationId)
      if (conversation) {
        // Set the current conversation
        setCurrentConversationId(conversationId)
        // In a real app, you would load the messages for this conversation
        // For now, we'll just set the conversation ID and let the context handle it
        console.log('Loading conversation:', conversation.title)
      }
    }
  }, [searchParams, conversations, currentConversationId, setCurrentConversationId])


  const handleModalTrigger = (modalType: string) => {
    switch (modalType) {
      case 'pricing_calculator_modal':
        setShowPricingModal(true)
        break
      case 'interview_request_modal':
        setShowInterviewModal(true)
        break
      case 'anonymous_user_modal':
        setShowAnonymousModal(true)
        break
      default:
        console.log(`Unknown modal type: ${modalType}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInputValue('')
    setIsLoading(true)

    try {
      const { response, relatedContent, suggestedComponents, userData } = await generateAIResponse(inputValue, messages, user?.user_id)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedContent: relatedContent.length > 0 ? relatedContent : undefined,
        suggestedComponents: suggestedComponents,
        userData: userData
      }

      addMessage(assistantMessage)
      
      // Check if Maya is asking for contact information
      const responseLower = response.toLowerCase();
      const isAskingForContact = responseLower.includes('before we continue our conversation, it\'s okay to have your name?') ||
                                (responseLower.includes('name') && responseLower.includes('email')) ||
                                (responseLower.includes('contact') && (responseLower.includes('get') || responseLower.includes('have'))) ||
                                (responseLower.includes('personalized') && responseLower.includes('assistance')) ||
                                (responseLower.includes('best service') && responseLower.includes('email'));
      
      if (isAskingForContact && !isCollectingContact) {
        console.log('Maya is asking for contact info, triggering form');
        setIsCollectingContact(true);
        setContactStep('name');
      }
      
      // Update or create conversation
      const conversationTitle = inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue
      const conversationId = currentConversationId || Date.now().toString()
      
      const newConversation: Conversation = {
        id: conversationId,
        title: conversationTitle,
        lastMessage: response,
        timestamp: new Date(),
        messageCount: messages.length + 2
      }

      const existing = conversations.find(c => c.id === conversationId)
      if (existing) {
        updateConversation(conversationId, newConversation)
      } else {
        addConversation(newConversation)
      }
      
      setCurrentConversationId(conversationId)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: AI_CONFIG.errorMessages.generic,
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = () => {
    clearMessages()
    setCurrentConversationId(null)
  }

  const loadConversation = (conversationId: string) => {
    // In a real app, you'd load the conversation from your backend
    // For now, we'll just set the current conversation ID
    setCurrentConversationId(conversationId)
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex gap-4 p-6 ${isUser ? 'bg-gray-50' : 'bg-white'} group hover:bg-opacity-80 transition-colors`}
      >
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.first_name?.charAt(0) || 'U'}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              M
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {isUser ? (user?.first_name || 'You') : AI_CONFIG.assistant.name}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Suggested Actions */}
          {message.suggestedComponents && message.suggestedComponents.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-600 mb-3">💡 Suggested Actions:</div>
              <div className="flex flex-wrap gap-2">
                {message.suggestedComponents.map((component, index) => (
                  <button
                    key={index}
                    onClick={() => handleModalTrigger(component)}
                    className="px-3 py-1.5 text-xs font-medium bg-lime-50 text-lime-700 border border-lime-200 rounded-lg hover:bg-lime-100 transition-colors"
                  >
                    {component.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Actions */}
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset className="relative h-screen">
          {/* Header - Standalone container, aligned to center content only */}
          <header className="absolute top-0 left-0 right-80 z-20 h-14 bg-white border-b flex items-center gap-1 px-4">
            <SidebarTrigger className="!size-8 hover:bg-lime-100 [&_svg]:!w-6 [&_svg]:!h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">Chat with Maya</h1>
              <Badge variant="secondary" className="text-xs">
                AI Assistant
              </Badge>
            </div>
          </header>

          {/* Input Area - Standalone container, aligned to center content only */}
          <div className="absolute bottom-16 left-0 right-80 z-20 bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message Maya..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none min-h-[44px] shadow-sm"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar Panel - Fixed position, won't move when scrolled */}
          <div className="fixed top-0 right-0 z-10 w-80 h-full bg-gray-50 border-l pt-14 pb-32">
            <div className="p-4 h-full flex flex-col justify-center space-y-4">
              {/* Conversation History */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[45%] w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Conversations</h3>
                <div className="text-sm text-gray-600">
                  {conversations.length > 0 ? (
                    <div className="space-y-2">
                      {conversations.slice(0, 3).map((conversation) => (
                        <div key={conversation.id} className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <div className="text-xs font-medium text-gray-800 truncate">{conversation.title}</div>
                          <div className="text-xs text-gray-500">{conversation.messageCount} messages</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No conversations yet</div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[45%] w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleModalTrigger('pricing_calculator_modal')}
                    className="w-full text-left p-2 text-xs bg-lime-50 text-lime-700 rounded-lg hover:bg-lime-100 transition-colors"
                  >
                    💰 Get Pricing Quote
                  </button>
                  <button
                    onClick={() => handleModalTrigger('interview_request_modal')}
                    className="w-full text-left p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    📅 Schedule Interview
                  </button>
                  <button
                    onClick={() => handleModalTrigger('anonymous_user_modal')}
                    className="w-full text-left p-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    📝 Quick Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages - Only this scrolls, like ChatGPT */}
          <div className="absolute top-14 bottom-32 left-0 right-80 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <AnimatePresence>
                {messages.map(renderMessage)}
              </AnimatePresence>
              
              {/* Contact Collection Form */}
              {isCollectingContact && contactStep && (
                <div className="mt-4">
                  <MayaAnonymousUserForm
                    currentStep={contactStep}
                    onStepChange={(step) => {
                      if (step === null) {
                        setIsCollectingContact(false);
                        setContactStep(null);
                      } else {
                        setContactStep(step as 'name' | 'email' | 'company');
                      }
                    }}
                    onFormDataChange={(data) => {
                      setContactData(data);
                    }}
                    setMessages={handleSetMessages}
                    generateMessageId={() => Date.now().toString()}
                    formData={contactData}
                  />
                </div>
              )}
            {isLoading && (
              <div className="flex gap-4 p-6 bg-white">
                <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{AI_CONFIG.assistant.name}</span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>
        </SidebarInset>

        {/* Existing Modals */}
        <PricingCalculatorModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
        
        <InterviewRequestModal 
          isOpen={showInterviewModal} 
          onClose={() => setShowInterviewModal(false)}
          candidateName="Selected Candidate"
          candidatePosition="Position"
          onSubmit={async (data) => {
            console.log('Interview request submitted:', data)
            setShowInterviewModal(false)
          }}
        />
        
        <AnonymousUserModal 
          isOpen={showAnonymousModal} 
          onClose={() => setShowAnonymousModal(false)} 
        />
      </SidebarProvider>
    </UserGuard>
  )
}

// Main export with Suspense wrapper
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
