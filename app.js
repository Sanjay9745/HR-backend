// index.js
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const expressIp = require('express-ip'); // Import the express-ip middleware

const app = express();
app.use(express.json());
app.use(expressIp().getIpInfoMiddleware); // Use the express-ip middleware

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/comp360', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/user',userRoute)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
