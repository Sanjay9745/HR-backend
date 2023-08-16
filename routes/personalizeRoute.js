const express = require("express");
const router = express.Router();
const {
  culturalRoute,
  salaryComponentRoute,
  integrationWithHrRoute,
  companyProfileRoute,
  workflowRoute,
  exclusionCriteriaRoute,
  supervisorRoute,
  hrReviewSettingsRoute,
  totalRewardsRoute,
  tatRoute,
  terminologyRoute,
  additionMatrixRoute,
} = require("../controllers/personalizeController");
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
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("application/pdf")
  ) {
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

//End point to add the personalize record

router.post("/cultural", authenticateToken, culturalRoute);
router.post("/salary-component", authenticateToken, salaryComponentRoute);
router.post(
  "/integration-with-hr",
  authenticateToken,
  upload.fields([{ name: "integration_image", maxCount: 1 }]),
  integrationWithHrRoute
);
router.post(
  "/company-profile",
  authenticateToken,
  upload.fields([
    { name: "company_signature", maxCount: 1 },
    { name: "company_logo", maxCount: 1 },
    { name: "company_hr_logo", maxCount: 1 },
  ]),
  companyProfileRoute
);
router.post("/workflow", authenticateToken, workflowRoute);
router.post("/exclusion-criteria", authenticateToken, exclusionCriteriaRoute);
router.post(
  "/supervisor",
  authenticateToken,
  upload.fields([
    { name: "load_policy", maxCount: 1 },
    { name: "load_learning_material", maxCount: 1 },
  ]),
  supervisorRoute
);
router.post("/hr-review-settings", authenticateToken, hrReviewSettingsRoute);
router.post("/total-rewards", authenticateToken, totalRewardsRoute);
router.post("/tat", authenticateToken, tatRoute);
router.post("/terminology", authenticateToken, terminologyRoute);
router.post("/addition-matrix", authenticateToken, additionMatrixRoute);

module.exports = router;
