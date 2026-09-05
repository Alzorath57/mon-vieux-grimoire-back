const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

async function optimizeImage(file) {
  const name = path.parse(file.originalname).name.split(" ").join("_");
  const extension = MIME_TYPES[file.mimetype];
  const key = crypto.randomBytes(16).toString("hex");
  const filename = `${name}_${key}.${extension}`;
  await sharp(file.buffer).jpeg({ quality: 80 }).toFile(`images/${filename}`);
  return filename;
}
module.exports = optimizeImage;
