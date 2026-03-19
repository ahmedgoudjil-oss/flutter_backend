const express = require('express');
const Product = require('../models/product');
const Vendor = require('../models/vendor');
const productRouter = express.Router();
const { auth, vendorAuth } = require('../middleware/auth');


// 🔥 Helper function (مهم جدًا)
const sendProducts = (res, products) => {
  return res.status(200).json(products || []);
};


// ================== ADD PRODUCT ==================
productRouter.post('/api/add-product', auth, vendorAuth, async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      fullName,
      subCategory,
      images
    } = req.body;

    const product = new Product({
      productName,
      productPrice,
      quantity,
      description,
      category,
      vendorId,
      fullName,
      subCategory,
      images
    });

    await product.save();
    return res.status(201).json(product);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== POPULAR ==================
productRouter.get('/api/popular-product', async (req, res) => {
  try {
    const products = await Product.find({ popular: true });
    return sendProducts(res, products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== RECOMMENDED ==================
productRouter.get('/api/recommended-product', async (req, res) => {
  try {
    const products = await Product.find({ recommend: true });
    return sendProducts(res, products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== BY CATEGORY ==================
productRouter.get('/api/products-by-categroy/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    return sendProducts(res, products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== RELATED ==================
productRouter.get('/api/related-products-by-subcategory/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return sendProducts(res, []);
    }

    const relatedProducts = await Product.find({
      subCategory: product.subCategory,
      _id: { $ne: productId }
    });

    return sendProducts(res, relatedProducts);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== TOP RATED ==================
productRouter.get('/api/top-rated-products', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ averageRating: -1 })
      .limit(10);

    return sendProducts(res, products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== BY SUBCATEGORY ==================
productRouter.get('/api/product-by-subcategory/:subCategory', async (req, res) => {
  try {
    const { subCategory } = req.params;
    const products = await Product.find({ subCategory });
    return sendProducts(res, products);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== SEARCH ==================
productRouter.get('/api/search-product', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return sendProducts(res, []);
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    return sendProducts(res, products);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== EDIT PRODUCT ==================
productRouter.put('/api/edit-product/:productId', auth, vendorAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { vendorId, ...updateData } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json(updatedProduct);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


// ================== BY VENDOR ==================
productRouter.get('/api/product/vendor/:vendorId', auth, vendorAuth, async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendorExist = await Vendor.findById(vendorId);
    if (!vendorExist) {
      return sendProducts(res, []);
    }

    const products = await Product.find({ vendorId });
    return sendProducts(res, products);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


module.exports = productRouter;