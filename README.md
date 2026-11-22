# Mon Vieux Grimoire — API back-end

API REST d'un site de notation de livres, développée avec **Node.js**, **Express** et **MongoDB**.

Les utilisateurs peuvent créer un compte, ajouter des livres avec une image de couverture, et noter les livres des autres. L'API calcule automatiquement la note moyenne de chaque livre.

> Projet réalisé pendant la formation Développeur Web d'OpenClassrooms (2026). L'objectif était de construire le back-end d'une application dont le front-end React était déjà fourni.

## Fonctionnalités

- **Authentification** : inscription et connexion. Les mots de passe sont hachés avec bcrypt, et la connexion renvoie un token JWT valable 24 h.
- **CRUD des livres** : consultation publique, création, modification et suppression réservées aux utilisateurs connectés.
- **Contrôle du propriétaire** : seul l'utilisateur qui a créé un livre peut le modifier ou le supprimer (sinon, réponse `403`).
- **Notation** : un utilisateur ne peut noter un livre qu'une seule fois (de 0 à 5), et la note moyenne est recalculée à chaque nouvelle note.
- **Classement** : une route renvoie les 3 livres les mieux notés.
- **Gestion des images (Green Code)** :
  - taille limitée à 2 Mo,
  - compression côté serveur avec Sharp,
  - nom de fichier unique grâce à une clé aléatoire, pour éviter que deux images de même nom s'écrasent,
  - suppression de l'ancienne image quand un livre est modifié ou supprimé.

## Technologies

| Rôle | Outil |
|---|---|
| Serveur | Node.js, Express 5 |
| Base de données | MongoDB Atlas, Mongoose |
| Authentification | bcrypt, jsonwebtoken |
| Upload et images | Multer, Sharp |
| Validation | mongoose-unique-validator (e-mails uniques) |

## Structure du projet

```
├── server.js            # Démarrage du serveur (port 4000)
├── app.js               # Configuration d'Express, connexion MongoDB, routes
├── routes/              # Définition des routes (auth, books)
├── controllers/         # Logique de chaque route
├── models/              # Schémas Mongoose (User, Book)
├── middleware/          # Vérification du JWT, configuration de Multer
└── utils/               # Optimisation des images
```

## Installation

### Prérequis

- Node.js (version 20 ou plus récente)
- Une base de données MongoDB (par exemple un cluster gratuit sur MongoDB Atlas)

### Étapes

1. Cloner le dépôt et installer les dépendances :

   ```bash
   git clone https://github.com/Alzorath57/mon-vieux-grimoire-back.git
   cd mon-vieux-grimoire-back
   npm install
   ```

2. Créer un fichier `.env` à la racine du projet :

   ```env
   MONGODB_URI=votre_chaine_de_connexion_mongodb
   JWT_SECRET=une_longue_chaine_secrete_aleatoire
   ```

3. Créer le dossier qui recevra les images :

   ```bash
   mkdir images
   ```

4. Lancer le serveur en mode développement :

   ```bash
   npm run dev
   ```

L'API est alors disponible sur `http://localhost:4000`.

## Routes de l'API

| Méthode | Route | Auth | Description |
|---|---|:---:|---|
| POST | `/api/auth/signup` | | Créer un compte |
| POST | `/api/auth/login` | | Se connecter et recevoir un token |
| GET | `/api/books` | | Liste de tous les livres |
| GET | `/api/books/bestrating` | | Les 3 livres les mieux notés |
| GET | `/api/books/:id` | | Détail d'un livre |
| POST | `/api/books` | ✅ | Ajouter un livre (avec image) |
| PUT | `/api/books/:id` | ✅ | Modifier son livre |
| DELETE | `/api/books/:id` | ✅ | Supprimer son livre |
| POST | `/api/books/:id/rating` | ✅ | Noter un livre |

Les routes marquées ✅ demandent un en-tête `Authorization: Bearer <token>`.

## Auteur

**Julien Holtzinger** — développeur web junior
[Portfolio](https://julien-holtzinger.vercel.app/) · [GitHub](https://github.com/Alzorath57)
