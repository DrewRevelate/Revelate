'use client';

import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';

interface PreviousConversation {
  id: number;
  user_name: string;
  created_at: string;
  recentMessages: Array<{
    sender: 'user' | 'drew';
    message_text: string;
    sent_at: string;
  }>;
}

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
  const [previousConversation, setPreviousConversation] = useState<PreviousConversation | null>(null);
  const [showConversationChoice, setShowConversationChoice] = useState(false);

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
      // First, check if there's a previous conversation with this email
      const checkResponse = await fetch('/api/conversations/find-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const checkData = await checkResponse.json();

      if (checkData.found && checkData.conversation) {
        // Found a previous conversation - show choice
        setPreviousConversation(checkData.conversation);
        setShowConversationChoice(true);
        setStatus('idle');
        return;
      }

      // No previous conversation - create new one
      await createNewConversation();

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const createNewConversation = async () => {
    setStatus('loading');
    setErrorMessage('');
    setShowConversationChoice(false);

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

  const continueExistingConversation = () => {
    if (previousConversation) {
      setConversationId(previousConversation.id);
      setUserName(formData.name);
      setShowConversationChoice(false);
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
      <div>
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            👋 Hey {userName}! Your message has been sent. Feel free to continue the conversation here, and I'll reply as soon as I can.
          </p>
        </div>
        <ChatWidget
          conversationId={conversationId}
          userName={userName}
          onStartNew={handleStartNew}
        />
      </div>
    );
  }

  // Show conversation choice if previous conversation found
  if (showConversationChoice && previousConversation) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Welcome back!</h3>
          <p className="text-sm text-gray-700 mb-3">
            We found a previous conversation from{' '}
            {new Date(previousConversation.created_at).toLocaleDateString()}.
          </p>

          {/* Show recent messages preview */}
          {previousConversation.recentMessages && previousConversation.recentMessages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Recent messages:</p>
              <div className="space-y-2 bg-white p-3 rounded border border-gray-200 max-h-32 overflow-y-auto">
                {previousConversation.recentMessages.map((msg, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-semibold text-gray-700">
                      {msg.sender === 'user' ? 'You' : 'Drew'}:
                    </span>{' '}
                    <span className="text-gray-600">
                      {msg.message_text.length > 60
                        ? msg.message_text.substring(0, 60) + '...'
                        : msg.message_text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-700 mb-4">
            Would you like to continue that conversation or start a new one?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={continueExistingConversation}
              className="flex-1 px-4 py-2 bg-navy hover:bg-navy/90 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Continue Previous Chat
            </button>
            <button
              onClick={createNewConversation}
              className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-navy border border-gray-300 rounded-lg font-semibold transition-all duration-200"
            >
              Start New Conversation
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowConversationChoice(false)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to form
        </button>
      </div>
    );
  }

  // Otherwise show the initial contact form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 gap-6">
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
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200"
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
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200"
            placeholder="your@email.com"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Phone and Company Row */}
      <div className="grid grid-cols-1 gap-6">
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
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200"
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
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200"
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
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 resize-none"
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
        className="w-full px-6 py-3 bg-navy hover:bg-navy/90 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
