import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(cors());

// DB Config
const connection_url =
  process.env.MONGO_URL ||
  "mongodb+srv://admin:admin@cluster0.3apuxzg.mongodb.net/canteen";
// Create a new Mongoose connection function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(connection_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
// Call the connectToDatabase function
connectToDatabase();

// API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello World!"));
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));

// Routes
import menuRoutes from "./Routes/menu.routes.js";
import orderRoutes from "./Routes/order.routes.js";
import Menu from "./Models/menu.model.js";

app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);


import Razorpay from 'razorpay';
import * as crypto from "crypto"

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Add this new endpoint to create order
app.post("/create-payment", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Error creating payment" });
  }
});

// Add endpoint to verify payment
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
});
