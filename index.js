const express = require('express'); 
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

// Import Routers
const authorRouter = require("./routes/auth");
const bannerRouter = require("./routes/banner");
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const OrderRouter = require('./routes/order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Database Connection
mongoose.connect(process.env.DB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.once('open', () => {
  console.log("✅ MongoDB connection is open and ready!");
});

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running successfully!' });
});

// ✅ Routes — each with its own prefix
app.use('/api/auth', authorRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/subcategories', subcategoryRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', productReviewRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/orders', OrderRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Handler — must be last
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});