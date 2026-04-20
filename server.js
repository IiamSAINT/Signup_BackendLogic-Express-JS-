

const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  
  console.log(`User signed up with username: ${username} and password: ${password}`);
  res.status(201).send( {message: "user received ",
                        user : username
});
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  console.log(`User logged in with username: ${username} and password: ${password}`);
  res.status(200).send({
            message: "Logged in Sucessfull",
            user: username
  });
});