
const mongoose = require('mongoose');
const personalizeSchema = new mongoose.Schema( {
    user_id:  { type: String, required: true},
    date: { type: Date, default: Date.now()},
    //cultural
    country :   { type: String, default: ""},
    number :  { type: String, default: ""},
    currency :  { type: String, default: ""},
    percentage:  { type: String, default: ""},
    date_format:  { type: String, default: ""},
    timezone: { type: String, default: ""},
    percentage_round:  { type: String, default: "" },
    number_round:  { type: String, default: "" },
    currency_round:  { type: String, default: ""},
    //salary component
    salary_component:  { type: Boolean, default: false},
    merit_applied_on:  { type: Object, default: {}},
    //integration with hr
    integration_with_hr:  { type: Boolean, default: false},
    integration_image:  { type: Object,default: {}},
    //company profile
    company_name:  { type: String, default: ""},
    company_address:  { type: String, default: ""},
    company_industry:  { type: String, default: ""},
    company_phone:  { type: String, default: ""},
    company_email:  { type: String, default: ""},
    company_profile:  { type: String, default: ""},
    company_approver_name:  { type: String, default: ""},
    company_approver_email:  { type: String, default: ""},
    company_approver_replay_email:  { type: String, default: ""},
    company_signature:  { type: Object,default: {}},
    company_logo:  { type: Object,default: {}},
    company_hr_logo:  { type: Object,default: {}},
    //workflow
    workflow:  { type: Object, default: {}},
    //exclusion criteria
    exclusion_criteria:  { type: Object, default: {}},
    //Supervisor
    load_policy:   { type: Object, default: {}},
    load_learning_material:   { type: Object, default: {}},
    supervisor_video_url:   { type: String, default: ""},
    supervisor_attachment:   { type: Boolean, default: false},
    supervisor_currency_button:   { type: Boolean, default: false},
    supervisor_enable_chat:   { type: Boolean, default: false},
    supervisor_employee_letter:   { type: Boolean, default: false},
    //hr review settings
    allow_hr_override:   { type: Boolean, default: false},
    justification_mandatory:   { type: Boolean, default: false},
    attachment_mandatory:   { type: Boolean, default: false},
    edit_on_approval:   { type: Boolean, default: false},

});


module.exports = mongoose.model('Personalize',personalizeSchema);
