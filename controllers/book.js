const fs = require("fs");
const Book = require("../models/Book");
const optimizeImage = require("../utils/image");

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
  try {
    const filename = await optimizeImage(req.file);
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
    });
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
  let bookObject;
  try {
    const oldBook = await Book.findById(req.params.id);
    if (!oldBook) {
      return res.status(404).json({ error: "Livre introuvable" });
    }
    if (oldBook.userId !== req.auth.userId) {
      return res.status(403).json({ error: "unauthorized request" });
    }
    if (req.file) {
      const filename = await optimizeImage(req.file);
      const parts = oldBook.imageUrl.split("/images/");
      const oldfilename = parts[parts.length - 1];
      fs.unlink(`images/${oldfilename}`, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image :", err);
        }
      });
      bookObject = {
        ...(req.body.book ? JSON.parse(req.body.book) : oldBook.toObject()),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${filename}`,
      };
    } else {
      bookObject = { ...req.body };
    }
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
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Livre introuvable" });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: "unauthorized request" });
    }
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

/**
 * Ajout de la note dans la base de données par l'id du livre et de l'utilisateur.
 * Nécessite un token JWT valide (header Authorization: Bearer).
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.rateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Livre introuvable" });
    }
    const existingRating = book.ratings.find(
      (rating) => rating.userId === req.auth.userId,
    );
    if (existingRating) {
      return res.status(400).json({ error: "Tu as déja noté ce livre" });
    }
    if (!Number.isFinite(req.body.rating)) {
      return res.status(400).json({ error: "La note doit être un nombre." });
    }
    if (req.body.rating > 5 || req.body.rating < 0) {
      return res.status(400).json({ error: "La note doit être entre 0 et 5" });
    }
    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating,
    });
    const sum = book.ratings.reduce((total, rating) => total + rating.grade, 0);
    const averageRating = sum / book.ratings.length;
    book.averageRating = averageRating;
    await book.save();
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Affiche les 3 livres de la base de donnée ayant la meilleur note moyenne.
 * @param {import('express').Request} req - La requête Express.
 * @param {import('express').Response} res - La réponse Express.
 */
exports.bestrating = async (req, res) => {
  try {
    const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
