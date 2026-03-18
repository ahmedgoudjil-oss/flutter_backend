const express = require('express');
const orderRouter = express.Router();
const Order = require('../models/order');

//Post roiute for order
orderRouter.post('/api/orders', async (req, res) => {
    try {
        const { fullName,
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
            createdAt,
        } = req.body;
        const CreatedAt = new Date().getMilliseconds();
        const order = new Order({
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
            createdAt,
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// feetch all orders for a specific buyer
orderRouter.get('/api/orders/buyer/:buyerId', async (req, res) => {
    try {
        const { buyerId } = req.params;
        const orders = await Order.find({ buyerId });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this buyer' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

orderRouter.delete("/api/orders/:id", async (req, res) => {
    try {
        //extract the id from the request parameter
        const { id } = req.params;
        //find and delete the order from the data base using the extrac
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            //if no order was found with the provided id return 4
            return res.status(404).json({ msg: "Order not found" });
        } elset
        //if the order was successfully deleted , return 200 status with a success message
        return res.status(200).json({ msg: "Order was deleted successully" });
    } catch (error) {
        //if there was an error during the process return 500 status with the error message

        res.status(500).json({ error: error.message || "Failed to delete order" });
    }
});

// feetch all orders by vendor id
orderRouter.get('/api/orders/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;
        const orders = await Order.find({ vendorId });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this vendor' });
        }
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id,
            { delivered: true },
            { new: true }

        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }else {
            return res.status(200).json({updatedOrder, message: 'Order marked as delivered successfully' });
        }

        
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

orderRouter.patch('/api/orders/:id/processing', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id,
            { processing : true },
            { new: true }

        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }else {
            return res.status(200).json({updatedOrder, message: 'Order marked as processing successfully' });
        }

        
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
});

module.exports = orderRouter;