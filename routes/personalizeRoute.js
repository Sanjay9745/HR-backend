const express = require("express");
const router = express.Router();
const Personalize = require("../models/personalizeModel");
const authenticateToken = require("../middleware/auth");
const multer = require("multer"); // Import Multer

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalname = file.originalname;
    const extension = originalname.split(".").pop();
    const uniqueFilename = `${timestamp}.${extension}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Maximum file size: 20MB
  },
  fileFilter: fileFilter,
});



//cultural
router.post("/cultural", authenticateToken, async (req, res) => {
  try {
    const {
      country,
      number,
      currency,
      percentage,
      date_format,
      timezone,
      percentage_round,
      number_round,
      currency_round,
    } = req.body;

    // Validate required fields
    if (
      !country ||
      !number ||
      !currency ||
      !percentage ||
      !date_format ||
      !timezone ||
      !percentage_round ||
      !number_round ||
      !currency_round
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const userId = req.user._id;

    // Update or create the Personalize record
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        country,
        number,
        currency,
        percentage,
        date_format,
        timezone,
        percentage_round,
        number_round,
        currency_round,
      },
      { new: true, upsert: true }
    );

    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//salary component
router.post("/salary-component", authenticateToken, async (req, res) => {
  try {
    const { salary_component, merit_applied_on } = req.body;
    const userId = req.user._id;

    // Check if the required fields are not null
    if (!salary_component || !merit_applied_on) {
      return res.status(400).json({ error: "salary_component and merit_applied_on are required fields." });
    }

    // Create or update the Personalize record
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        salary_component,
        merit_applied_on,
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//integration with hr
router.post("/integration-with-hr", authenticateToken, upload.fields([
  { name: "integration_image", maxCount: 1 },
]), async (req, res) => {
  try {
    const { integration_with_hr } = req.body;
    const IntegrationWithHRFile = req.files["integration_image"][0];
    const userId = req.user._id;

    // Check if the integration_with_hr field is not null
    if (!integration_with_hr) {
      return res.status(400).json({ error: "integration_with_hr is a required field." });
    }

    // Assuming that you have a Personalize schema
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        integration_with_hr,
        // Assuming you want to store the image URL in the personalizeRecord
        integration_image: IntegrationWithHRFile ? IntegrationWithHRFile : null,
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});



//company profile
router.post(
  "/company-profile",
  authenticateToken,
  upload.fields([
    { name: "company_signature", maxCount: 1 },
    { name: "company_logo", maxCount: 1 },
    { name: "company_hr_logo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        company_name,
        company_address,
        company_industry,
        company_phone,
        company_email,
        company_profile,
        company_approver_name,
        company_approver_email,
        company_approver_replay_email,
      } = req.body;

      // Validate required fields
      if (
        !company_name ||
        !company_address ||
        !company_industry ||
        !company_phone ||
        !company_email ||
        !company_profile ||
        !company_approver_name ||
        !company_approver_email ||
        !company_approver_replay_email
      ) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields." });
      }

      const userId = req.user._id;

      // Get file details from Multer
      const companySignatureFile = req.files["company_signature"][0];
      const companyLogoFile = req.files["company_logo"][0];
      const companyHrLogoFile = req.files["company_hr_logo"]
        ? req.files["company_hr_logo"][0]
        : null;

      // Create or update the Personalize record
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          company_name,
          company_address,
          company_industry,
          company_phone,
          company_email,
          company_profile,
          company_approver_name,
          company_approver_email,
          company_approver_replay_email,
          company_signature: {
            filename: companySignatureFile.originalname,
            contentType: companySignatureFile.mimetype,
            data: companySignatureFile.buffer,
          },
          company_logo: {
            filename: companyLogoFile.originalname,
            contentType: companyLogoFile.mimetype,
            data: companyLogoFile.buffer,
          },
          company_hr_logo: companyHrLogoFile
            ? {
                filename: companyHrLogoFile.originalname,
                contentType: companyHrLogoFile.mimetype,
                data: companyHrLogoFile.buffer,
              }
            : null,
        },
        { new: true, upsert: true }
      );

      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);
//workflow

module.exports = router;
