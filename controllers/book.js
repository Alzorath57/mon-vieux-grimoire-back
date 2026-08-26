const fs = require("fs");
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

// méthode Get pour récupération d'un livre par son ID
exports.getBook = async (req, res) => {
  try {
    const searchBook = await Book.findById(req.params.id);
    if (!searchBook) {
      return res.status(404).json({ error: "Livre introuvable" });
    }
    res.status(200).json(searchBook);
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

// méthode Put pour mise à jour d'un livre
exports.updateBook = async (req, res) => {
  let bookObject;
  if (req.file) {
    const oldBook = await Book.findById(req.params.id);
    const parts = oldBook.imageUrl.split("/images/");
    const filename = parts[parts.length - 1];
    fs.unlink(`images/${filename}`, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image :", err);
      }
    });
    bookObject = {
      ...(req.body.book ? JSON.parse(req.body.book) : oldBook.toObject()),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    };
  } else {
    bookObject = { ...req.body };
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      bookObject,
      { new: true },
    );
    if (!updatedBook) {
      return res.status(404).json({ error: "Livre introuvable" });
    }
    res.status(200).json({ message: "Livre mis à jour avec succès !" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
