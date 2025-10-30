'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ContactChat from './ContactChat';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-magenta to-magenta/80 hover:from-magenta/90 hover:to-magenta/70 active:from-magenta/80 active:to-magenta/60 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center touch-manipulation"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
        )}
      </button>

      {/* Chat Modal/Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Panel */}
          <div className="fixed inset-x-0 bottom-0 md:bottom-24 md:right-6 md:left-auto z-50 w-full md:max-w-md h-[85vh] md:h-[600px] md:max-h-[80vh] bg-navy border-t md:border border-magenta/20 md:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-magenta to-magenta/80 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base md:text-lg font-bold text-white truncate">Chat with Drew</h3>
                <p className="text-xs md:text-sm text-white/80 truncate">Typically replies within a few hours</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 active:text-white/60 transition-colors ml-2 touch-manipulation"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-[calc(100%-64px)] md:h-[calc(100%-80px)] overflow-y-auto p-4 md:p-6 bg-navy-dark overscroll-contain">
              <ContactChat />
            </div>
          </div>
        </>
      )}
    </>
  );
}
