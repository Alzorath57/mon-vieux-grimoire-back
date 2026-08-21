const express = require("express");
const app = express();
app.use(express.json());
app.use("/api/books", require("./routes/book"));
app.use("/api/auth", require("./routes/auth"));

module.exports = app;
