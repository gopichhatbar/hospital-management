const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const axios = require("axios");



// Database connection
require("./config/database");

// Routes
const addhospital = require("./api/addhospital");
const addDoctor = require("./api/addDoctor");
const authenticate = require("./api/authentication");
const emailRoutes = require("./api/appointment");

const app = express();
app.use(helmet());          // adds secure HTTP headers
app.use(compression());

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});
// Routes
app.get("/", (req, res) => res.send("Node.js Backend is Running!"));
app.use("/addhospital", addhospital);
app.use("/", addDoctor);
app.use("/authenticate", authenticate);
app.use("/mailsent", emailRoutes);
app.get("/sitemap.xml", async (req, res) => {
  try {
    // Fetch all hospitals
    const { data: hospitals } = await axios.get(
      "https://hospital-management-0b6s.onrender.com/addhospital/hospitals"
    );

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static URLs
    sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/</loc><priority>1.0</priority></url>\n`;
    sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/userRegister</loc><priority>0.8</priority></url>\n`;
    sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/userLogin</loc><priority>0.8</priority></url>\n`;

    // Dynamic Hospital Pages
    hospitals.forEach((hospital) => {
      sitemap += `
  <url>
    <loc>https://mellifluous-pudding-185a54.netlify.app/hospital/${hospital.hospital_id}</loc>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>\n`;
    });

    sitemap += `</urlset>`;

    // VERY IMPORTANT: Proper header
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap Error:", error);
    res.status(500).send("Error generating sitemap");
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
