
const express = require('express');
const mongoose = require('mongoose');
const ProductReview = require('../models/product_review');
const Product = require('../models/product');

const productReviewRouter = express.Router();

// إنشاء مراجعة جديدة لمنتج
productReviewRouter.post('/api/product-review', async (req, res) => {
  try {
    const { buyerId, email, fullName, productId, rating, review } = req.body;
       const existingReview = await ProductReview.findOne({ buyerId, productId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }
    const numericRating = parseFloat(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    const newReview = new ProductReview({
      buyerId,
      email,
      fullName,
      productId,
      rating: numericRating,
      review
    });

    await newReview.save();

    const product = await Product.findById(productId);
    if (!product) {
  console.log("❌ Product not found for ID:", productId);
  return res.status(404).json({ error: 'Product not found' });
}

    
    product.totalRatings += 1;
    product.averageRating =
      ((product.averageRating * (product.totalRatings - 1)) + numericRating) / product.totalRatings;

    await product.save();

    return res.status(201).send(newReview);

  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ error: e.message });
  }
});

// تصدير الراوتر لاستخدامه في التطبيق الرئيسي
module.exports = productReviewRouter;
