const express = require('express');
const chatbotController = require('../controllers/chatbotController');
const router = express.Router();

// POST /api/chatbot/query - Process chatbot query
router.post('/query', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message'
      });
    }
    
    const response = chatbotController.processQuery(message.trim());
    
    res.json({
      success: true,
      query: message,
      timestamp: new Date().toISOString(),
      ...response
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error processing your request. Please try again.',
      error: error.message
    });
  }
});

// GET /api/chatbot/help - Get help information
router.get('/help', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        capabilities: [
          {
            feature: 'Order Status',
            description: 'Check the status of your orders',
            examples: [
              'What\'s the status of order 12345?',
              'Track order 12346',
              'Where is my order 12347?'
            ]
          },
          {
            feature: 'Product Stock',
            description: 'Check inventory levels for products',
            examples: [
              'How many Classic T-Shirts are left in stock?',
              'Is the Denim Jeans available?',
              'Check stock for Running Shoes'
            ]
          },
          {
            feature: 'Top Products',
            description: 'Get the best selling products',
            examples: [
              'Show me the top 5 products',
              'What are the most popular items?',
              'Top 3 bestsellers'
            ]
          },
          {
            feature: 'Product Search',
            description: 'Find products by name, category, or description',
            examples: [
              'Show me summer dresses',
              'Find running shoes',
              'Search for jackets'
            ]
          }
        ],
        tips: [
          'Use specific order IDs (5 digits) for order status',
          'Include product names for stock checks',
          'Try different search terms if you don\'t find what you\'re looking for',
          'Ask for help anytime by saying "help" or "assist"'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching help information',
      error: error.message
    });
  }
});

// GET /api/chatbot/suggestions - Get query suggestions
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = [
      'What\'s the status of order 12345?',
      'Show me the top 5 most sold products',
      'How many Classic T-Shirts are left in stock?',
      'Find summer dresses',
      'Search for running shoes',
      'Check stock for Hoodie Sweatshirt',
      'What are the most popular products?',
      'Track my order',
      'Show me jackets',
      'Help me find yoga pants'
    ];
    
    // Return random 5 suggestions
    const randomSuggestions = suggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    res.json({
      success: true,
      data: randomSuggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
});

module.exports = router;
