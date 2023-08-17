const mongoose = require("mongoose");
const personalizeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  //cultural
  cultural: {
    country: { type: String, default: "" },
    number: { type: String, default: "" },
    currency: { type: String, default: "" },
    percentage: { type: String, default: "" },
    date_format: { type: String, default: "" },
    timezone: { type: String, default: "" },
    percentage_round: { type: String, default: "" },
    number_round: { type: String, default: "" },
    currency_round: { type: String, default: "" },
  },
  //salary component
  salary: {
    salary_component: { type: Boolean, default: false },
    merit_applied_on: { type: Object, default: {} },
  },
  //integration with hr
  integration_with_hr: {
    integration_with_hr: { type: Boolean, default: false },
    integration_image: { type: Object, default: {} },
  },

  //company profile
  company: {
    company_name: { type: String, default: "" },
    company_address: { type: String, default: "" },
    company_industry: { type: String, default: "" },
    company_phone: { type: String, default: "" },
    company_email: { type: String, default: "" },
    company_profile: { type: String, default: "" },
    company_approver_name: { type: String, default: "" },
    company_approver_email: { type: String, default: "" },
    company_approver_reply_email: { type: String, default: "" },
    company_signature: { type: Object, default: {} },
    company_logo: { type: Object, default: {} },
    company_hr_logo: { type: Object, default: {} },
  },
  //users creation
  users: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default:  new mongoose.Types.ObjectId(),
      },
      user_name: { type: String,default: ""},
      user_email: { type: String,   default: ""},
      user_password: { type: String , default: ""},
      role:{ type: String, default: "" },
      limit_access: { type: Boolean, default: false },
      user_access_criteria: { type: Object, default: {} },
      access_grant: {
        country: { type: String, default: "" },
        department:   { type: String, default: "" },
        grade: { type: String, default: "" },
      },
    },
  ],
  //workflow
  workflow: {
    supervisor: { type:Boolean, default: false },
    manager: { type:Boolean, default: false },
    hr: { type:Boolean, default: false },
    sub_hr: { type:Boolean, default: false },
   },
  //exclusion criteria
  exclusion_criteria: { type: Object, default: {} },
  //performance
  performance: {
    multiple_performance: { type: Number, default: 0 },
    bonus_recommendation: { type: Boolean, default: false },
    salary_mid: { type: Boolean, default: false },
    step_increment: { type: Boolean, default: false },
    calculate_arrear: { type: Boolean, default: false },
  },
  //Supervisor
  supervisor: {
    load_policy: { type: Object, default: {} },
    load_learning_material: { type: Object, default: {} },
    supervisor_video_url: { type: String, default: "" },
    supervisor_attachment: { type: Boolean, default: false },
    supervisor_currency_button: { type: Boolean, default: false },
    supervisor_enable_chat: { type: Boolean, default: false },
    supervisor_employee_letter: { type: Boolean, default: false },
  },

  //hr review settings
  hr_review: {
    allow_hr_override: { type: Boolean, default: false },
    justification_mandatory: { type: Boolean, default: false },
    attachment_mandatory: { type: Boolean, default: false },
    edit_on_approval: { type: Boolean, default: false },
  },
  //Total rewards Statement
  total_rewards: {
    total_cash: { type: Object, default: {} },
    total_benefits: { type: Object, default: {} },
    additional_analysis: { type: Object, default: {} },
  },
  //TAT
  tat: { type: Number, default: 0 },
  //Terminology
  terminology: {
    my_team: { type: String, default: "" },
    salary: { type: String, default: "" },
    compa_ratio: { type: String, default: "" },
    range_penetration: { type: String, default: "" },
    guideline: { type: String, default: "" },
    recommendation: { type: String, default: "" },
    new_salary: { type: String, default: "" },
    median_salary: { type: String, default: "" },
    medium_salary: { type: String, default: "" },
  },
  //Addition Matrix
  addition_matrix: {
    addition_matrix: { type: Boolean, default: false },
    matrix_name: { type: String, default: "" },
    factor_one: { type: String, default: "" },
    factor_two: { type: String, default: "" },
  },
});

module.exports = mongoose.model("Personalize", personalizeSchema);
