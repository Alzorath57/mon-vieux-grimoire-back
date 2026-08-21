const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("Route inscription ok");
});

router.post("/login", (req, res) => {
  res.send("Route connexion ok");
});

module.exports = router;
