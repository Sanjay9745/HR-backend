const express = require("express");
const router = express.Router();      
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const authenticateToken = require("../middleware/auth");
const axios = require("axios");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullName, user_type } = req.body;
    
    // Validate required fields
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Check if username or email already exist
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      password: hashedPassword,
      email,
      fullName
    };

    // Conditionally add user_type if it exists in the request
    if (user_type) {
      userData.user_type = user_type;
    }

    const user = new User(userData);

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user." });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const accessToken = jwt.sign({ username,_id:user._id }, "your-secret-key");
  res.json({ accessToken });
});

//Update User
router.patch("/update", authenticateToken, async (req, res) => {
try {
  const password = req.body.password;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
  let response = User.findOneAndUpdate({username: req.user.username}, {password: hashedPassword}, {new: true});
  res.status(200).json({message: "Password updated successfully"});
  }
} catch (error) {
  res.status(404).json({message: "Error updating password"})
}
})

// Protected route
router.get("/protected", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "You are authorized" + req.user, user: req.user });
});


//Ip into location
router.get("/getIP", (req, res) => {
  const clientIp = req.clientIp; // Get the client's IP address from the request
  console.log(clientIp);

  if (!clientIp) {
    return res
      .status(400)
      .json({ message: "Could not retrieve client IP address." });
  }

  axios
    .get(`https://ipapi.co/${clientIp}/json/`)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error fetching IP information." });
    });
});
module.exports = router;
