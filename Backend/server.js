import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { connect, Schema, model, mongoose } from "mongoose";
import multer from 'multer';
import path from 'path';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json({ limit: "50mb" })); // Increase limit for base64 images

// ✅ CORS Configuration (Allow Frontend Requests)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ MONGO_URI is missing in the .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });


// Storage settings (Uploads to 'uploads/' folder)
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  }
});

const upload = multer({ storage });

// Serve static files from 'uploads' folder
app.use("/uploads", express.static("uploads"));

// Product Image Upload Endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` }); // Return image URL
});



// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed password
  loginDate: { type: Date, default: Date.now },
});

// Product Schema & Model
const ProductSchema = new Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,
});

const User = mongoose.model('User', userSchema);

// ✅ Root Route (Health Check)
app.get('/', (req, res) => {
  res.send('🚀 Server is Running!');
});

app.post('/api/signup', async (req, res) => {
  console.log('📥 Received sign-up request:', req.body); // Debug log

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.error('❌ Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('❌ Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log('✅ User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('❌ Signup Error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// ✅ Login Route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is missing in the .env file');
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Fetch all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
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

// Fetch User 
app.get("/api/users", async (req, res) => {
  try {
      const users = await User.find().select("-password"); // Exclude password
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch Single User by ID
app.get("/api/users/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Delete a user by ID
app.delete("/api/users/:id", async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
  }
});

// Delete Products from Admin
app.delete("/api/products/:id", async (req, res) => {
  try {
      const productId = req.params.id;
      const result = await Product.findByIdAndDelete(productId);

      if (!result) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
  }
});


// Update a Product
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));