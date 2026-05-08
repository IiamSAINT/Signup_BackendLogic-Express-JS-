require("dotenv").config();
const User = require("./models/User");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());
let refreshTokens = [];


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(cors({
  origin: "http://localhost:5173", // your React app
  methods: ["GET", "POST"],
  credentials: true
}));


app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
  res.send("Api is working");
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

let users = [];

// SIGNUP ENDPOINT 
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword
  });

  await newUser.save();

  res.json({ message: "User created successfully" });
});


// MIDDLEWARE TO PROTECT ROUTES

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.json({ message: "Invalid token format" });
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
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    //  Generate REFRESH TOKEN (long-lived)
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.JWT_REFRESH_SECRET,
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
      process.env.JWT_REFRESH_SECRET
    );

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      {
        username: decoded.username
      },
      process.env.JWT_SECRET,
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