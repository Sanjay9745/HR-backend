const express = require("express");
const router = express.Router();
const Cultural = require("../models/culturalModel");
const authenticateToken = require("../middleware/auth");
const CountrySetting = require("../models/countrySettingModel");

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const {
      country,
      number,
      currency,
      percentage,
      date_format,
      timezone,
      percentage_round,
      number_round,
      currency_round,
    } = req.body;

    // Validate required fields
    if (
      !country ||
      !number ||
      !currency ||
      !percentage ||
      !date_format ||
      !timezone ||
      !percentage_round ||
      !number_round ||
      !currency_round
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newCultural = new Cultural({
      country,
      number,
      currency,
      percentage,
      date_format,
      timezone,
      percentage_round,
      number_round,
      currency_round,
      user_id: req.user._id,
    });

    const savedCultural = await newCultural.save();
    res.json(savedCultural);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/country-settings", authenticateToken, async (req, res) => {
  try {
    const { country, date_format, number, currency } = req.body;
    const countrySetting = new CountrySetting({
      country,
      date_format,
      number,
      currency,
    });
    const savedCountrySetting = await countrySetting.save();
    res.json(savedCountrySetting);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


router.get("/country-settings", authenticateToken, async (req, res) => {
  try {
    const countrySetting = await CountrySetting.find();
    res.json(countrySetting);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

module.exports = router;
