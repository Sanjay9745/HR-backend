const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");
const CountrySetting = require("../models/countrySettingModel");

router.post("/", authenticateToken, async (req, res) => {
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


router.get("/", async (req, res) => {
  try {
    const countrySetting = await CountrySetting.find();
    res.json(countrySetting);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

module.exports = router;
