###########################################################
# 🛍️ StyleBot — E-commerce Customer Support Chatbot
# AI-powered chatbot for e-commerce clothing websites
###########################################################

📦 FEATURES:
------------
- Smart query understanding (NLP)
- Real-time order tracking
- Product search & filtering
- Inventory checking
- Top product listings
- Chatbot UI with responsive layout
- React frontend + Node.js backend

📁 PROJECT STRUCTURE:
----------------------
ecommerce-chatbot/
├── backend/                 # Node.js server
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── chatbot.js
│   ├── data/
│   │   ├── products.json
│   │   └── orders.json
│   └── controllers/
│       └── chatbotController.js
├── frontend/                # React client
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── components/
│       │   ├── Chatbot.js
│       │   ├── MessageList.js
│       │   ├── MessageInput.js
│       │   └── ProductCard.js
│       └── services/
│           └── api.js
└── README.md

🛠 SETUP INSTRUCTIONS:
-----------------------

1️⃣ Clone the repo:
--------------------
git clone <your-repo-url>
cd ecommerce-chatbot

2️⃣ Backend Setup:
-------------------
cd backend
npm install
npm run dev
# Runs at: http://localhost:5000

3️⃣ Frontend Setup:
--------------------
cd frontend
npm install
npm start
# Runs at: http://localhost:3000

4️⃣ Verify:
------------
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000

💬 SAMPLE CHAT QUERIES:
-------------------------
Order Status:
 - What's the status of order 12345?
 - Track my order 54321

Product Stock:
 - Check stock for Hoodie Sweatshirt
 - How many Classic T-Shirts are left?

Top Products:
 - Show me top 5 products
 - What are best selling items?

Product Search:
 - Find summer dresses
 - Search for jackets

🔗 API ENDPOINTS:
-------------------
Chatbot:
 - POST /api/chatbot/query
 - GET  /api/chatbot/help
 - GET  /api/chatbot/suggestions

Products:
 - GET /api/products
 - GET /api/products/:id
 - GET /api/products/top/:limit
 - GET /api/products/search/:query
 - GET /api/products/stock/:productName

Orders:
 - GET /api/orders
 - GET /api/orders/:id
 - GET /api/orders/:id/track

🎯 ADD PRODUCTS (products.json):
---------------------------------
{
  "id": "11",
  "name": "New Product",
  "category": "Shirts",
  "price": 99.99,
  "stock": 50,
  "sold": 100,
  "description": "Stylish and modern",
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "White"],
  "rating": 4.5
}

🧪 API TESTING (curl):
------------------------
curl -X POST http://localhost:5000/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me top 5 products"}'

curl http://localhost:5000/api/orders/12345

🚀 DEPLOYMENT:
-----------------
# Backend:
 - Use PM2 or Docker
 - Setup reverse proxy (Nginx)
 - Set env variables

# Frontend:
 - npm run build
 - Deploy /build to Netlify/Vercel
 - Update API URLs

🧠 CHATBOT INTELLIGENCE:
--------------------------
- Intent recognition (track, search, stock)
- Entity extraction (order IDs, product names)
- Context-aware replies
- Graceful fallback for invalid queries

🎨 STYLING:
-------------
- App-wide: src/App.css
- Component: components/*.js
- Responsive, mobile-friendly UI

🤝 CONTRIBUTING:
-----------------
git checkout -b new-feature
# Make changes & test
git push origin new-feature
# Submit Pull Request

📄 LICENSE:
------------
MIT License

📞 SUPPORT:
-------------
- Open GitHub issue
- Email or raise discussion

