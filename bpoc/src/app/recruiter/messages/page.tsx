'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  unread: boolean;
  isOnline: boolean;
}

interface Conversation {
  id: number;
  candidateName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  position: string;
  company: string;
  messages: Message[];
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState('');

  // Dummy conversation data
  const conversations: Conversation[] = [
    {
      id: 1,
      candidateName: "Sarah Johnson",
      lastMessage: "Thank you for considering my application. I'm very excited about this opportunity!",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      position: "Software Engineer",
      company: "TechCorp",
      messages: [
        {
          id: 1,
          sender: "Sarah Johnson",
          message: "Hi! I saw your job posting for Software Engineer and I'm very interested. I have 5 years of experience in React and Node.js.",
          timestamp: "10:30 AM",
          unread: false,
          isOnline: true
        },
        {
          id: 2,
          sender: "You",
          message: "Hello Sarah! Thank you for your interest. I'd love to learn more about your experience. Can you tell me about your most recent project?",
          timestamp: "10:35 AM",
          unread: false,
          isOnline: true
        },
        {
          id: 3,
          sender: "Sarah Johnson",
          message: "Absolutely! I recently built a full-stack e-commerce platform using React, Node.js, and PostgreSQL. It handles 10,000+ daily users.",
          timestamp: "10:40 AM",
          unread: false,
          isOnline: true
        },
        {
          id: 4,
          sender: "Sarah Johnson",
          message: "Thank you for considering my application. I'm very excited about this opportunity!",
          timestamp: "2 min ago",
          unread: true,
          isOnline: true
        }
      ]
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      lastMessage: "I'm available for an interview next week. What time works best for you?",
      timestamp: "1 hour ago",
      unreadCount: 1,
      isOnline: false,
      position: "Product Manager",
      company: "StartupXYZ",
      messages: [
        {
          id: 1,
          sender: "Michael Chen",
          message: "Hello! I'm interested in the Product Manager position. I have experience with agile methodologies and user research.",
          timestamp: "9:15 AM",
          unread: false,
          isOnline: false
        },
        {
          id: 2,
          sender: "You",
          message: "Hi Michael! Great to hear from you. Can you share some examples of products you've managed?",
          timestamp: "9:20 AM",
          unread: false,
          isOnline: false
        },
        {
          id: 3,
          sender: "Michael Chen",
          message: "I'm available for an interview next week. What time works best for you?",
          timestamp: "1 hour ago",
          unread: true,
          isOnline: false
        }
      ]
    },
    {
      id: 3,
      candidateName: "Emily Rodriguez",
      lastMessage: "I've attached my portfolio. Let me know if you need any additional information.",
      timestamp: "3 hours ago",
      unreadCount: 0,
      isOnline: true,
      position: "UX Designer",
      company: "DesignStudio",
      messages: [
        {
          id: 1,
          sender: "Emily Rodriguez",
          message: "Hi! I'm a UX Designer with 4 years of experience. I specialize in user research and prototyping.",
          timestamp: "8:00 AM",
          unread: false,
          isOnline: true
        },
        {
          id: 2,
          sender: "You",
          message: "Hello Emily! Your background sounds perfect. Could you share some examples of your work?",
          timestamp: "8:05 AM",
          unread: false,
          isOnline: true
        },
        {
          id: 3,
          sender: "Emily Rodriguez",
          message: "I've attached my portfolio. Let me know if you need any additional information.",
          timestamp: "3 hours ago",
          unread: false,
          isOnline: true
        }
      ]
    },
    {
      id: 4,
      candidateName: "David Kim",
      lastMessage: "Thank you for the interview opportunity. I look forward to hearing from you soon.",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
      position: "Data Scientist",
      company: "DataCorp",
      messages: [
        {
          id: 1,
          sender: "David Kim",
          message: "Hello! I'm a Data Scientist with expertise in machine learning and Python. I'm very interested in this role.",
          timestamp: "Yesterday",
          unread: false,
          isOnline: false
        },
        {
          id: 2,
          sender: "You",
          message: "Hi David! Your profile looks impressive. Would you be available for an interview this week?",
          timestamp: "Yesterday",
          unread: false,
          isOnline: false
        },
        {
          id: 3,
          sender: "David Kim",
          message: "Thank you for the interview opportunity. I look forward to hearing from you soon.",
          timestamp: "1 day ago",
          unread: false,
          isOnline: false
        }
      ]
    }
  ];

  const currentConversation = conversations.find(conv => conv.id === selectedConversation);

  // Handle URL parameter to auto-select conversation
  useEffect(() => {
    const candidateParam = searchParams.get('candidate');
    if (candidateParam) {
      // Find conversation by candidate name
      const conversation = conversations.find(conv => 
        conv.candidateName.toLowerCase().includes(candidateParam.toLowerCase())
      );
      if (conversation) {
        setSelectedConversation(conversation.id);
      }
    }
  }, [searchParams]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with candidates and manage your conversations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                          {conversation.candidateName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.candidateName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-1">
                        {conversation.position} at {conversation.company}
                      </p>
                      
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {conversation.lastMessage}
                      </p>
                      
                      {conversation.unreadCount > 0 && (
                        <div className="flex justify-end mt-2">
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                            {currentConversation.candidateName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {currentConversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {currentConversation.candidateName}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {currentConversation.position} at {currentConversation.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        {message.sender !== 'You' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-emerald-500 text-white font-semibold text-xs">
                              {message.sender.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`px-4 py-2 rounded-lg ${
                          message.sender === 'You'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
