const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Register } = require("./Model");
const jwt = require("jsonwebtoken");
// const middleware = require("./middleware");
const bcrypt = require("bcryptjs");

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

    
    if (!exist || !await bcrypt.compare(password , exist.password)) {
      return res.status(400).json({ message: "User not found" });
    }

    
 
   const token =  jwt.sign({tokenId : exist._id}, "venu");

    res.status(200).json({exist , token})

  } catch (error) {
    console.error("Error occurred while login user:", error);
    res.status(500).json({ message: "Error occurred while login user" });
  }
});

// Route for user register
app.post("/register", async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;

    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirmPassword = await bcrypt.hash(confirmpassword, 10);

    const newUser = new Register({
      email,
      password: hashedPassword,
      confirmpassword: hashedConfirmPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    res.status(500).json({ message: "Error occurred while registering user" });
  }
});

// get profile route

// app.get("/profile", middleware, async (req, res) => {
//   try {
//     let exist = await Register.findById(req.user.id);
//     if (!exist) {
//       return res.status(400).send("user not found");
//     }
//     res.json(exist);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("server error");
//   }
// });

// Listen for incoming requests
app.listen(port, () => {
  console.log(`Server started at port number ${port}`);
});
