# 🚛 LogistiCo - Plateforme de Gestion Logistique Premium

LogistiCo est une solution moderne et performante de gestion de distribution et de logistique, conçue pour optimiser les opérations des entreprises de transport et de distribution. Dotée d'une interface **Ivory & Gold** (Ivoire et Or) haut de gamme, elle offre une expérience utilisateur fluide et professionnelle.

---

## ✨ Fonctionnalités Clés

### 🏗️ Gestion des Infrastructures
- **Entrepôts** : Cartographie et gestion des capacités de stockage.
- **Points de Vente** : Suivi des destinations et des besoins de livraison.
- **Fournisseurs** : Centralisation des relations et des approvisionnements.

### 🚚 Flotte et Distribution
- **Véhicules** : Gestion détaillée du parc automobile (camions, utilitaires).
- **Transporteurs** : Suivi des partenaires logistiques et des chauffeurs.
- **Plan de Distribution** : Algorithmes d'optimisation des tournées et planification intelligente.

### 📦 Produits et Stocks
- **Catalogue Produits** : Gestion des références et des catégories.
- **Suivi en temps réel** : Visibilité sur les mouvements de marchandises.

### 👤 Profil et Administration
- **Tableau de Bord** : Vue d'ensemble analytique des performances.
- **Profil Entreprise** : Personnalisation complète (Logo, Informations légales, Coordonnées).

---

## 🎨 Design System : Ivory & Gold

LogistiCo se distingue par son identité visuelle "Premium" :
- **Palette Sophistiquée** : Utilisation du *Midnight Blue* pour le contraste, de l'*Ivoire* pour la clarté et de l'*Or* pour les accents luxueux.
- **Effets Modernes** : Glassmorphism (effets de verre dépoli), ombres portées douces et transitions fluides.
- **Responsive** : Interface entièrement adaptative pour mobiles, tablettes et ordinateurs.

---

## 🚀 Technologies Utilisées

### Frontend
- **Framework** : Vue 3 (Composition API)
- **Build Tool** : Vite
- **Styling** : Tailwind CSS v4
- **Icons** : Lucide Vue Next & FontAwesome
- **State Management** : Vuex
- **Cartographie** : Leaflet & Leaflet Routing Machine

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js (v5)
- **Base de Données** : MongoDB (Mongoose) & PostgreSQL (pg)
- **Authentification** : JWT (JSON Web Tokens) & Passport.js
- **Stockage Image** : Cloudinary
- **Temps Réel** : Socket.io

---

## 🛠️ Installation et Configuration

### Prérequis
- Node.js (v18+)
- MongoDB & PostgreSQL
- Un compte Cloudinary (pour les images)

### Configuration
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/Nour0506/LogistiCo.git
   ```

2. Configuration du Serveur :
   ```bash
   cd server
   npm install
   # Créer un fichier .env basé sur les besoins (DB_URL, JWT_SECRET, CLOUDINARY_*)
   npm start
   ```

3. Configuration du Client :
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 📂 Structure du Projet

```text
LogistiCo/
├── client/           # Application Vue.js (Frontend)
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── views/      # Pages principales
│   │   └── store/      # Gestion d'état Vuex
├── server/           # API Node.js (Backend)
│   ├── models/       # Schémas de base de données
│   ├── controller/   # Logique métier
│   └── routes/       # Points d'entrée API
└── README.md
```

---

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---
*Développé avec passion pour l'excellence logistique.*