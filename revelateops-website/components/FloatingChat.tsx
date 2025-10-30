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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-magenta to-magenta/80 hover:from-magenta/90 hover:to-magenta/70 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
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
          <div className="fixed bottom-24 right-6 z-50 w-full max-w-md h-[600px] bg-navy border border-magenta/20 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-magenta to-magenta/80 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Chat with Drew</h3>
                <p className="text-sm text-white/80">Typically replies within a few hours</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-white/80 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-[calc(100%-80px)] overflow-y-auto p-6 bg-navy-dark">
              <ContactChat />
            </div>
          </div>
        </>
      )}
    </>
  );
}
