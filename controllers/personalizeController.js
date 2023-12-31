const Personalize = require("../models/personalizeModel");
const bcrypt = require("bcrypt");
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
      company_approver_reply_email,
    } = req.body;
    console.log(req.body);
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
      !company_approver_reply_email
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
          company_approver_reply_email,
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
    const { supervisor, manager, hr, sub_hr } = req.body;
    const userId = req.user._id;

    // Assuming that you have a Personalize schema
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        workflow: { supervisor, manager, hr, sub_hr },
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

    // Validate input data
    if (!Array.isArray(total_cash) || !Array.isArray(total_benefits) || !Array.isArray(additional_analysis)) {
      return res.status(400).json({ error: 'Invalid input data format' });
    }

    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        total_rewards: { total_cash, total_benefits, additional_analysis },
      },
      { new: true, upsert: true, useFindAndModify: false }
    );

    // Check if a record was found or created
    if (!personalizeRecord) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
        tat_time:Date.now()
      },
      { new: true, upsert: true, useFindAndModify: false }
    );
    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
//Performance
const performanceRoute = async (req, res) => {
  try {
    const {
      multiple_performance,
      bonus_recommendation,
      salary_mid,
      step_increment,
      calculate_arrear,
    } = req.body;
    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        performance: {
          multiple_performance,
          bonus_recommendation,
          salary_mid,
          step_increment,
          calculate_arrear,
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
        addition_matrix: {
          addition_matrix,
          matrix_name,
          factor_one,
          factor_two,
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


//history data
const historyDataRoute = async (req, res) => {
  try {
    const { excel_file } = req.files;
    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        history_data: excel_file[0],
      },
      { new: true, upsert: true, useFindAndModify: false }
    );
    
    res.json(personalizeRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}


const getHistoryDataRoute = async (req, res) => {
  try {
    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOne({ user_id: userId });
    res.json(personalizeRecord.history_data);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

//user creation
const userCreationRoute = async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_password,
      role,
      limit_access,
      user_access_criteria,
      country,
      department,
      grade,
    } = req.body;

    // Validate required fields
    if (!user_name || !user_email || !user_password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const userId = req.user._id;

    // Assuming that you have a Personalize schema
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        $push: {
          users: {
            user_name,
            user_email,
            user_password: hashedPassword, // Store hashed password
            role,
            limit_access,
            user_access_criteria,
            access_grant: {
              country,
              department,
              grade,
            },
          },
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
//user deletion
const userDeleteRoute = async (req, res) => {
  try {
    const { user_id } = req.body;
    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOneAndUpdate(
      { user_id: userId },
      {
        $pull: {
          users: {
            _id: user_id,
          },
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

const userUpdateRoute = async (req, res) => {
  try {
    const {
      user_id,
      user_name,
      user_email,
      user_password,
      role, // New role field
      limit_access, // New limit_access field
      user_access_criteria,
      country,
      department,
      grade,
    } = req.body;
    const userId = req.user._id;

    let personalizeRecord = await Personalize.findOne({ user_id: userId });

    const userToUpdate = personalizeRecord.users.find(
      (user) => user._id.toString() === user_id
    );

    if (userToUpdate) {
      userToUpdate.user_name = user_name;
      userToUpdate.user_email = user_email;
      userToUpdate.user_access_criteria = user_access_criteria;
      // Add role and limit_access
      userToUpdate.role = role;
      userToUpdate.limit_access = limit_access;
      userToUpdate.access_grant = {
        country,
        department,
        grade,
      };

      // Update password if provided
      if (user_password) {
        const hashedPassword = await bcrypt.hash(user_password, 10);
        userToUpdate.user_password = hashedPassword;
      }


    } else {
      return res.status(404).json({ message: "User not found" });
    }

    await personalizeRecord.save();
    res.status(200).json(personalizeRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userReadingRoute = async (req, res) => {
  try {
    const userId = req.user._id;
    let personalizeRecord = await Personalize.findOne({ user_id: userId });

    res.status(200).json(personalizeRecord.users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDataRoute = async(req, res) => {
  try {
    const userId = req.user._id;
    const user = await Personalize.findOne({ user_id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
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
  userCreationRoute,
  userDeleteRoute,
  userUpdateRoute,
  userReadingRoute,
  performanceRoute,
  historyDataRoute,
  getHistoryDataRoute,
  getAllDataRoute
};
