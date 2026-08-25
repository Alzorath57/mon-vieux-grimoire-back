const multer = require("multer");
const path = require("path");

// définition des types MIME autorisés pour les fichiers image
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// configuration de multer pour le stockage des fichiers image
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // génération d'un nom de fichier unique pour chaque image
  filename: (req, file, callback) => {
    const name = path.parse(file.originalname).name.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
