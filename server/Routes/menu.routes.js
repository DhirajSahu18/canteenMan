import Menu from "../Models/menu.model.js";
import express from "express";

const router = express.Router();

// Get the menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.findOne();
    res
      .status(200)
      .json({
        Breakfast: menu.breakfast,
        Lunch: menu.lunch,
        Beverages: menu.beverages,
      });
  } catch (error) {
    console.log("Error in fetching menu:", error?.message);
    res.status(404).json({ message: error.message });
  }
});

// Update the menu (I will provide you with the entire menu object)
router.put("/", async (req, res) => {
  try {
    const { breakfast, lunch, beverages } = req.body;
    const menu = await Menu.findOneAndUpdate(
      {},
      { breakfast, lunch, beverages },
      { new: true }
    );
    res.status(200).json({
      breakfast: menu.breakfast,
      lunch: menu.lunch,
      beverages: menu.beverages,
    });
    console.log("Menu updated successfully");
  } catch (error) {
    console.log("Error in updating menu:", error?.message);
    res.status(404).json({ message: error.message });
  }
});


// Route to add a feedback

// Add feedback to a menu item
router.post("/add-feedback" , async (req, res) => {
    try {
        const {  itemName, rating, comment } = req.body;
        const menu = await Menu.findOne();
        const item = menu.breakfast.find((item) => item.name === itemName);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.feedback.push({ rating, comment });
        await menu.save();
        console.log("Feedback added successfully");
        res.status(200).json({ message: "Feedback added successfully", feedback: item.feedback });
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Recommendations
router.get('/recommend', async (req, res) => {
    try {
      const menu = await Menu.findOne(); // Assuming you have only one menu document
  
      if (!menu) {
        return res.status(404).json({ message: 'Menu not found' });
      }
  
      const recommendations = {};
  
      // Iterate through each category (breakfast, lunch, beverages)
      for (const category in menu) {
        if (Array.isArray(menu[category])) { // Check if it's an array of items
          menu[category].forEach((item) => {
            if (item.feedback && item.feedback.length > 0) {
              const totalRating = item.feedback.reduce((sum, feedback) => sum + feedback.rating, 0);
              const avgRating = totalRating / item.feedback.length;
              recommendations[item.name] = avgRating;
            } else {
              // Handle cases where there's no feedback (e.g., set default rating, or exclude)
              recommendations[item.name] = 0; // Or you could choose to not include the item
            }
          });
        }
      }
  
      res.status(200).json(recommendations);
    } catch (error) {
      console.error('Error in recommendations:', error);
      res.status(500).json({ message: error.message }); // 500 for server error
    }
  });
  


export default router;
