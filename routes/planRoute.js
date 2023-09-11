const express = require("express");
const router = express.Router();
const Plan = require("../models/planModel");
const authenticateToken = require("../middleware/auth");
const multer = require("multer"); // Import Multer
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const {sendBulkMail} = require("../controllers/emailController");
const Personalize = require("../models/personalizeModel");
// Configure Multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//       const timestamp = Date.now();
//       const originalname = file.originalname;
//       const extension = originalname.split(".").pop();
//       const uniqueFilename = `${timestamp}.${extension}`;
//       cb(null, uniqueFilename);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     if (
//       file.mimetype.startsWith("image/") ||
//       file.mimetype.startsWith("application/pdf") ||
//       file.mimetype ===
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // XLSX
//       file.mimetype === "text/csv" // CSV
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Unsupported file type"), false);
//     }
//   };
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 20 * 1024 * 1024, // Maximum file size: 20MB
//     },
//     fileFilter: fileFilter,
//   });

//bulk mail
router.get("/send-mail", async (req, res) => {
  const recipients = ['sanjaysanthosh919@gmail.com', 'santhoshkvsanjay@example.com',"allissmallmalayalam@gmail.com"];
  const subject = 'Your Email Subject';
  const text = 'Your plain text email content';
  const html = '<p>Your HTML email content</p>';
  
  sendBulkMail(recipients, subject, text, html)
    .then((results) => {
      console.log('Emails sent:', results);
    })
    .catch((error) => {
      console.error('Error sending emails:', error);
    });
})



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get("/", authenticateToken, async (req, res) => {
  try {
    const plan = await Plan.findOne({ user_id: req.user._id });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while getting the plan.",
    });
  }
});



router.post("/", authenticateToken, async (req, res) => {
  try {
    const planData = {
      user_id: req.user._id,
      cycle_type: req.body.cycle_type,
      cycle_from: req.body.cycle_from,
      cycle_to: req.body.cycle_to,
      eligibility_type: req.body.eligibility_type,
      eligibility_date: req.body.eligibility_date,
      eligibility_percentage: req.body.eligibility_percentage,
      salary_component: req.body.salary_component,
      salary_component_list: req.body.salary_component_list,
      global_currency: req.body.global_currency,
      global_currency_list: req.body.global_currency_list,
      prorate: req.body.prorate,
      prorate_unit: req.body.prorate_unit,
      off_cycle_prorate: req.body.off_cycle_prorate,
      off_cycle_prorate_unit: req.body.off_cycle_prorate_unit,
      parity: req.body.parity,
      merit_guidline: req.body.merit_guidline,
      supervisor_validation: req.body.supervisor_validation,
      split_recommendation: req.body.split_recommendation,
      calculation_split_recommendation:
        req.body.calculation_split_recommendation,
      matrix_recommendation: req.body.matrix_recommendation,
      calculation_matrix_recommendation:
        req.body.calculation_matrix_recommendation,
      paygroups: req.body.paygroups,
      paygroups_name: req.body.paygroups_name,
      enable_recommendation: req.body.enable_recommendation,
      pay_range_min: req.body.pay_range_min,
      pay_range_max: req.body.pay_range_max,
      enable_bonus_incentives: req.body.enable_bonus_incentives,
      use_diff_bonus_incentives: req.body.use_diff_bonus_incentives,
      basis_of_bonus: req.body.basis_of_bonus,
      bonus_list: req.body.bonus_list,
      merit_group_list: req.body.merit_group_list,
      bonus_group_list: req.body.bonus_group_list,
      budget_value: req.body.budget_value,
      budget_unit: req.body.budget_unit,
      hold_back: req.body.hold_back,
      hold_back_value: req.body.hold_back_value,
      hold_back_unit: req.body.hold_back_unit,
      statutory_increment: req.body.statutory_increment,
      employee_group: req.body.employee_group,
      increment_value: req.body.increment_value,
      increment_unit: req.body.increment_unit,
    };

    const plan = new Plan(planData);

    const result = await plan.save();

    res.status(201).json({
      message: "Plan created successfully!",
      result: result,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      error: "An error occurred while creating the plan.",
    });
  }
});

router.post("/time-based-bonus", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    let updatedPlan = await Plan.findOneAndUpdate(
      { user_id: userId },
      {
        time_based_bonus: {
          name: req.body.name,
          eligibility_data: req.body.eligibility_data,
          bonus_based_on: req.body.bonus_based_on,
          bonus_percentage: req.body.bonus_percentage,
          manager_recommendation: req.body.manager_recommendation,
          manager_recommendation_percentage:
            req.body.manager_recommendation_percentage,
          bonus_guideline_percentage: req.body.bonus_guideline_percentage,
          pro_rate_bonus: req.body.pro_rate_bonus,
          pro_rate_bonus_unit: req.body.pro_rate_bonus_unit,
        },
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.json(updatedPlan); // Send the updated Plan object as the response
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      error: "An error occurred while creating the plan.",
    });
  }
});

router.post("/performance-bonus", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have a way to get the userId
    const performanceBonusData = {
      name: req.body.name,
      eligibility_data: req.body.eligibility_data,
      bonus_based_on_salary: req.body.bonus_based_on_salary || false,
      bonus_percentage: req.body.bonus_percentage,
      performance_rating: req.body.performance_rating || false,
      name_of_bonus_factor: req.body.name_of_bonus_factor,
      bonus_table: req.body.bonus_table,
      bonus_multiplier: req.body.bonus_multiplier || false,
      org_bonus_multiplier: req.body.org_bonus_multiplier,
      team_score: req.body.team_score,
      manager_recommendation: req.body.manager_recommendation || false,
      manager_recommendation_percentage:
        req.body.manager_recommendation_percentage,
      bonus_guideline_percentage: req.body.bonus_guideline_percentage,
      pro_rate_bonus: req.body.pro_rate_bonus || false,
      pro_rate_bonus_unit: req.body.pro_rate_bonus_unit,
    };

    const updatedPlan = await Plan.findOneAndUpdate(
      { user_id: userId },
      { $set: { performance_bonus: performanceBonusData } },
      { new: true, upsert: true, useFindAndModify: false }
    );

    res.json(updatedPlan);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      error: "An error occurred while updating the performance bonus.",
    });
  }
});

router.post(
  "/template-file",
  authenticateToken,
  upload.single("template_file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      const buffer = req.file.buffer;
      const workbook = XLSX.read(buffer, { type: "buffer" });

      // Assuming the data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to an array of objects
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Extract the fields dynamically from the first row
      const fields = Object.keys(jsonData[0]);

      // Create an array of objects with dynamic fields and values
      const dataArray = jsonData.map((row) => {
        const dataObject = {};
        fields.forEach((field) => {
          dataObject[field] = row[field];
        });
        return dataObject;
      });

      const userId = req.user._id; // Assuming you have a way to get the userId from authentication

      const updatedPlan = await Plan.findOneAndUpdate(
        { user_id: userId },
        {
          $set: {
            template_file_data: dataArray,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );

      res.status(200).json(updatedPlan);
      // Send the array of objects as the response
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({
        error: "An error occurred while processing the template file.",
      });
    }
  }
);

router.get("/template-file", authenticateToken, async (req, res) => {
  try {
    // Path to the XLSX template file
    const templateFilePath = path.join(__dirname, "../docs/template.xlsx");

    // Set the appropriate headers for downloading the XLSX file
    res.setHeader("Content-Disposition", "attachment; filename=template.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ); // XLSX content type

    // Stream the XLSX file content to the response
    const fileStream = fs.createReadStream(templateFilePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error sending XLSX template file:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//download pdf

router.get('/download-pdf',authenticateToken, async (req,res)=>{
   // Launch a headless Chrome browser
   const userId = req.user._id;
   const personalize = await Personalize.findOne({user_id:userId})
   const plan = await Plan.findOne({user_id:userId})
  console.log(personalize,plan);
   const browser = await puppeteer.launch();

   // Create a new page
   const page = await browser.newPage();

   // Set the HTML content for the PDF
   const htmlContent = `
   <html>
   <head>
     <title>Document</title>
   </head>
   <body style="margin:20px;">
 
     <h2 style="color:grey;margin-top:50px;font-family: Tahoma;">Merit Compensation 2021-22</h2>
     <hr />
     <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Culture setting</h3>
     <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Base currency</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin: 0;">${personalize.cultural.currency}</p>
     <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin-bottom: 5px;">Date format</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin: 0;margin-bottom: 5px;">${personalize.cultural.date_format}</p>
     <h4 style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Time Zone</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;">${personalize.cultural.timezone}</p>
     <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Rounding rules</h3>
     <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Number</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${personalize.cultural.number_round}</p>
     <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Percentage</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;">${personalize.cultural.percentage_round}</p>
     <!-- <p ><span>Merit</span> <span>Promotion</span> <span>Bonus</span></p> -->
     <h4 style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Currency</h4>
     <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;">${personalize.cultural.currency_round}</p>
 
         <hr>
         <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;" >Multi currency</h3>
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Multi currency</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;">${personalize.salary.salary_component === true ? 'yes':'no'}</p>
 
         <hr>
 
         <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Merit cycle & Eligibility</h3>
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Merit type</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.cycle_type}</p>
 
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">From Period</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.cycle_from}</p>
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">To Period</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.cycle_to}</p>
 
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Eligibility</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">Joined ${plan.eligibility_date}</p>
 
         <hr>
 
         <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Pro-rata increment to service</h3>
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Pro-rata increment to service</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.prorate === true ? 'yes':'no'}</p>
 
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Pro-rata increment to service Unit</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.off_cycle_prorate_unit}</p>
         <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Pro-rata increment to service</h3>
         <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Pro-rata off cycle increment to service</h4>
         <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.off_cycle_prorate=== true ? 'yes':'no'}</p>
 
        <hr>
 
        
        <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Split Appraisal & matrix manager</h3>
        <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Enable split appraisals
       </h4>
        <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.split_recommendation=== true ? 'yes':'no'}</p>
 
        <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Enable matrix recommendations</h4>
        <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.matrix_recommendation=== true ? 'yes':'no'}</p>
       <hr>
        
       <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Pay Groups</h3>
       <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Diffrent merit rule for different employee groups
      </h4>
       <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.paygroups === true ? 'yes':'no'}</p>
 
      <hr>
 
      
      <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Parity Measure</h3>
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Preferred parity measure</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.parity}</p>
      <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Merit Guidelines</h3>
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Enable merit guidelines</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.enable_recommendation === true ? 'yes':'no'}</p>
     
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Validation for supervisor Recommendation</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">Recommendation is allowed within the guidelines only</p>
 
      <hr>
      <h3  style="color:dodgerblue;margin-top:20px;font-family: Tahoma;">Lump Sum</h3>
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Employee salary goes above the pay range max</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">Ignore range min, and provide increment on current salary</p>
      <h3  style="color:dodgerblue;margin-top:100px;font-family: Tahoma;padding-top:30px;">Corrections</h3>
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">When employee salary is below the pay range min</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">Ignore range max, and provide increment</p>
     
 <hr>
 
 <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Promotions</h3>
 <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Enable promotion recommendations</h4>
 <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.enable_recommendation === true ? 'yes':'no'}</p>
 
 <hr>
 <h3  style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Bonus and Incentives</h3>
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Enable bonus and incentives</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.enable_bonus_incentives === true ? 'yes':'no'}</p>
      
      <h4  style="color:grey;font-family: Tahoma;font-weight: normal;margin: 0;margin-bottom: 5px;">Different Bonus and incentives rules for different employee group</h4>
      <p style="font-family: Tahoma;font-weight: normal;font-size: 15px;margin-top: 5px;">${plan.statutory_increment === true ? 'yes':'no'}</p>
      <hr>
      <h3 style="color:dodgerblue;margin-top:40px;font-family: Tahoma;">Bonus Table</h3>
      <table style="margin-top: 1.5rem;margin-bottom: 1.5rem; width: 95%;border-collapse: collapse;">
 
 <thead>
  
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">SI NO</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Name</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Type</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Eligibility</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Bonus(%)</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Bonus Multiplier</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Recommendation</th>
 <th style="border: 1px solid black;padding: 8px;text-align: center;font-family: Tahoma;">Prorate</th>
 </thead>
 <tbody>
  
   <tr>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">1</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Reteption	</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Time</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">30-11-2016</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">10 %</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">No</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Yes (25-75)</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">No</td>
   
   </tr>
     <tr>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">2</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Reteption	</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Time</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">30-11-2016</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">10 %</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">No</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">Yes (25-75)</td>
     <td style="border: 1px solid black;padding: 8px;text-align: center;">No</td>
     </tr>
 </tbody>
      </table>
 
   </body>
 </html>
   `;
 
   // Navigate to a data URL with the HTML content
   await page.goto(`data:text/html,${htmlContent}`);
 
   // Generate the PDF with multiple pages
   const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
 
   // Close the browser
   await browser.close();
 
   // Set the response headers to indicate a PDF file
   res.setHeader("Content-Type", "application/pdf");
   res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
 
   // Send the PDF content to the client
   res.send(pdfBuffer);
 
   console.log("PDF with three A4-sized pages sent to the client.");
})
module.exports = router;
