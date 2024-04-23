const mongoose = require("mongoose");

// register schema

const registerSchema = new mongoose.Schema({
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

//  profile details schema

const profileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone : {
    type : Number,
    required : true
  },
  address : {
    type : String,
    required : true
  }
  
});



const profile = mongoose.model("Profile" , profileSchema)

module.exports = {
  Register,
  profile
};
