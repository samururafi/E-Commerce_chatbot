import React from 'react';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (stock < 10) return { text: 'Low Stock', class: 'low-stock' };
    return { text: 'In Stock', class: 'in-stock' };
  };

  const stockStatus = getStockStatus(product.stock);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push('☆');
    }
    return stars.join('');
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="image-placeholder">
          <span className="product-icon">
            {product.category === 'shirts' && '👕'}
            {product.category === 'pants' && '👖'}
            {product.category === 'dresses' && '👗'}
            {product.category === 'shoes' && '👟'}
            {product.category === 'jackets' && '🧥'}
            {product.category === 'hoodies' && '👕'}
            {!['shirts', 'pants', 'dresses', 'shoes', 'jackets', 'hoodies'].includes(product.category) && '👔'}
          </span>
        </div>
        <div className={`stock-indicator ${stockStatus.class}`}>
          {stockStatus.text}
        </div>
      </div>

      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-category">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
        
        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-text">({product.rating})</span>
        </div>

        <div className="product-details">
          <div className="price-section">
            <span className="price">{formatPrice(product.price)}</span>
            <span className="stock-count">{product.stock} left</span>
          </div>
          
          <div className="sold-info">
            <span className="sold-count">{product.sold.toLocaleString()} sold</span>
          </div>
        </div>

        <div className="product-options">
          <div className="sizes">
            <span className="label">Sizes:</span>
            <div className="size-list">
              {product.sizes.slice(0, 4).map((size, index) => (
                <span key={index} className="size-tag">{size}</span>
              ))}
              {product.sizes.length > 4 && <span className="more">+{product.sizes.length - 4}</span>}
            </div>
          </div>
          
          <div className="colors">
            <span className="label">Colors:</span>
            <div className="color-list">
              {product.colors.slice(0, 3).map((color, index) => (
                <span key={index} className="color-tag">{color}</span>
              ))}
              {product.colors.length > 3 && <span className="more">+{product.colors.length - 3}</span>}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border-color: #4f46e5;
        }

        .product-image {
          position: relative;
          height: 120px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-placeholder {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .stock-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .out-of-stock {
          background: #fee2e2;
          color: #dc2626;
        }

        .product-info {
          padding: 16px;
        }

        .product-name {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
        }

        .product-category {
          margin: 0 0 8px 0;
          font-size: 0.8rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .stars {
          color: #fbbf24;
          font-size: 0.9rem;
        }

        .rating-text {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .product-details {
          margin-bottom: 12px;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #4f46e5;
        }

        .stock-count {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .sold-info {
          text-align: right;
        }

        .sold-count {
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        .product-options {
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
        }

        .sizes, .colors {
          margin-bottom: 8px;
        }

        .sizes:last-child, .colors:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          margin-right: 8px;
        }

        .size-list, .color-list {
          display: inline-flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .size-tag, .color-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .more {
          background: #e2e8f0;
          color: #64748b;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .product-card {
            border-radius: 8px;
          }

          .product-image {
            height: 100px;
          }

          .image-placeholder {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .product-info {
            padding: 12px;
          }

          .product-name {
            font-size: 0.9rem;
          }

          .price {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
