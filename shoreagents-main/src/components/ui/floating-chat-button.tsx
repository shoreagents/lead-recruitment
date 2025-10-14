'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import Image from 'next/image';
import ChatConsole from './ai-chat-console';

const FloatingChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Floating Chat Button with Maya Santos Avatar */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-20 right-0 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            Chat with Maya Santos
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
        
        {/* Main Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out transform hover:scale-110 flex items-center justify-center group"
          aria-label="Chat with Maya Santos"
        >
          {/* Maya Santos Avatar */}
          <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white overflow-hidden">
            <Image 
              src="/MayaProfile.png"
              alt="Maya Santos Avatar"
              className="w-full h-full object-cover"
              width={48}
              height={48}
            />
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Sparkle effect */}
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-lime-200 animate-pulse" />
          </div>
          
          {/* Message icon overlay */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform duration-300">
            <MessageCircle size={12} className="text-white" />
          </div>
        </button>
      </div>

      {/* Chat Console */}
      <ChatConsole 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default FloatingChatButton;

