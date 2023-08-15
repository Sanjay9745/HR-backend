require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const culturalRoute = require('./routes/culturalRoute');

const app = express();

//Middleware
app.use(requestIp.mw()); // Use the request-ip middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Use urlencoded middleware
app.use(cors())
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/user',userRoute)
app.use('/api/cultural',culturalRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
