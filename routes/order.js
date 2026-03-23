const express = require('express');
const orderRouter = express.Router();
const Order = require('../models/order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// 🔥 Helper function (باش نتفاداو المشاكل)
const sendOrders = (res, orders) => {
  return res.status(200).json(orders || []);
};


// ================== CREATE ORDER ==================
orderRouter.post('/api/orders', async (req, res) => {
  try {
    const {
      fullName,
      email,
      state,
      city,
      locality,
      productName,
      productPrice,
      quantity,
      category,
      image,
      buyerId,
      vendorId,
    } = req.body;

    // ✅ Validation (مهم جدًا)
    if (!buyerId || !productName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ إنشاء الطلب مع default values
    const order = new Order({
      fullName: fullName || "",
      email: email || "",
      state: state || "",
      city: city || "",
      locality: locality || "",
      productName: productName || "",
      productPrice: productPrice || 0,
      quantity: quantity || 1,
      category: category || "",
      image: image || "",
      buyerId: buyerId || "",
      vendorId: vendorId || "",
      createdAt: Date.now(),
      delivered: false,
      processing: true,
    });

    await order.save();

    return res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: error.message });
  }
});

//payment route
orderRouter.post('/api/payment', auth,async (req, res) => {
  try {
   const { amount, currency,} = req.body;
   const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
   });
   return res.status(200).json(paymentIntent);


  } catch (error) {
    
    return res.status(500).json({ error: error.message });
  }
});

orderRouter.get("/api/payment-intent/:id", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.params.id
    );

    res.status(200).json(paymentIntent);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================== GET ORDERS BY BUYER ==================
orderRouter.get('/api/orders/buyer/:buyerId', async (req, res) => {
  try {
    const { buyerId } = req.params;

    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });

    return sendOrders(res, orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: error.message });
  }
});


// ================== GET ORDERS BY VENDOR ==================
orderRouter.get('/api/orders/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.find({ vendorId }).sort({ createdAt: -1 });

    return sendOrders(res, orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: error.message });
  }
});


// ================== DELETE ORDER ==================
orderRouter.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// ================== MARK AS DELIVERED ==================
orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { delivered: true, processing: false },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: error.message });
  }
});


// ================== MARK AS PROCESSING ==================
orderRouter.patch('/api/orders/:id/processing', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { processing: true },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = orderRouter;