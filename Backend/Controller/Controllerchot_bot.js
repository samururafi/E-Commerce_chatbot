const fs = require('fs');
const path = require('path');

// Load data
const loadProducts = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const loadOrders = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/orders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Natural Language Processing for chatbot queries
class ChatbotController {
  
  processQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Order status queries
    if (this.isOrderQuery(lowerQuery)) {
      return this.handleOrderQuery(query, lowerQuery);
    }
    
    // Product stock queries
    if (this.isStockQuery(lowerQuery)) {
      return this.handleStockQuery(query, lowerQuery);
    }
    
    // Top products queries
    if (this.isTopProductsQuery(lowerQuery)) {
      return this.handleTopProductsQuery(query, lowerQuery);
    }
    
    // Product search queries
    if (this.isProductSearchQuery(lowerQuery)) {
      return this.handleProductSearchQuery(query, lowerQuery);
    }
    
    // General help
    if (this.isGreetingOrHelp(lowerQuery)) {
      return this.handleGreeting();
    }
    
    // Default response
    return this.handleUnknownQuery(query);
  }
  
  // Query type detection methods
  isOrderQuery(query) {
    const orderKeywords = ['order', 'status', 'track', 'delivery', 'shipped', 'delivered'];
    const orderIdPattern = /\b\d{5}\b/; // 5-digit order ID
    return orderKeywords.some(keyword => query.includes(keyword)) || orderIdPattern.test(query);
  }
  
  isStockQuery(query) {
    const stockKeywords = ['stock', 'available', 'inventory', 'left', 'how many'];
    return stockKeywords.some(keyword => query.includes(keyword));
  }
  
  isTopProductsQuery(query) {
    const topKeywords = ['top', 'best', 'most sold', 'popular', 'bestseller'];
    return topKeywords.some(keyword => query.includes(keyword));
  }
  
  isProductSearchQuery(query) {
    const searchKeywords = ['show', 'find', 'search', 'look for', 'what', 'which'];
    return searchKeywords.some(keyword => query.includes(keyword));
  }
  
  isGreetingOrHelp(query) {
    const greetingKeywords = ['hello', 'hi', 'hey', 'help', 'assist', 'support'];
    return greetingKeywords.some(keyword => query.includes(keyword));
  }
  
  // Query handlers
  handleOrderQuery(originalQuery, query) {
    const orderIdMatch = originalQuery.match(/\b(\d{5})\b/);
    
    if (orderIdMatch) {
      const orderId = orderIdMatch[1];
      const orders = loadOrders();
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        return {
          type: 'order_status',
          success: true,
          data: {
            orderId: order.id,
            status: order.status,
            customerName: order.customerName,
            items: order.items,
            total: order.total,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery,
            deliveredDate: order.deliveredDate,
            statusMessage: this.getOrderStatusMessage(order)
          },
          message: `Here's the status for order ${orderId}:`
        };
      } else {
        return {
          type: 'order_not_found',
          success: false,
          message: `I couldn't find an order with ID ${orderId}. Please check the order number and try again.`
        };
      }
    }
    
    return {
      type: 'order_help',
      success: true,
      message: 'To check your order status, please provide your 5-digit order ID (e.g., "What\'s the status of order 12345?").'
    };
  }
  
  handleStockQuery(originalQuery, query) {
    const products = loadProducts();
    
    // Try to extract product name from query
    const productNames = products.map(p => p.name.toLowerCase());
    let foundProduct = null;
    
    for (const product of products) {
      const productNameWords = product.name.toLowerCase().split(' ');
      if (productNameWords.some(word => query.includes(word))) {
        foundProduct = product;
        break;
      }
    }
    
    if (foundProduct) {
      return {
        type: 'stock_check',
        success: true,
        data: {
          product: foundProduct,
          stock: foundProduct.stock,
          inStock: foundProduct.stock > 0,
          lowStock: foundProduct.stock < 10
        },
        message: `${foundProduct.name} has ${foundProduct.stock} items in stock.${foundProduct.stock < 10 ? ' (Low stock!)' : ''}`
      };
    }
    
    return {
      type: 'stock_help',
      success: false,
      message: 'I couldn\'t identify the specific product. Please try asking like "How many Classic T-Shirts are left in stock?"'
    };
  }
  
  handleTopProductsQuery(originalQuery, query) {
    const products = loadProducts();
    
    // Extract number from query (default to 5)
    const numberMatch = originalQuery.match(/\b(\d+)\b/);
    const limit = numberMatch ? parseInt(numberMatch[1]) : 5;
    
    const topProducts = products
      .sort((a, b) => b.sold - a.sold)
      .slice(0, Math.min(limit, 10)); // Max 10 products
    
    return {
      type: 'top_products',
      success: true,
      data: topProducts,
      message: `Here are the top ${topProducts.length} most sold products:`
    };
  }
  
  handleProductSearchQuery(originalQuery, query) {
    const products = loadProducts();
    
    // Remove common search words to get the actual search term
    const searchWords = ['show', 'find', 'search', 'look for', 'what', 'which', 'me', 'the', 'a', 'an'];
    const queryWords = originalQuery.toLowerCase().split(' ');
    const searchTerms = queryWords.filter(word => !searchWords.includes(word));
    
    if (searchTerms.length === 0) {
      return {
        type: 'search_help',
        success: false,
        message: 'What would you like to search for? Try asking like "Show me dresses" or "Find running shoes".'
      };
    }
    
    const searchTerm = searchTerms.join(' ');
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.colors.some(color => color.toLowerCase().includes(searchTerm))
    );
    
    if (filteredProducts.length > 0) {
      return {
        type: 'product_search',
        success: true,
        data: filteredProducts.slice(0, 8), // Limit to 8 results
        searchTerm: searchTerm,
        message: `I found ${filteredProducts.length} products matching "${searchTerm}":`
      };
    }
    
    return {
      type: 'no_results',
      success: false,
      message: `I couldn't find any products matching "${searchTerm}". Try searching for items like "shirts", "jeans", "shoes", or "jackets".`
    };
  }
  
  handleGreeting() {
    return {
      type: 'greeting',
      success: true,
      message: 'Hello! I\'m your customer support assistant. I can help you with:\n\n• Check order status (e.g., "Status of order 12345")\n• Check product stock (e.g., "How many Classic T-Shirts are left?")\n• Find top selling products (e.g., "Show me top 5 products")\n• Search for products (e.g., "Find running shoes")\n\nHow can I assist you today?'
    };
  }
  
  handleUnknownQuery(query) {
    return {
      type: 'unknown',
      success: false,
      message: 'I\'m sorry, I didn\'t understand that request. I can help you with order status, product stock, top products, and product searches. Try asking something like:\n\n• "What\'s the status of order 12345?"\n• "How many Classic T-Shirts are in stock?"\n• "Show me the top 5 products"\n• "Find summer dresses"'
    };
  }
  
  getOrderStatusMessage(order) {
    const messages = {
      pending: 'Your order is being processed and will be shipped soon.',
      processing: 'Your order is being prepared for shipment.',
      shipped: `Your order has been shipped${order.trackingNumber ? ` with tracking number ${order.trackingNumber}` : ''}. Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}.`,
      delivered: `Your order was delivered on ${new Date(order.deliveredDate).toLocaleDateString()}.`,
      cancelled: `Your order was cancelled${order.cancelReason ? `: ${order.cancelReason}` : '.'}`
    };
    
    return messages[order.status] || 'Order status unknown.';
  }
}

module.exports = new ChatbotController();
