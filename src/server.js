import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Load environment variables
const { MONGO_URI, JWT_SECRET, PORT } = process.env;
if (!MONGO_URI || !JWT_SECRET) {
  console.error('❌ MONGO_URI or JWT_SECRET is missing in environment variables. Add them to .env file.');
  process.exit(1);
}

// ✅ CORS Configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Admin Schema & Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

// ✅ Test API Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ API is working!' });
});

// ✅ Admin Signup Route (Ensures Hashed Password)
app.post('/api/admin/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('❌ Admin Signup Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Signin Route (Check for Admin or User)
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🔹 Signin attempt: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 🔍 Check Admin Collection First
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      console.log(`Admin Password Match: ${isPasswordValid}`); // Debugging line
      if (isPasswordValid) {
        const token = jwt.sign({ userId: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, message: 'Admin login successful', role: 'admin' });
      }
    }

    res.status(401).json({ error: 'Invalid email or password' });
  } catch (err) {
    console.error('❌ Signin Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Middleware: Authenticate JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ✅ Protected Route Example (Requires Authentication)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed!', user: req.user });
});

// ✅ 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ✅ Start Server
const SERVER_PORT = PORT || 5000;
app.listen(SERVER_PORT, () => console.log(`🚀 Server running on port ${SERVER_PORT}`));
