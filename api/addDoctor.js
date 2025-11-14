const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { Doctor } = require("../models");
import { CloudinaryStorage } from "multer-storage-cloudinary";
const { doctorvalidation } = require("../Validation/user.validation");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 600 }); // cache data for 10 minutes

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

module.exports = { cloudinary };

// ------------------- Multer Setup -------------------
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });



router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// ------------------- GET: Fetch doctors by hospital_id -------------------
router.get("/doctors/:hospital_id", async (req, res) => {
  try {
    const hospitalId = Number(req.params.hospital_id);
    if (isNaN(hospitalId)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const cacheKey = `doctors_${hospitalId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`✅ Serving doctors for hospital ${hospitalId} from cache`);
      res.set("Cache-Control", "public, max-age=600");
      return res.status(200).json({ doctors: cachedData });
    }

    console.log(`🔄 Fetching doctors for hospital ${hospitalId} from DB...`);

    const doctors = await Doctor.findAll({
      where: { hospital_id: hospitalId },
      attributes: [
        "doctor_id",
        "doctor_name",
        "doctor_email",
        "specialty",
        "image",
        "availability",
      ],
      order: [["doctor_name", "ASC"]],
    });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this hospital" });
    }

    const formattedDoctors = doctors.map((doc) => ({
      doctor_id: doc.doctor_id, 
      doctor_name: doc.doctor_name,
      doctor_email: doc.doctor_email,
      specialty: doc.specialty,
      image: doc.image
        ? `${process.env.BASE_URL || "https://hospital-management-0b6s.onrender.com"}${doc.image}`
        : null,
      availability: Array.isArray(doc.availability)
        ? doc.availability
        : (() => {
            try {
              return JSON.parse(doc.availability || "[]");
            } catch {
              return [];
            }
          })(),
    }));

    // Cache the result
    cache.set(cacheKey, formattedDoctors);
    console.log(`💾 Cached doctors for hospital ${hospitalId}`);

    res.set("Cache-Control", "public, max-age=600");
    return res.status(200).json({ doctors: formattedDoctors });
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ------------------- POST: Add new doctor -------------------
router.post("/adddoctor", upload.single("image"), doctorvalidation, async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    let { doctor_name, doctor_email, specialty, availability, hospital_id } = req.body;

    if (!doctor_email) {
      return res.status(400).json({ message: "Doctor email is required." });
    }

    hospital_id = parseInt(hospital_id, 10);
    if (isNaN(hospital_id)) {
      return res.status(400).json({ message: "Invalid hospital_id. Must be an integer." });
    }

    // Ensure email is unique
    const existingDoctor = await Doctor.findOne({ where: { doctor_email } });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor email already exists." });
    }

    // Parse availability safely
    let parsedAvailability = [];
    try {
      if (typeof availability === "string") {
        parsedAvailability = JSON.parse(availability);
      } else if (Array.isArray(availability)) {
        parsedAvailability = availability;
      } else {
        throw new Error("Invalid availability format");
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid availability format." });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newDoctor = await Doctor.create({
      doctor_name,
      doctor_email,
      specialty,
      image: imagePath,
      availability: parsedAvailability,
      hospital_id,
    });

    // ✅ Invalidate cache for this hospital (so it refreshes next time)
    const cacheKey = `doctors_${hospital_id}`;
    cache.del(cacheKey);
    console.log(`🧹 Cleared cache for hospital ${hospital_id}`);

    res.status(201).json({ message: "Doctor added successfully!", doctor: newDoctor });
  } catch (error) {
    console.error("❌ Error adding doctor:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();
// const { Doctor } = require("../models");
// const { doctorvalidation } = require("../Validation/user.validation");
// const NodeCache = require("node-cache");
// const cache = new NodeCache({ stdTTL: 600 }); 


// const storage = multer.diskStorage({
//     destination: "./uploads/", // Ensure this folder exists
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage });
// router.use(express.urlencoded({ extended: true }));
// router.use(express.json());

// //  Configure Multer for Image Upload
// // router.get("/doctors/:hospital_id", async (req, res) => {
// //     // console.log("fetched doctor",req.body);

// //     try {
// //         const hospitalId = req.params.hospital_id;
// //         console.log("Fetching doctors for hospital:", hospitalId);

// //         // ✅ Check if hospitalId is valid
// //         if (isNaN(hospitalId)) {
// //             return res.status(400).json({ message: "Invalid hospital ID" });
// //         }

// //         const doctors = await Doctor.findAll({ where: { hospital_id: hospitalId } });
// //         console.log("dusgfu", doctors);

// //         if (doctors.length === 0) {
// //             return res.status(404).json({ message: "No doctors found for this hospital" });
// //         }

// //         res.json({ doctors });
// //     } catch (error) {
// //         console.error("Error fetching doctors:", error);
// //         res.status(500).json({ message: "Server error" });
// //     }
// // });

// router.get("/doctors/:hospital_id", async (req, res) => {
//   try {
//     const hospitalId = Number(req.params.hospital_id);

//     // ✅ Validate hospital ID
//     if (isNaN(hospitalId)) {
//       return res.status(400).json({ message: "Invalid hospital ID" });
//     }

//     // ✅ Check cache first
//     const cacheKey = `doctors_${hospitalId}`;
//     const cachedData = cache.get(cacheKey);
//     if (cachedData) {
//       console.log(`✅ Serving doctors for hospital ${hospitalId} from cache`);
//       res.set("Cache-Control", "public, max-age=600");
//       return res.status(200).json({ doctors: cachedData });
//     }

//     console.log(`🔄 Fetching doctors for hospital ${hospitalId} from DB...`);

//     // ✅ Fetch only required fields (for speed)
//     const doctors = await Doctor.findAll({
//       where: { hospital_id: hospitalId },
//       attributes: [
//         "doctor_id",
//         "doctor_name",
//         "doctor_email",
//         "specialty",
//         "image",
//         "availability"
//       ],
//       order: [["doctor_name", "ASC"]],
//     });

//     if (!doctors || doctors.length === 0) {
//       return res.status(404).json({ message: "No doctors found for this hospital" });
//     }

//     // ✅ Format response
//     const formattedDoctors = doctors.map((doc) => ({
//       doctor_id: doc.doctor_id,
//       doctor_name: doc.doctor_name,
//       doctor_email: doc.doctor_email,
//       specialty: doc.specialty,
//       image: doc.image
//         ? `${process.env.BASE_URL || "https://hospital-management-0b6s.onrender.com"}${doc.image}`
//         : null,
//       availability: Array.isArray(doc.availability)
//         ? doc.availability
//         : (() => {
//             try {
//               return JSON.parse(doc.availability || "[]");
//             } catch {
//               return [];
//             }
//           })(),
//     }));

//     // ✅ Store in cache
//     cache.set(cacheKey, formattedDoctors);
//     console.log(`💾 Cached doctors for hospital ${hospitalId}`);

//     // ✅ Set client-side cache headers too
//     res.set("Cache-Control", "public, max-age=600");

//     return res.status(200).json({ doctors: formattedDoctors });
//   } catch (error) {
//     console.error("❌ Error fetching doctors:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// router.post("/adddoctor", upload.single("image"), doctorvalidation, async (req, res) => {
//     try {
//         console.log("Received Dataaa:", req.body);

//         let { doctor_name, doctor_email, specialty, availability, hospital_id } = req.body;

//         if (!doctor_email) {
//             return res.status(400).json({ message: "Doctor email is required." });
//         }

//         hospital_id = parseInt(hospital_id, 10);
//         if (isNaN(hospital_id)) {
//             return res.status(400).json({ message: "Invalid hospital_id. Must be an integer." });
//         }

//         // Ensure email uniqueness
//         const existingDoctor = await Doctor.findOne({ where: { doctor_email } });
//         if (existingDoctor) {
//             return res.status(400).json({ message: "Doctor email already exists." });
//         }

//         // Parse availability safely
//         let parsedAvailability = [];
//         console.log(" availability from frontend:", availability);
//         console.log(" Type of availability:", typeof availability);

//         try {
//             if (typeof availability === "string") {
//                 console.log(" Attempting to parse availability...");
//                 parsedAvailability = JSON.parse(availability);
//                 console.log(" Successfully parsed availability:", parsedAvailability);
//             } else if (Array.isArray(availability)) {
//                 console.log(" Availability is already an array.");
//                 parsedAvailability = availability;
//             } else {
//                 console.error(" Unexpected availability format:", availability);
//                 throw new Error("Invalid format");
//             }
//         } catch (error) {
//             console.error(" JSON parsing error:", error.message);
//             return res.status(400).json({ message: "Invalid availability format." });
//         }



//         if (!Array.isArray(parsedAvailability) || parsedAvailability.length === 0) {
//             return res.status(400).json({ message: "Availability must be a valid array." });
//         }

//         // Handle image upload
//         const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//         const newDoctor = await Doctor.create({
//             doctor_name,
//             doctor_email,
//             specialty,
//             image: imagePath,
//             availability: parsedAvailability,
//             hospital_id,
//         });

//         res.status(201).json({ message: "Doctor added successfully!", doctor: newDoctor });
//     } catch (error) {
//         console.error("Error adding doctor:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


// module.exports = router;
