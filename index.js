const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

// استيراد الراوترات
const authRouter = require("./routes/auth");
const bannerRouter = require("./routes/banner");
const categoryRouter = require('./routes/category');
const subcategoryRouter = require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter = require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const OrderRouter = require('./routes/order');
const Order = require('./models/order');

const app = express();

// إعدادات عامة
app.use(cors());
app.use(express.json());

// إعدادات السيرفر
const PORT = 3000;

// الاتصال بقاعدة البيانات مباشرة بدون .env
const DB = "mongodb+srv://agoudjil381:sfvTucAiLbIGdI05@cluster0.aglpeor.mongodb.net/ahmedapp?retryWrites=true&w=majority";

mongoose.connect(DB, {
  dbName: "ahmedapp",
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// نقطة فحص للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running successfully!' });
});

// ربط جميع الراوترات
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(OrderRouter);

// ميدلوير الأخطاء العامة
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
