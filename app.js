const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");

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

// User schema
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
});

const Register = mongoose.model("Register", registerSchema);

// Login schema
const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Login = mongoose.model("Login", loginSchema);

// Export both models
module.exports = {
  Register,
  Login
};

// Route for user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await Register.findOne({ email });
    if (!exist) {
      return res.status(400).json({ message: "User not found" });
    }

    // const passwordMatch = await bcrypt.compare(password, exist.password);

    if (exist.password !== password) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    res.status(200).json(exist);
  } catch (error) {
    console.error("Error occurred while login user:", error);
    res.status(500).json({ message: "Error occurred while login user" });
  }
});

// Route for user registration
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    // Check if user already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate password match
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Register({ name, email, password, confirmpassword });

    // Save the user to the database
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
