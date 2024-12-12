const express = require("express");
const {registerUser} = require("../Controller/AuthController")
const {loginUser} = require("../Controller/AuthController")

const router = express.Router();

// console.log("---------registeruser", registerUser);

router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;