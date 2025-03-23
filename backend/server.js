const express = require('express');
const mongoose = require('mongoose'); // Change import to require 
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

require('dotenv').config(); // Load environment variables
const { Schema } = mongoose;

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
app.use(bodyParser.json());

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

const Product = mongoose.model("Product", ProductSchema);
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Order Schema
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingDetails: { firstName: String, lastName: String, email: String, address: String },
  status: { type: String, enum: ["Pending", "In Progress", "Delivered", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", OrderSchema);

// Store OTPs temporarily (Not recommended for production)
const otpStore = {};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is correctly loaded
    pass: process.env.EMAIL_PASSWORD, // Ensure this is correct
  },
});

// 📩 **Send OTP API**
app.post("/api/orders/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  try {
    otpStore[email] = otp; // ✅ Store OTP correctly before sending email

    await transporter.sendMail({
      from: `"LuxeFurnish Support" <${process.env.EMAIL_USER}>`, // Better branding
      to: email,
      subject: "🔐 LuxeFurnish OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2C3E50; text-align: center;">🔑 Your One-Time Password (OTP)</h2>
            <p style="font-size: 16px; color: #333; text-align: center;">
              Hello, <strong>${email}</strong> 👋
            </p>
            <p style="font-size: 16px; color: #333; text-align: center;">
              Use the following OTP to complete your verification process:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #27ae60; background: #ecf0f1; padding: 10px 20px; border-radius: 5px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; text-align: center; color: #888;">
              This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; text-align: center; color: #aaa;">
              If you did not request this OTP, please ignore this email.
            </p>
            <p style="font-size: 12px; text-align: center; color: #aaa;">
              &copy; 2025 LuxeFurnish. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });    

    console.log(`✅ OTP Sent to ${email}:`, otp); // Debugging
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// ✅ **Verify OTP API & Store Order**
app.post("/api/orders/verify-otp", async (req, res) => {
  const { email, otp, orderId } = req.body;

  try {
    console.log(`Received OTP Verification for ${email}`);

    if (!otpStore[email] || Date.now() > otpStore[email].expiresAt) {
      return res.status(400).json({ error: "❌ OTP expired or not found" });
    }

    if (String(otpStore[email].otp) === String(otp)) {
      console.log("✅ OTP Verified!");

      // Ensure the order exists before updating
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "❌ Order not found" });

      order.status = "Pending";
      await order.save();

      delete otpStore[email]; // Remove OTP after successful verification

      res.json({ message: "✅ Order Placed Successfully!" });
    } else {
      console.log("❌ Invalid OTP Attempt!");
      res.status(400).json({ error: "❌ Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});




// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));