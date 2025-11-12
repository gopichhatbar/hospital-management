const express = require("express");
const {Hospital1} = require("../models");
const router = express.Router();
const {hospitalValidation} = require("../Validation/user.validation");


router.get("/hospitals", async (req, res) => {
    const hospitals = await Hospital1.findAll();
    res.json(hospitals);
});

router.get("/hospitals/:hospital_id", async (req, res) => {
  try {
    const hospital = await Hospital1.findByPk(req.params.hospital_id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(hospital);
    console.log(hospital);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/hospitals",hospitalValidation,async (req, res) => {
    const { hospital_name, location } = req.body;
    const hospital = await Hospital1.create({ hospital_name, location });
    res.json(hospital);
  });

module.exports = router;
