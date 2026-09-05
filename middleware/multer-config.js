const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 },
}).single("image");

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "L'image est trop volumineuse (2 Mo maximum)" });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ error: "Le type de fichier n'est pas autorisé" });
      }
      if (err.code === "MISSING_FIELD_NAME") {
        return res.status(400).json({ error: "Le nom de champ est manquant" });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
