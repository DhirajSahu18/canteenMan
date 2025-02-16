import Menu from "../Models/menu.model.js";
import express from "express";

const router = express.Router();

// Get the menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.findOne();
    res.status(200).json({
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
router.post("/add-feedback", async (req, res) => {
  try {
    const { itemName, rating, comment } = req.body;
    const menu = await Menu.findOne();
    const item = menu.breakfast.find((item) => item.name === itemName);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.feedback.push({ rating, comment });
    await menu.save();
    console.log("Feedback added successfully");
    res.status(200).json({
      message: "Feedback added successfully",
      feedback: item.feedback,
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/recommend", async (req, res) => {
  try {
    const menuDoc = await Menu.findOne();
    if (!menuDoc) {
      return res.status(404).json({ error: "Menu not found." });
    }

    const menu = {
      breakfast: menuDoc.breakfast || [],
      lunch: menuDoc.lunch || [],
      beverages: menuDoc.beverages || [],
    };

    const { item } = req.body;
    if (!item) {
      return res.status(400).json({ error: "Item is required in the request body." });
    }

    const recommendations = [];
    let foundItem = null;

    // Search for the item in the menu
    for (const category in menu) {
      foundItem = menu[category].find(menuItem => menuItem.name.toLowerCase() === item.toLowerCase());
      if (foundItem) break;
    }

    if (!foundItem) {
      return res.status(404).json({ error: "Item not found in the menu." });
    }

    // Recommendation logic
    const recommendedItemNames = {
      "fried rice": ["Soda", "Sprite", "Limca"],
      "poha": ["Tea", "Coffee"],
      "upma": ["Tea", "Coffee"],
      "misal pav": ["Lassi"],
      "vada pav": ["Tea", "Coffee"],
      "rasa vada": ["Lassi"],
      "pav bhaji": ["Soda", "Limca"],
      "idli": ["Tea", "Coffee"],
      "dal rice": ["Lassi"],
      "chapati bhaji": ["Lassi"],
      "veg thali": ["Lassi"],
      "pulao": ["Lassi"],
      "tea": ["Poha", "Upma", "Idli"],
      "coffee": ["Poha", "Upma", "Idli"],
      "soda": ["Fried Rice", "Pav Bhaji"],
      "sprite": ["Fried Rice", "Pav Bhaji"],
      "limca": ["Fried Rice", "Pav Bhaji"],
      "lassi": ["Misal Pav", "Rasa Vada", "Dal Rice", "Chapati Bhaji", "Veg Thali", "Pulao"]
    };

    // Fetch recommended items
    if (recommendedItemNames[foundItem.name.toLowerCase()]) {
      for (const itemName of recommendedItemNames[foundItem.name.toLowerCase()]) {
        const menuItem = await getMenuItem(itemName);
        if (menuItem) recommendations.push(menuItem);
      }
    }

    // If no hardcoded recommendations, suggest 2 other items from the same category
    if (recommendations.length === 0) {
      for (const category in menu) {
        const otherItems = menu[category].filter(menuItem => menuItem.name.toLowerCase() !== item.toLowerCase());
        recommendations.push(...otherItems.slice(0, 2));
        break;
      }
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// Fixed getMenuItem function
async function getMenuItem(itemName) {
  try {
    const menuDoc = await Menu.findOne();
    if (!menuDoc) return null;

    const menu = {
      breakfast: menuDoc.breakfast || [],
      lunch: menuDoc.lunch || [],
      beverages: menuDoc.beverages || [],
    };

    for (const category in menu) {
      const foundItem = menu[category].find(item => item.name.toLowerCase() === itemName.toLowerCase());
      if (foundItem) {
        return foundItem;
      }
    }

    return null;
  } catch (error) {
    console.error("Error in getMenuItem:", error);
    return null;
  }
}

export default router;
