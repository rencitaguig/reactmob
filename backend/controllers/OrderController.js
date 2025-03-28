const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body;

        if (!userId || !items || items.length === 0 || !totalPrice) {
            return res.status(400).json({ message: "User ID, items, and total price are required." });
        }

        const newOrder = new Order({ userId, items, totalPrice });
        await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error); // Debugging: log the error details
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").populate("items.productId", "name price");
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "name email").populate("items.productId", "name price");
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: "Status is required" });

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error); // Debugging: log the error details
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Server error" });
    }
};
