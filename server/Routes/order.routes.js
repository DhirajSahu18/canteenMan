import Order from "../Models/orders.model.js";
import express from "express";

const router = express.Router();
// const orderSchema = new mongoose.Schema({
//   tableNumber : String,
//   items : [
//     {
//       itemName: String,
//       quantity: Number,
//       price: Number,
//     },
//   ],
//   total: Number,
//   status: String,
// },{timestamps: true});


// Get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.log("Error in fetching orders:", error?.message);
        res.status(404).json({ message: error.message });
    }
});

// Update order status
router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(updatedOrder);
        console.log("Order status updated successfully");
    } catch (error) {
        console.log("Error in updating order status:", error?.message);
        res.status(404).json({ message: error.message });
    }
});

// Create Order
router.post("/", async (req, res) => {
    try {
        const { tableNumber, items, total, status } = req.body;
        const order = new Order({
            tableNumber,
            items,
            total,
            status,
        });
        await order.save();
        res.status(201).json(order);
        console.log("Order created successfully");
    } catch (error) {
        console.log("Error in creating order:", error?.message);
        res.status(404).json({ message: error.message });
    }
});

export default router;