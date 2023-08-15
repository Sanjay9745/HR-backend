
const mongoose = require('mongoose');

const personalizeSchema = new mongoose.Schema( {
    user_id:  { type: String, required: true},
    date: { type: Date, default: Date.now()},
    country :   { type: String, required: true ,default: ""},
    number :  { type: String, required: true ,default: ""},
    currency :  { type: String, required: true ,default: ""},
    percentage:  { type: String, required: true ,default: ""},
    date_format:  { type: String, required: true ,default: ""},
    timezone: { type: String, required: true ,default: ""},
    percentage_round:  { type: String, required: true,default: "" },
    number_round:  { type: String, required: true,default: "" },
    currency_round:  { type: String, required: true ,default: ""},
    
});

module.exports = mongoose.model('Personalize',personalizeSchema);
