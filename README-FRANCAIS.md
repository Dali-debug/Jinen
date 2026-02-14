# JINEN - Application Web de Gestion de Garderie

## 🎯 Description

Application web moderne pour la gestion de garderies, développée avec **Angular**, **Spring Boot** et **MongoDB**.

## 🛠 Technologies Utilisées

### Frontend
- **Angular 19** - Framework web TypeScript
- **CSS3** - Design responsive

### Backend  
- **Spring Boot 3.2** - API REST Java
- **MongoDB** - Base de données NoSQL
- **Spring Security** - Authentification JWT

## 🚀 Démarrage Rapide

### Avec Docker (Recommandé)

```bash
# Démarrer tous les services
docker-compose -f docker-compose-new-stack.yml up -d

# Accéder à l'application
# Frontend : http://localhost:4200
# Backend API : http://localhost:8080
# MongoDB : localhost:27017
```

### Développement Local

#### Backend
```bash
cd backend-spring-boot
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend-angular
npm install
npm start
```

## 📋 Fonctionnalités

### Pour les Parents
- Recherche de garderies
- Inscription d'enfants
- Notation et avis sur les garderies
- Messagerie avec les garderies
- Gestion des inscriptions

### Pour les Propriétaires de Garderies
- Gestion du profil de la garderie
- Gestion des inscriptions
- Consultation des enfants inscrits
- Messagerie avec les parents
- Statistiques et performances

## 📖 Documentation

Consultez [README-NEW-STACK.md](README-NEW-STACK.md) pour la documentation complète en anglais.

## 🔐 Authentification

L'application utilise JWT (JSON Web Token) pour l'authentification sécurisée.

## 📦 Structure du Projet

```
├── backend-spring-boot/    # API Spring Boot
├── frontend-angular/       # Application Angular
└── docker-compose-new-stack.yml
```

## 🤝 Contribution

Projet privé - Contactez l'équipe de développement pour toute question.

## 📝 Licence

Privé - Tous droits réservés
