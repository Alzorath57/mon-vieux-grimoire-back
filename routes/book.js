const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.bestrating);
router.get("/:id", bookController.getBook);
router.post("/", auth, multer, bookController.createBook);
router.put("/:id", auth, multer, bookController.updateBook);
router.delete("/:id", auth, bookController.deleteBook);
router.post("/:id/rating", auth, bookController.rateBook);

module.exports = router;
