const cors = require('cors');

// CORS configuration
const corsOptions = {
  // Allow requests from frontend development server and production domains
  origin: [
    'http://localhost:3000',     // React development server
    'http://localhost:3001',     // Alternative React port
    'http://127.0.0.1:3000',     // Alternative localhost format
    'https://your-frontend-domain.com', // Replace with your production domain
    // Add more origins as needed
  ],
  
  // Allow credentials (cookies, authorization headers, TLS client certificates)
  credentials: true,
  
  // Allow specific HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  
  // Allow specific headers
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  
  // Expose headers to the client
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  
  // Cache preflight request for 24 hours
  maxAge: 86400,
  
  // Handle preflight requests
  preflightContinue: false,
  
  // Provide successful response for preflight requests
  optionsSuccessStatus: 200
};

// Development CORS (more permissive)
const devCorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: '*',
  optionsSuccessStatus: 200
};

// Custom CORS middleware function
const customCorsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Log CORS requests for debugging
  console.log(`CORS request from origin: ${origin || 'No origin'}`);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  
  next();
};

// Export different CORS configurations
module.exports = {
  // Default CORS middleware (production-ready)
  corsMiddleware: cors(corsOptions),
  
  // Development CORS middleware (permissive)
  devCorsMiddleware: cors(devCorsOptions),
  
  // Custom CORS middleware
  customCorsMiddleware,
  
  // CORS options for manual configuration
  corsOptions,
  devCorsOptions,
  
  // Environment-based CORS selection
  getCorsMiddleware: () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('Using development CORS settings (permissive)');
      return cors(devCorsOptions);
    } else if (isProduction) {
      console.log('Using production CORS settings (restricted)');
      return cors(corsOptions);
    } else {
      console.log('Using default CORS settings');
      return cors(corsOptions);
    }
  }
};
