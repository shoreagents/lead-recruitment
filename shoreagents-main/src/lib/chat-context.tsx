'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AI_CONFIG, getRandomWelcomeMessage } from '@/lib/ai-config';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedContent?: Array<{
    title: string;
    content: string;
    url?: string;
  }>;
  suggestedComponents?: string[];
  userData?: {
    userType: string;
    hasQuotes: boolean;
    leadCaptureStatus: {
      first_lead_capture: boolean;
      second_lead_capture: boolean;
      third_lead_capture: boolean;
    };
  };
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatContextType {
  // Messages
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Conversations
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, conversation: Conversation) => void;
  deleteConversation: (id: string) => void;
  
  // Current conversation
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // AI Response generation
  generateAIResponse: (message: string, conversationHistory: Message[], userId?: string) => Promise<{
    response: string;
    relatedContent: Array<{ title: string; content: string; url?: string }>;
    suggestedComponents: string[];
    userData: any;
  }>;
  
  // Modal triggers
  triggerModal: (modalType: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // TanStack Query for conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const savedConversations = localStorage.getItem('chat-conversations');
      if (savedConversations) {
        try {
          return JSON.parse(savedConversations);
        } catch (error) {
          console.error('Error parsing conversations:', error);
          return [];
        }
      }
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Update conversations when query data changes
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  // Don't automatically set a welcome message - let the first user interaction trigger personalized greeting
  // This allows the API to generate personalized greetings based on user data

  // Save conversations to localStorage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations(prev => [conversation, ...prev]);
    // Invalidate and refetch conversations
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }, [queryClient]);

  const updateConversation = useCallback((id: string, conversation: Conversation) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? conversation : c)
    );
    // Invalidate and refetch conversations
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }, [queryClient]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setMessages([]);
      setCurrentConversationId(null);
    }
    // Invalidate and refetch conversations
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }, [currentConversationId, queryClient]);

  const generateAIResponse = useCallback(async (
    message: string, 
    conversationHistory: Message[], 
    userId?: string
  ) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId: userId || ''
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        response: data.content || 'I apologize, but I encountered an error processing your request.',
        relatedContent: data.components || [],
        suggestedComponents: data.suggestedComponents || [],
        userData: data.userData || null
      };
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }, []);

  const triggerModal = useCallback((modalType: string) => {
    // This will be handled by the individual components
    // They can listen for modal triggers and handle them accordingly
    console.log(`Modal trigger: ${modalType}`);
  }, []);

  const value: ChatContextType = {
    messages,
    setMessages,
    addMessage,
    clearMessages,
    conversations,
    setConversations,
    addConversation,
    updateConversation,
    deleteConversation,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    setIsLoading,
    generateAIResponse,
    triggerModal,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
