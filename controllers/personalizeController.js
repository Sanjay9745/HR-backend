const Personalize = require("../models/personalizeModel");

//cultural
const culturalRoute = async (req, res) => {
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
          cultural: {
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
        },
        { new: true, upsert: true }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //salary component
  const salaryComponentRoute = async (req, res) => {
    try {
      const { salary_component, merit_applied_on } = req.body;
      const userId = req.user._id;
  
      // Check if the required fields are not null
      if (!salary_component || !merit_applied_on) {
        return res.status(400).json({
          error: "salary_component and merit_applied_on are required fields.",
        });
      }
  
      // Create or update the Personalize record
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          salary: {
            salary_component,
            merit_applied_on,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //integration with hr
  const integrationWithHrRoute = async (req, res) => {
    try {
      const { integration_with_hr } = req.body;
      const IntegrationWithHRFile = req.files["integration_image"][0];
      const userId = req.user._id;
  
      // Check if the integration_with_hr field is not null
      if (!integration_with_hr) {
        return res
          .status(400)
          .json({ error: "integration_with_hr is a required field." });
      }
  
      // Assuming that you have a Personalize schema
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          integration_with_hr: {
            integration_with_hr,
            // Assuming you want to store the image URL in the personalizeRecord
            integration_image: IntegrationWithHRFile
              ? IntegrationWithHRFile
              : null,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //company profile
  const companyProfileRoute = async (req, res) => {
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
          company: {
            company_name,
            company_address,
            company_industry,
            company_phone,
            company_email,
            company_profile,
            company_approver_name,
            company_approver_email,
            company_approver_replay_email,
            company_signature: companySignatureFile ? companySignatureFile : null,
            company_logo: companyLogoFile ? companyLogoFile : null,
            company_hr_logo: companyHrLogoFile ? companyHrLogoFile : null,
          },
        },
        { new: true, upsert: true }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //workflow
  const workflowRoute = async (req, res) => {
    try {
      const { workflow } = req.body;
  
      // Check if the workflow field is present in the request body
      if (!workflow) {
        return res.status(400).json({ error: "workflow is a required field." });
      }
  
      const userId = req.user._id;
  
      // Assuming that you have a Personalize schema
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          workflow,
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //exclusion criteria
  const exclusionCriteriaRoute = async (req, res) => {
    try {
      const { exclusion_criteria } = req.body;
  
      // Check if the exclusion_criteria field is present in the request body
      if (!exclusion_criteria) {
        return res
          .status(400)
          .json({ error: "exclusion_criteria is a required field." });
      }
  
      const userId = req.user._id;
  
      // Assuming that you have a Personalize schema
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          exclusion_criteria,
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //Supervisor
  const supervisorRoute = async (req, res) => {
    try {
      const {
        supervisor_video_url,
        supervisor_attachment,
        supervisor_currency_button,
        supervisor_enable_chat,
        supervisor_employee_letter,
      } = req.body;
  
      // Check if the supervisor_video_url field is not null
      if (!supervisor_video_url) {
        return res
          .status(400)
          .json({ error: "supervisor_video_url is a required field." });
      }
  
      // Check if the uploaded files are present
      const load_policy = req.files["load_policy"]
        ? req.files["load_policy"][0]
        : null;
      const load_learning_material = req.files["load_learning_material"]
        ? req.files["load_learning_material"][0]
        : null;
  
      const userId = req.user._id;
  
      // Assuming that you have a Personalize schema
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          supervisor: {
            supervisor_video_url,
            supervisor_attachment,
            supervisor_currency_button,
            supervisor_enable_chat,
            supervisor_employee_letter,
            load_policy: load_policy ? load_policy.path : null,
            load_learning_material: load_learning_material
              ? load_learning_material.path
              : null,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //hr review settings
  const hrReviewSettingsRoute = async (req, res) => {
    try {
      const {
        allow_hr_override,
        justification_mandatory,
        attachment_mandatory,
        edit_on_approval,
      } = req.body;
      const userId = req.user._id;
      // Assuming that you have a Personalize schema
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          hr_review: {
            allow_hr_override,
            justification_mandatory,
            attachment_mandatory,
            edit_on_approval,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //total rewards
  const totalRewardsRoute = async (req, res) => {
    try {
      const { total_cash, total_benefits, additional_analysis } = req.body;
      const userId = req.user._id;
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          total_rewards: { total_cash, total_benefits, additional_analysis },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //TAT
  const tatRoute = async (req, res) => {
    try {
      const { tat } = req.body;
      const userId = req.user._id;
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          tat,
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  
  //Terminology
  const terminologyRoute = async (req, res) => {
    try {
      const {
        my_team,
        salary,
        compa_ratio,
        range_penetration,
        guideline,
        recommendation,
        new_salary,
        median_salary,
        medium_salary,
      } = req.body;
      const userId = req.user._id;
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          terminology: {
            my_team,
            salary,
            compa_ratio,
            range_penetration,
            guideline,
            recommendation,
            new_salary,
            median_salary,
            medium_salary,
          },
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };
  // addition_matrix
  const additionMatrixRoute = async (req, res) => {
    try {
      const { addition_matrix, matrix_name, factor_one, factor_two } = req.body;
      const userId = req.user._id;
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          addition_matrix,
          matrix_name,
          factor_one,
          factor_two,
        },
        { new: true, upsert: true, useFindAndModify: false }
      );
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  };

  module.exports = {
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
  }