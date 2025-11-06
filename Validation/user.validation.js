const { doctorschema, hospitalschema, RegisterSchema, LoginSchema, appointmntschema } = require("../Validation/user.schema");


module.exports = {
    doctorvalidation: async (req, res, next) => {
        try {
            console.log("🟢 Validating Request Data:", req.body); // Log the received request body
            if (typeof req.body.availability === "string") {
                req.body.availability = JSON.parse(req.body.availability);
            }
            await doctorschema.validateAsync(req.body, { abortEarly: false }); // Capture all errors
            next();
        } catch (error) {
            console.error("❌ Validation Failed:", error.details.map(err => err.message)); // Log errors
            return res.status(400).json({
                success: false,
                errors: error.details.map(err => err.message),
            });
        }
    },

    hospitalValidation: async (req, res, next) => {
        try {
            // Validate params
            await hospitalschema.validateAsync(req.body);

            // Validate body
            //   await visitSchema.validateAsync(req.body);

            next();
        } catch (error) {
            console.error("❌ Validation Error:", error.details ? error.details.map(err => err.message) : error.message);
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message],
            });
        }
    },

    Registervalidation: async (req, res, next) => {
        try {
            await RegisterSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
    Loginvalidation: async (req, res, next) => {
        try {
            await LoginSchema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
    appointmntvalidation: async (req, res, next) => {
        try {
            await appointmntschema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                errors: error.details ? error.details.map(err => err.message) : [error.message], // ✅ Check if details exist
            });
        }

    },
}