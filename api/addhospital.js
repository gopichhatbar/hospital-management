const express = require("express");
const { Hospital1,Doctor } = require("../models");
const router = express.Router();
const { hospitalValidation } = require("../Validation/user.validation");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // cache 10 minutes


// router.get("/hospitals", async (req, res) => {
//     const hospitals = await Hospital1.findAll();
//     res.json(hospitals);
// });
// router.get("/hospitals", async (req, res) => {
//   try {
//     const hospitals = await Hospital1.findAll();

//     // ✅ Cache for 10 minutes
//     res.set("Cache-Control", "public, max-age=600");
//     res.json(hospitals);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/hospitals", async (req, res) => {
  const cached = cache.get("hospitals");
  if (cached) return res.json(cached);

  try {
    const hospitals = await Hospital1.findAll({
      attributes: ["hospital_id", "hospital_name", "location"],
    });
    cache.set("hospitals", hospitals);
    res.set("Cache-Control", "public, max-age=600");
    res.json(hospitals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// router.get("/hospitals/:hospital_id", async (req, res) => {
//   try {
//     const hospital = await Hospital1.findByPk(req.params.hospital_id);
//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }
//     res.json(hospital);
//     console.log(hospital);

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/hospitals/:hospital_id", async (req, res) => {
//   try {
//     const hospital = await Hospital1.findByPk(req.params.hospital_id);
//     if (!hospital) return res.status(404).json({ message: "Hospital not found" });

//     // ✅ Cache single hospital response
//     res.set("Cache-Control", "public, max-age=600");
//     res.json(hospital);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/hospitals/:hospital_id", async (req, res) => {
  const { hospital_id } = req.params;
  const cached = cache.get(`hospital_${hospital_id}`);
  if (cached) return res.json(cached);

  try {
    const hospital = await Hospital1.findByPk(hospital_id, {
      attributes: ["hospital_id", "hospital_name", "location"],
    });
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    cache.set(`hospital_${hospital_id}`, hospital);
    res.set("Cache-Control", "public, max-age=600");
    res.json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/hospitals", hospitalValidation, async (req, res) => {
  const { hospital_name, location } = req.body;
  const hospital = await Hospital1.create({ hospital_name, location });
  res.json(hospital);
});

router.delete("/:hospital_id", async (req, res) => {
  const { hospital_id } = req.params;

  try {
    // Find hospital
    const hospital = await Hospital1.findByPk(hospital_id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Fetch doctors linked to hospital
    const doctors = await Doctor.findAll({ where: { hospital_id } });

    // Delete doctor images from /uploads/
    doctors.forEach((doc) => {
      if (doc.image) {
        const imagePath = path.join(__dirname, "..", doc.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    // Destroy doctors
    await Doctor.destroy({
      where: { hospital_id },
    });

    // Finally delete hospital
    await hospital.destroy();

    return res.json({
      message: "Hospital, its doctors, and all related data deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting hospital:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
