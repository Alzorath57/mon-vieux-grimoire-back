const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/signup", authController.signup);

router.post("/login", (req, res) => {
  res.send("Route connexion ok");
});

module.exports = router;
