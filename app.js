require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/api/books", require("./routes/book"));
app.use("/api/auth", require("./routes/auth"));

module.exports = app;
