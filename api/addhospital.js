const express = require("express");
const {Hospital1} = require("../models");
const router = express.Router();
const {hospitalValidation} = require("../Validation/user.validation");


router.get("/hospitals", async (req, res) => {
    const hospitals = await Hospital1.findAll();
    res.json(hospitals);
});

router.post("/hospitals",hospitalValidation,async (req, res) => {
    const { hospital_name, location } = req.body;
    const hospital = await Hospital1.create({ hospital_name, location });
    res.json(hospital);
  });

module.exports = router;
