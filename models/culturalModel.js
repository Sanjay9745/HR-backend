// models/user.js
const mongoose = require('mongoose');

const culturalSchema = new mongoose.Schema( {
    date: { type: Date, default: Date.now()},
    country :   { type: String, required: true },
    number :  { type: String, required: true },
    currency :  { type: String, required: true },
    percentage:  { type: String, required: true },
    date_format:  { type: String, required: true },
    timezone: { type: String, required: true },
    percentage_round:  { type: String, required: true },
    number_round:  { type: String, required: true },
    currency_round:  { type: String, required: true },
    user_id:  { type: String, required: true }
});

module.exports = mongoose.model('Cultural', culturalSchema);
