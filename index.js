const express = require('express'); 
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

// استيراد الراوترات
const authorRouter = require("./routes/auth");
const bannerRouter = require("./routes/banner");
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const OrderRouter = require('./routes/order');

const app = express();

// Middleware عام
app.use(cors());
app.use(express.json());

// إعدادات السيرفر
const PORT = process.env.PORT || 3000;

// الاتصال بقاعدة البيانات
// استخدام الرابط من .env مباشرة بدون dbName لأنه موجود في URI
const DB = process.env.DB;

mongoose.connect(DB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// تأكيد أن الاتصال مفتوح
mongoose.connection.once('open', () => {
  console.log("✅ MongoDB connection is open and ready!");
});

// نقطة فحص للسيرفر
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running successfully!' });
});

// ربط الراوترات
app.use(authorRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(OrderRouter);

// ميدلوير للأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ميدلوير 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});