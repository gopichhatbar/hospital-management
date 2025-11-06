const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { Doctor } = require("../models");
const { doctorvalidation } = require("../Validation/user.validation");


const storage = multer.diskStorage({
    destination: "./uploads/", // Ensure this folder exists
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//  Configure Multer for Image Upload
router.get("/doctors/:hospital_id", async (req, res) => {
    // console.log("fetched doctor",req.body);

    try {
        const hospitalId = req.params.hospital_id;
        console.log("Fetching doctors for hospital:", hospitalId);

        // ✅ Check if hospitalId is valid
        if (isNaN(hospitalId)) {
            return res.status(400).json({ message: "Invalid hospital ID" });
        }

        const doctors = await Doctor.findAll({ where: { hospital_id: hospitalId } });
        console.log("dusgfu", doctors);

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found for this hospital" });
        }

        res.json({ doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/adddoctor", upload.single("image"), doctorvalidation, async (req, res) => {
    try {
        console.log("Received Dataaa:", req.body);

        let { doctor_name, doctor_email, specialty, availability, hospital_id } = req.body;

        if (!doctor_email) {
            return res.status(400).json({ message: "Doctor email is required." });
        }

        hospital_id = parseInt(hospital_id, 10);
        if (isNaN(hospital_id)) {
            return res.status(400).json({ message: "Invalid hospital_id. Must be an integer." });
        }

        // Ensure email uniqueness
        const existingDoctor = await Doctor.findOne({ where: { doctor_email } });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor email already exists." });
        }

        // Parse availability safely
        let parsedAvailability = [];
        console.log(" availability from frontend:", availability);
        console.log(" Type of availability:", typeof availability);

        try {
            if (typeof availability === "string") {
                console.log(" Attempting to parse availability...");
                parsedAvailability = JSON.parse(availability);
                console.log(" Successfully parsed availability:", parsedAvailability);
            } else if (Array.isArray(availability)) {
                console.log(" Availability is already an array.");
                parsedAvailability = availability;
            } else {
                console.error(" Unexpected availability format:", availability);
                throw new Error("Invalid format");
            }
        } catch (error) {
            console.error(" JSON parsing error:", error.message);
            return res.status(400).json({ message: "Invalid availability format." });
        }



        if (!Array.isArray(parsedAvailability) || parsedAvailability.length === 0) {
            return res.status(400).json({ message: "Availability must be a valid array." });
        }

        // Handle image upload
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newDoctor = await Doctor.create({
            doctor_name,
            doctor_email,
            specialty,
            image: imagePath,
            availability: parsedAvailability,
            hospital_id,
        });

        res.status(201).json({ message: "Doctor added successfully!", doctor: newDoctor });
    } catch (error) {
        console.error("Error adding doctor:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
