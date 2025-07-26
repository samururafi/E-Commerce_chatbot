import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatbotAPI } from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Hello! 👋 I\'m StyleBot, your customer support assistant. I can help you with:\n\n• Check order status\n• Product information and stock\n• Find top selling products\n• Search our catalog\n\nHow can I assist you today?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    loadSuggestions();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = async () => {
    try {
      const response = await chatbotAPI.getSuggestions();
      if (response.success) {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to chatbot API
      const response = await chatbotAPI.sendQuery(messageText);
      
      // Create bot response message
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        data: response.data,
        responseType: response.type,
        success: response.success,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Chat cleared! How can I help you today?',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="bot-avatar">🤖</span>
          <div>
            <h3>StyleBot Assistant</h3>
            <p className="status">
              <span className="status-dot"></span>
              Online & Ready to Help
            </p>
          </div>
        </div>
        <button 
          className="clear-btn"
          onClick={clearChat}
          title="Clear Chat"
        >
          🗑️
        </button>
      </div>

      <div className="chatbot-messages">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
        />
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && messages.length === 1 && (
        <div className="suggestions-container">
          <p className="suggestions-title">Try asking:</p>
          <div className="suggestions-grid">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="Type your message here..."
      />

      <div className="chatbot-footer">
        <p>🔒 Your conversations are secure • Powered by AI</p>
      </div>
    </div>
  );
};

export default Chatbot;
