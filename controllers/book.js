const Book = require("../models/Book");

// méthode Get pour récupération de tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// méthode Post pour création d'un nouveau livre
exports.createBook = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  try {
    await book.save();
    res.status(201).json({ message: "Livre créé avec succès !" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
