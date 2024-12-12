const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: false
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livein : String,
    workAt: String,
    country : String,
    relationship: String,
    followers: [],
    following: [],
    token: {
        type: String, // Store the JWT token
        default: null,
      }
},{timestamps:true});
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;