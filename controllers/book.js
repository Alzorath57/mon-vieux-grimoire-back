const fs = require("fs");
const Book = require("../models/Book");

/**
 * Récupère tous les livres de la base de données.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Récupère un livre de la base de données par son id.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
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

/**
 * Créé un livre dans la base de données.
 * Nécessite un token JWT valide (header Authorization: Bearer) appartenant au propriétaire du livre.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.createBook = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  try {
    await book.save();
    res.status(201).json({ message: "Livre créé avec succès !" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Modifie un livre de la base de données par son id.
 * Nécessite un token JWT valide (header Authorization: Bearer) appartenant au propriétaire du livre.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.updateBook = async (req, res) => {
  const oldBook = await Book.findById(req.params.id);
  if (!oldBook) {
    return res.status(404).json({ error: "Livre introuvable" });
  }
  if (oldBook.userId !== req.auth.userId) {
    return res.status(403).json({ error: "unauthorized request" });
  }
  let bookObject;
  if (req.file) {
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

/**
 * Supprime un livre de la base de données par son id.
 * Nécessite un token JWT valide (header Authorization: Bearer) appartenant au propriétaire du livre.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Livre introuvable" });
  }
  if (book.userId !== req.auth.userId) {
    return res.status(403).json({ error: "unauthorized request" });
  }
  try {
    const parts = book.imageUrl.split("/images/");
    const filename = parts[parts.length - 1];
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    fs.unlink(`images/${filename}`, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image :", err);
      }
    });
    res.status(200).json({ message: "Livre supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
