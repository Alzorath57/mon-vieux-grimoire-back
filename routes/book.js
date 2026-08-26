const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");
const multer = require("../middleware/multer-config");

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBook);
router.post("/", multer, bookController.createBook);
router.put("/:id", multer, bookController.updateBook);

module.exports = router;
