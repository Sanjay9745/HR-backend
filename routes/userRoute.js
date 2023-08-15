
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const authenticateToken = require("./auth")
const router = express.Router();
const axios = require('axios');
// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
    });
    
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  
  const accessToken = jwt.sign({ username }, 'your-secret-key');
  res.json({ accessToken });
});


router.get("/protected", authenticateToken, (req, res) => {
res.status(200).json({ message: "You are authorized"+req.user ,user:req.user})
})

router.get('/getIP', (req, res) => {
  const ipArray = req.ipInfo;
  console.log(ipArray);
  console.log(req.ipInfo.ip[0]);
  if (!req.ipInfo.error && Array.isArray(ipArray) && ipArray.length > 0) {
    const firstIp = ipArray[0];
    
    axios.get(`https://ipapi.co/${firstIp}/json/`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(400).json({ message: 'Error fetching IP information.' });
      });
  } else {
    res.status(400).json({ message: 'Error getting IP address.' });
  }
});
router.get('/IP', (req, res) => {
  const clientIp = req.clientIp; // Get the client's IP address from the request
  console.log(clientIp);
  res.json({ ip: clientIp });
});
module.exports = router;
