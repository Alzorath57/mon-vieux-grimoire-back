const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");
const multer = require("../middleware/multer-config");

router.get("/", bookController.getAllBooks);
router.post("/", multer, bookController.createBook);

module.exports = router;
