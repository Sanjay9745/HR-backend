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
  userCreationRoute,
  userDeleteRoute,
  userUpdateRoute,
  userReadingRoute,
  performanceRoute,
  historyDataRoute,
  getHistoryDataRoute,
  getAllDataRoute,
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
    file.mimetype.startsWith("application/pdf") ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // XLSX
    file.mimetype === "text/csv" // CSV
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
router.post("/performance", authenticateToken, performanceRoute); 
router.post("/terminology", authenticateToken, terminologyRoute);
router.post("/addition-matrix", authenticateToken, additionMatrixRoute);
router.post("/history-data", authenticateToken, upload.fields([{ name: "excel_file", maxCount: 1 }]), historyDataRoute);
router.get("/history-data", authenticateToken, getHistoryDataRoute);

//user creation
router.post("/user-creation", authenticateToken, userCreationRoute);
router.get("/user-reading", authenticateToken, userReadingRoute)
router.post("/user-editing", authenticateToken, userUpdateRoute);
router.post("/user-deletion", authenticateToken, userDeleteRoute);
//End point to get the personalize record

router.get("/getAllData", authenticateToken, getAllDataRoute);

module.exports = router;
