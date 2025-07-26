const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load orders data
const loadOrders = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data/orders.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  try {
    const orders = loadOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  try {
    const orders = loadOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`
      });
    }
    
    // Calculate order summary
    const orderSummary = {
      ...order,
      itemCount: order.items.length,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      statusMessage: getStatusMessage(order.status, order)
    };
    
    res.json({
      success: true,
      data: orderSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// GET /api/orders/customer/:customerId - Get orders by customer ID
router.get('/customer/:customerId', (req, res) => {
  try {
    const orders = loadOrders();
    const customerOrders = orders.filter(o => o.customerId === req.params.customerId);
    
    res.json({
      success: true,
      count: customerOrders.length,
      customerId: req.params.customerId,
      data: customerOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer orders',
      error: error.message
    });
  }
});

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', (req, res) => {
  try {
    const orders = loadOrders();
    const status = req.params.status.toLowerCase();
    const statusOrders = orders.filter(o => o.status.toLowerCase() === status);
    
    res.json({
      success: true,
      count: statusOrders.length,
      status: req.params.status,
      data: statusOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders by status',
      error: error.message
    });
  }
});

// GET /api/orders/:id/track - Get tracking information
router.get('/:id/track', (req, res) => {
  try {
    const orders = loadOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID ${req.params.id} not found`
      });
    }
    
    const trackingInfo = {
      orderId: order.id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveredDate: order.deliveredDate,
      statusMessage: getStatusMessage(order.status, order),
      shippingAddress: order.shippingAddress
    };
    
    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tracking information',
      error: error.message
    });
  }
});

// Helper function to get status message
function getStatusMessage(status, order) {
  const messages = {
    pending: 'Your order is being processed and will be shipped soon.',
    processing: 'Your order is being prepared for shipment.',
    shipped: `Your order has been shipped with tracking number ${order.trackingNumber}. Expected delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}.`,
    delivered: `Your order was delivered on ${new Date(order.deliveredDate).toLocaleDateString()}.`,
    cancelled: `Your order was cancelled${order.cancelReason ? `: ${order.cancelReason}` : '.'}`
  };
  
  return messages[status] || 'Order status unknown.';
}

module.exports = router;
