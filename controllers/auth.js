const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
