import React from 'react';
import ProductCard from './ProductCard';

const MessageList = ({ messages, isLoading }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessageContent = (message) => {
    // Handle different response types
    if (message.responseType && message.data) {
      switch (message.responseType) {
        case 'top_products':
        case 'product_search':
          return (
            <div>
              <p className="message-text">{message.content}</p>
              <div className="products-grid">
                {message.data.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );

        case 'order_status':
          return (
            <div>
              <p className="message-text">{message.content}</p>
              <div className="order-details">
                <div className="order-header">
                  <h4>Order #{message.data.orderId}</h4>
                  <span className={`status-badge status-${message.data.status}`}>
                    {message.data.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="order-info">
                  <p><strong>Customer:</strong> {message.data.customerName}</p>
                  <p><strong>Total:</strong> ${message.data.total}</p>
                  {message.data.trackingNumber && (
                    <p><strong>Tracking:</strong> {message.data.trackingNumber}</p>
                  )}
                  {message.data.estimatedDelivery && (
                    <p><strong>Estimated Delivery:</strong> {new Date(message.data.estimatedDelivery).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="order-items">
                  <h5>Items:</h5>
                  {message.data.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="status-message">
                  <p>{message.data.statusMessage}</p>
                </div>
              </div>
            </div>
          );

        case 'stock_check':
          return (
            <div>
              <p className="message-text">{message.content}</p>
              <div className="stock-info">
                <div className="stock-item">
                  <h4>{message.data.product.name}</h4>
                  <div className="stock-details">
                    <span className={`stock-badge ${message.data.lowStock ? 'low-stock' : 'in-stock'}`}>
                      {message.data.stock} in stock
                    </span>
                    <span className="price">${message.data.product.price}</span>
                  </div>
                  {message.data.lowStock && (
                    <p className="low-stock-warning">⚠️ Low stock - order soon!</p>
                  )}
                </div>
              </div>
            </div>
          );

        default:
          return <p className="message-text">{message.content}</p>;
      }
    }

    return <p className="message-text">{message.content}</p>;
  };

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.type} ${message.isError ? 'error' : ''}`}
        >
          <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
            {renderMessageContent(message)}
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="message bot">
          <div className="loading-message">
            <span>StyleBot is thinking</span>
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-text {
          margin: 0;
          white-space: pre-wrap;
          line-height: 1.5;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .order-details {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-top: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .order-header h4 {
          margin: 0;
          color: #1f2937;
          font-size: 1.1rem;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-processing {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-shipped {
          background: #d1fae5;
          color: #065f46;
        }

        .status-delivered {
          background: #dcfce7;
          color: #166534;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .order-info {
          margin: 12px 0;
        }

        .order-info p {
          margin: 6px 0;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .order-items {
          margin: 12px 0;
        }

        .order-items h5 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 0.9rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .status-message {
          margin-top: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #4f46e5;
        }

        .status-message p {
          margin: 0;
          font-size: 0.85rem;
          color: #475569;
        }

        .stock-info {
          margin-top: 12px;
        }

        .stock-item {
          background: white;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .stock-item h4 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .stock-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .stock-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .price {
          font-weight: 600;
          color: #4f46e5;
          font-size: 1rem;
        }

        .low-stock-warning {
          margin: 8px 0 0 0;
          font-size: 0.8rem;
          color: #d97706;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .stock-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .order-item {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageList;
