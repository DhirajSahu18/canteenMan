import mongoose from "mongoose";

// Create a new Mongoose schema for the menu items (menu items will be in an array with breakfast, lunch, and beverages)
const menuSchema = new mongoose.Schema(
  {
    breakfast: [
      {
        name: String,
        description: String,
        price: Number,
        image: String,
        feedback: [
          {
            rating: Number,
            comment: String,
          },
        ],
      },
    ],
    lunch: [
      {
        name: String,
        description: String,
        price: Number,
        image: String,
        feedback: [
          {
            rating: Number,
            comment: String,
          },
        ],
      },
    ],
    beverages: [
      {
        name: String,
        description: String,
        price: Number,
        image: String,
        feedback: [
          {
            rating: Number,
            comment: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Create a new Mongoose model from the schema and export it
const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
