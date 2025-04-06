const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId || !req.body.items || !req.body.paymentMethod) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    // Calculate total price from items to ensure accuracy
    const itemsTotal = req.body.items.reduce((sum, item) => 
      sum + (Number(item.price) * Number(item.quantity)), 0
    );
    
    const shippingFee = Number(req.body.shippingFee || 75);
    const totalPrice = itemsTotal + shippingFee;

    // Ensure totalPrice is a valid number
    if (isNaN(totalPrice)) {
      return res.status(400).json({ 
        message: "Invalid price calculation" 
      });
    }

    const orderData = {
      userId: req.body.userId,
      items: req.body.items,
      totalPrice: totalPrice,
      originalPrice: itemsTotal,
      shippingFee: shippingFee,
      paymentMethod: req.body.paymentMethod
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ 
      message: "Order created successfully",
      order 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      message: "Failed to create order",
      error: error.message 
    });
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
        console.error("Error updating order:", error);
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
