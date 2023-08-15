// models/countySettings.js
const mongoose = require('mongoose');

const culturalSchema = new mongoose.Schema( {
    country :   { type: String, required: true },
    date_format:  { type: String, required: true },
    number :  { type: String, required: true },
    currency :  { type: String, required: true },
});

module.exports = mongoose.model('CountrySetting', culturalSchema);
