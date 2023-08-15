const express = require("express");
const router = express.Router();
const Personalize = require("../models/personalizeModel");
const authenticateToken = require("../middleware/auth");
//Post request to create a new personalize record

//cultural
router.post("/cultural", authenticateToken, async (req, res) => {
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
  
      const userId = req.user._id;
  
      // Update or create the Personalize record
      let personalizeRecord = await Personalize.findOneAndUpdate(
        { user_id: userId },
        {
          country,
          number,
          currency,
          percentage,
          date_format,
          timezone,
          percentage_round,
          number_round,
          currency_round,
        },
        { new: true, upsert: true }
      );
  
      res.json(personalizeRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
  

  //
module.exports = router;
