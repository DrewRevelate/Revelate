'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'drew';
  message_text: string;
  sent_at: string;
}

interface ChatWidgetProps {
  conversationId: number;
  userName: string;
  onStartNew?: () => void;
}

export default function ChatWidget({ conversationId, userName, onStartNew }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        // Only update if messages actually changed
        setMessages(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(data.messages)) {
            return data.messages;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setError('');

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages(); // Refresh messages
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  // Scroll to bottom only when new messages arrive
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Set up polling for new messages (every 5 seconds)
  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [conversationId]);

  return (
    <div className="flex flex-col h-[450px] md:h-[500px] max-h-[70vh] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Header with Start New button */}
      {onStartNew && (
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600 font-medium">
            Chat with Drew
          </div>
          <button
            onClick={onStartNew}
            className="text-xs text-gray-500 hover:text-navy transition-colors duration-200 underline whitespace-nowrap"
          >
            Start New
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 overscroll-contain">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 md:px-4 md:py-2.5 ${
                msg.sender === 'user'
                  ? 'bg-navy text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {msg.sender === 'drew' && (
                <div className="text-xs font-semibold text-gray-600 mb-1">Drew</div>
              )}
              <p className="font-body text-sm md:text-base whitespace-pre-wrap break-words">{msg.message_text}</p>
              <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                {new Date(msg.sent_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 md:p-4 bg-white flex-shrink-0">
        {error && (
          <div className="mb-2 md:mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs md:text-sm">
            {error}
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 px-3 py-2.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-colors duration-200 disabled:opacity-50 text-base"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 md:px-6 py-2.5 md:py-2 bg-navy hover:bg-navy/90 active:bg-navy/80 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm md:text-base"
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
