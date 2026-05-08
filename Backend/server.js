require("dotenv").config();
const User = require("./models/User");
const checkRole = require("./middleware/role");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET;

app.use(helmet());
let refreshTokens = [];


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      process.env.CLIENT_URL
    ];

    if (!origin || allowedOrigins.filter(Boolean).includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
  res.send("Api is working");
});

// SIGNUP ENDPOINT 
app.post("/signup", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user"
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// MIDDLEWARE TO PROTECT ROUTES

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};



// LOGIN ENDPOINT 
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //  Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    //  Find user in DB
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  Generate ACCESS TOKEN (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    //  Generate REFRESH TOKEN (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    //  Store refresh token (temporary)
    refreshTokens.push(refreshToken);

    //  Send response
    res.json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// REFRESH ROUTE

app.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  // Check if token exists
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  // Check if token is valid (stored)
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_SECRET_KEY
    );

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Send new token
    res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

// LOGOUT ROUTE
app.post("/logout", (req, res) => {
  const { refreshToken } = req.body;

  refreshTokens = refreshTokens.filter(token => token !== refreshToken);

  res.json({ message: "Logged out successfully" });
});

// PROTECTED ROUTE
app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user
  });
});

// ADMIN-ONLY PROTECTED ROUTE
app.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({
    message: "Welcome admin",
    user: req.user
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
