const mongoose = require("mongoose");
 

// register schema

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

  

  module.exports = {
    Register,
    Login
  }
  