import React from 'react';
import Chatbot from './components/Chatbot';
import './app.css';

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <div className="brand">
          <h1 className="brand-title">StyleBot</h1>
          <p className="brand-subtitle">Customer Support Assistant</p>
        </div>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Online</span>
        </div>
      </div>
      
      <div className="app-content">
        <Chatbot />
      </div>
      
      <div className="app-footer">
        <p>Powered by StyleBot AI • Available 24/7</p>
      </div>
    </div>
  );
}

export default App;
