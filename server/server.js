const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Error:", err));

// Schema & Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

// Routes
app.post("/api/items", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newItem = new Item({ name, description });
    res.status(201).json(await newItem.save());
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error: error.message });
  }
});

app.get("/api/items", async (_, res) => {
  try {
    res.status(200).json(await Item.find());
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error: error.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
