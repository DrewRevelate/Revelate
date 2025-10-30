'use client';

import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';

interface SavedConversation {
  conversationId: number;
  userName: string;
  timestamp: number;
}

export default function ContactChat() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load active conversation from localStorage on mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('activeConversation');
    if (savedConversation) {
      try {
        const parsed: SavedConversation = JSON.parse(savedConversation);
        // Only restore if conversation is less than 7 days old
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp > weekAgo) {
          setConversationId(parsed.conversationId);
          setUserName(parsed.userName);
        } else {
          // Clear old conversation
          localStorage.removeItem('activeConversation');
        }
      } catch (e) {
        console.error('Failed to restore conversation:', e);
        localStorage.removeItem('activeConversation');
      }
    }
  }, []);

  // Save conversation to localStorage whenever it changes
  useEffect(() => {
    if (conversationId && userName) {
      const saveData: SavedConversation = {
        conversationId,
        userName,
        timestamp: Date.now()
      };
      localStorage.setItem('activeConversation', JSON.stringify(saveData));
    }
  }, [conversationId, userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Security: Do NOT check for previous conversations by email
      // This would allow anyone to access chat history just by knowing an email
      // Only localStorage (same device) can restore conversations

      // Create new conversation
      await createNewConversation();

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const createNewConversation = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success! Transition to chat
      setConversationId(data.conversation_id);
      setUserName(formData.name);
      setStatus('idle');

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const handleStartNew = () => {
    // Clear conversation and localStorage
    setConversationId(null);
    setUserName('');
    localStorage.removeItem('activeConversation');
    // Reset form except email (keep it for convenience)
    setFormData({
      ...formData,
      name: '',
      phone: '',
      company: '',
      message: ''
    });
  };

  // If conversation started, show chat widget
  if (conversationId) {
    return (
      <ChatWidget
        conversationId={conversationId}
        userName={userName}
        onStartNew={handleStartNew}
      />
    );
  }

  // Show the initial contact form
  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-3 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 text-base"
            placeholder="Your name"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-3 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 text-base"
            placeholder="your@email.com"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Phone and Company Row */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-3 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 text-base"
            placeholder="+1 (555) 000-0000"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-3 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 text-base"
            placeholder="Your company"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-3 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 resize-none text-base"
          placeholder="Tell me about your project or question..."
          disabled={status === 'loading'}
        />
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">
            ✗ {errorMessage}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3.5 md:py-3 bg-navy hover:bg-navy/90 active:bg-navy/80 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Start Conversation'
        )}
      </button>
    </form>
  );
}
