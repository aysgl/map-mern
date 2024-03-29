const router = require("express").Router();
const Pin = require("../models/Pin");

router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = newPin.save();

    res.status(200).json(savedPin);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json({ data: pins });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
