const mongoose = require('mongoose');

const productReviewSchema = mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId بدل String لتسهيل العلاقات
    required: true,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  productId: {
    type: String, // ObjectId بدل String
    required: true,
    ref: 'Product',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // وقت إنشاء المراجعة
  },
});

const ProductReview = mongoose.model('ProductReview', productReviewSchema);
module.exports = ProductReview;
