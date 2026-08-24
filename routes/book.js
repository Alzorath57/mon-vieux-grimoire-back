const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");

router.get("/", bookController.getAllBooks);

module.exports = router;
