const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");


require("./config/database")
const addhospital = require("./api/addhospital")
const addDoctor = require("./api/addDoctor")
const authenticate = require("./api/authentication")
const emailRoutes = require('./api/appointment'); // path to the file above



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Increase JSON limit
app.use(express.urlencoded({  extended: true })); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});
app.use("/addhospital",addhospital);
app.use("/",addDoctor);
app.use("/authenticate",authenticate);
app.use("/mailsent",emailRoutes)



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
