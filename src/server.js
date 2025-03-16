import express, { json } from "express";
import { connect, Schema, model } from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(json());
app.use(cors());

// Connect to MongoDB
connect("mongodb://localhost:27017/luxefurnish", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Product Schema & Model
const ProductSchema = new Schema({
    name: String,
    category: String,
    price: Number,
    stock: Number,
    image: String,
});
const Product = model("Product", ProductSchema);

// Routes

// Get all products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Add a new product
app.post("/api/products", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Update a product
app.put("/api/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
    }
});


// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));