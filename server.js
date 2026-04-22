require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET 



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
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).send({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  
  console.log(`User signed up with username: ${username} and password: ${password}`);
  res.status(201).send( {message: "user created successfully",
                        user : username
});
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
    const decoded = jwt.verify(token,SECRET_KEY );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }};
 


// LOGIN ENDPOINT 

app.post("/login",async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send({ message: "Invalid username or password" });

  }

  if(!username || !password){
    return res.status(400).send({ message: "Username and password are required" })};

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    
  console.log(`User logged in with username: ${username} and password: ${password}`);
  res.status(200).send({
            message: "Logged in Successfully",
            user: username,
            token: token
  });
  
});


app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have accessed a protected route!` });
});

