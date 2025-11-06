const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

// Database connection
require("./config/database");

// Routes
const addhospital = require("./api/addhospital");
const addDoctor = require("./api/addDoctor");
const authenticate = require("./api/authentication");
const emailRoutes = require("./api/appointment");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.send("Node.js Backend is Running!"));
app.use("/addhospital", addhospital);
app.use("/", addDoctor);
app.use("/authenticate", authenticate);
app.use("/mailsent", emailRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
