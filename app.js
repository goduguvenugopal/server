const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const {Register } = require("./Model");
const jwt = require("jsonwebtoken");

// Middlewares
dotEnv.config();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// Route for user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await Register.findOne({ email });
    if (!exist) {
      return res.status(400).json({ message: "User not found" });
    }

    if (exist.password !== password) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    let payload = {
      user: {
        id: exist.id
      },
    };

    jwt.sign(payload, "venu", (error, token) => {
      if (error) throw error;
      return res.json({ token });
    });

   

  } catch (error) {
    console.error("Error occurred while login user:", error);
    res.status(500).json({ message: "Error occurred while login user" });
  }
});

// Route for user register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = new Register({ name, email, password, confirmpassword });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    res.status(500).json({ message: "Error occurred while registering user" });
  }
});

// Listen for incoming requests
app.listen(port, () => {
  console.log(`Server started at port number ${port}`);
});
