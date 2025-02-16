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


