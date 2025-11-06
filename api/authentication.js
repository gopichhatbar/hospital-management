const express = require("express");
// const {Registervalidation,Loginvalidation} = require("../validation/user.validation");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { user_Register } = require("../models");
const bcrypt = require("bcrypt");

const router = express.Router();
const {Registervalidation} = require("../Validation/user.validation");

const SECRET_KEY = "JWT_SECRET"; // Replace with env variable

// 🔹 Register Route
router.post("/register",Registervalidation,async (req, res) => {
  try {
    const { user_name,user_number,user_email, user_password } = req.body;

    var user = await user_Register.findOne({ where: { user_email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    user = await user_Register.create({ user_name, user_number,user_email, user_password: hashedPassword });

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const user = await user_Register.findOne({ where: { user_email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.login_id }, SECRET_KEY, { expiresIn: "5h" });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Protected Route
// router.get("/profile", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.login_id, { attributes: [ "name","number","email","password"] });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
}

module.exports = router;
