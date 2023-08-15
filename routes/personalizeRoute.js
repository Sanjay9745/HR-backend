const express = require("express");
const router = express.Router();
const Personalize = require("../models/personalizeModel");
const authenticateToken = require("../middleware/auth");
const multer = require('multer'); // Import Multer

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination folder here
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // Get current timestamp
    const originalname = file.originalname; // Original filename
    const extension = originalname.split('.').pop(); // Get the file extension
    const uniqueFilename = `${timestamp}.${extension}`; // Generate a unique filename
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage });
//Post request to create a new personalize record

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
  


  router.post("/company-profile", authenticateToken,upload.fields([
    { name: 'company_signature', maxCount: 1 },
    { name: 'company_logo', maxCount: 1 },
    { name: 'company_hr_logo', maxCount: 1 }
  ]), async (req, res) => {
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
        company_approver_replay_email
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
      const companySignatureFile = req.files['company_signature'][0];
      const companyLogoFile = req.files['company_logo'][0];
      const companyHrLogoFile = req.files['company_hr_logo'] ? req.files['company_hr_logo'][0] : null;
  
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
            data: companySignatureFile.buffer
          },
          company_logo: {
            filename: companyLogoFile.originalname,
            contentType: companyLogoFile.mimetype,
            data: companyLogoFile.buffer
          },
          company_hr_logo: companyHrLogoFile
            ? {
                filename: companyHrLogoFile.originalname,
                contentType: companyHrLogoFile.mimetype,
                data: companyHrLogoFile.buffer
              }
            : null
        },
        { new: true, upsert: true }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
  
module.exports = router;
