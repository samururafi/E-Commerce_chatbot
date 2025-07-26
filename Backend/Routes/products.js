const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load products data
const loadProducts = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// GET /api/products - Get all products
router.get('/', (req, res) => {
  try {
    const products = loadProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET /api/products/top/:limit - Get top selling products
router.get('/top/:limit', (req, res) => {
  try {
    const products = loadProducts();
    const limit = parseInt(req.params.limit) || 5;
    
    const topProducts = products
      .sort((a, b) => b.sold - a.sold)
      .slice(0, limit);
    
    res.json({
      success: true,
      count: topProducts.length,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top products',
      error: error.message
    });
  }
});

// GET /api/products/search/:query - Search products
router.get('/search/:query', (req, res) => {
  try {
    const products = loadProducts();
    const query = req.params.query.toLowerCase();
    
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.colors.some(color => color.toLowerCase().includes(query))
    );
    
    res.json({
      success: true,
      count: filteredProducts.length,
      query: req.params.query,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const products = loadProducts();
    const category = req.params.category.toLowerCase();
    
    const categoryProducts = products.filter(product => 
      product.category.toLowerCase() === category
    );
    
    res.json({
      success: true,
      count: categoryProducts.length,
      category: req.params.category,
      data: categoryProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
});

// GET /api/products/stock/:productName - Check stock for specific product
router.get('/stock/:productName', (req, res) => {
  try {
    const products = loadProducts();
    const productName = req.params.productName.toLowerCase();
    
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName)
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product "${req.params.productName}" not found`
      });
    }
    
    res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        stock: product.stock,
        inStock: product.stock > 0,
        lowStock: product.stock < 10,
        price: product.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking stock',
      error: error.message
    });
  }
});

module.exports = router;
