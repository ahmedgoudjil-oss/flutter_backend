const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors"); // استيراد cors أولًا
const authRouter = require("./routes/auth");
const bannerRouter= require("./routes/banner");
const categoryRouter= require('./routes/category');
const subcategoryRouter=require('./routes/sub_category');
const productRouter = require('./routes/product');
const productReviewRouter= require('./routes/product_review');
const vendorRouter = require('./routes/vendor');
const OrderRouter = require('./routes/order'); // استيراد راوتر الطلبات
const Order = require('./models/order'); // استيراد نموذج الطلبات

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express(); // ✅ تعريف app هنا أولًا

app.use(cors()); // ✅ تفعيل cors بعد تعريف app

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;

// إعدادات Express
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running successfully!' });
});

// ربط الراوترات
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subcategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);
app.use(vendorRouter);
app.use(OrderRouter); // ربط راوتر الطلبات

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect(DB).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
