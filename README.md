# SkillAndYou

SkillAndYou est une application web de mise en relation basée sur les compétences, développée dans le cadre d’un projet full-stack.

L’objectif de la plateforme est de permettre aux utilisateurs de proposer, rechercher et échanger des compétences via un système de profils, d’échanges, de messagerie et de notifications en temps réel.

---
<img width="1898" height="947" alt="image" src="https://github.com/user-attachments/assets/c5aecbc3-7eb6-4ea8-9fc3-16572275cfa9" />
<img width="1244" height="801" alt="image" src="https://github.com/user-attachments/assets/10997ca2-6399-46a7-a15c-7bd6bff970e9" />
<img width="1913" height="921" alt="image" src="https://github.com/user-attachments/assets/076e8980-4d84-4c76-aac4-f4d21ade0c6a" />
<img width="1889" height="942" alt="image" src="https://github.com/user-attachments/assets/9f81eea1-95fa-4bdd-b896-e21de7cd5914" />




## Fonctionnalités principales

- Authentification avec JWT.
- Gestion des rôles et des permissions.
- Création et consultation de profils utilisateurs.
- Recherche et mise en relation autour des compétences.
- Système d’échanges entre utilisateurs.
- Messagerie en temps réel.
- Notifications.
- Interface responsive et moderne.
- Architecture modulaire côté frontend et backend.

---

## Stack technique

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- @stomp/stompjs

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- WebSocket
- Lombok

### Bases de données
- MySQL
- MongoDB

---

## Architecture du projet

### Frontend
Le frontend est organisé par responsabilité :

- `api/` : appels HTTP vers le backend.
- `auth/` : gestion de l’authentification, du contexte utilisateur et des routes protégées.
- `components/` : composants React réutilisables.
- `hooks/` : logique réutilisable.
- `pages/` : pages complètes associées aux routes.
- `types/` : types TypeScript partagés.

### Backend
Le backend suit une architecture en couches :

- `controller/` : exposition de l’API REST.
- `service/` : logique métier.
- `repository/` : accès aux données.
- `entity/` : modèles persistés.
- `dto/` : objets d’échange.
- `security/` : sécurité, JWT et filtres.
- `config/` : configuration générale.

---

## Flux de fonctionnement

1. L’utilisateur interagit avec l’interface React.
2. Le frontend envoie une requête HTTP vers le backend.
3. Le controller reçoit la requête.
4. Le service applique la logique métier.
5. Le repository interagit avec la base de données.
6. Le backend renvoie une réponse JSON au frontend.

---

## Sécurité

L’application utilise :
- JWT pour l’authentification.
- Spring Security pour la sécurisation des routes.
- Gestion des rôles pour contrôler l’accès aux ressources.
- Protection des routes côté frontend.

---

## Temps réel

La partie messagerie repose sur WebSocket afin de permettre :
- l’échange instantané de messages,
- la mise à jour en temps réel de l’interface,
- une expérience utilisateur fluide.

---

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- Node.js
- npm
- Java
- Maven
- MySQL
- MongoDB
- Docker si tu veux exécuter les conteneurs

---

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/daniel69110/SkillAndYou.git
cd SkillAndYou
```

### 2. Lancer le backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

---


## Build

### Frontend
```bash
npm run build
```

### Backend
```bash
mvn clean package
```

---


## Objectif pédagogique

Ce projet a été réalisé pour illustrer :
- la conception d’une application full-stack,
- l’architecture en couches,
- l’authentification sécurisée,
- la communication temps réel,
- la séparation claire entre frontend et backend,
- la mise en production d’une application.

---

## Auteur

Daniel C
