require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const countrySettingsRoute = require('./routes/countrySettingsRoute');
const personalizeRoute = require('./routes/personalizeRoute');


const app = express();

//Middleware
app.use(cors())
app.use(requestIp.mw()); // Use the request-ip middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Use urlencoded middleware
app.use(express.static("uploads"));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/user',userRoute)
app.use('/api/country-settings',countrySettingsRoute)
app.use('/api/personalize',personalizeRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
