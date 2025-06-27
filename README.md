# GearGuardian

GearGuardian est une application web conçue pour aider les grimpeurs à gérer leur équipement d'escalade, à suivre son usure et à garantir leur sécurité grâce à des analyses intelligentes. Ne perdez plus jamais la trace de la durée de vie de votre matériel !

![Aperçu de GearGuardian]![f940a070-dca3-449f-94c6-ba68ba5d608c](https://github.com/user-attachments/assets/90ca7e65-c146-422b-8fc3-f8bc80a7cfdf)
)
*L'image ci-dessus est un placeholder. Pensez à la remplacer par une vraie capture d'écran de l'application.*

## Fonctionnalités

*   **Gestion Complète :** Ajoutez, modifiez, et archivez tout votre équipement d'escalade (cordes, baudriers, casques, etc.).
*   **Suivi de la Durée de Vie :** Calcule automatiquement le pourcentage d'usure basé sur la date de mise en service et la durée de vie recommandée.
*   **Alertes Visuelles :** Des badges de couleur et un bandeau d'alerte vous informent en un coup d'œil de l'état de votre matériel.
*   **Analyse par IA :** Obtenez une analyse de sécurité sur l'état de votre équipement en téléversant une simple photo. Le modèle identifie les points d'usure potentiels et fournit des recommandations.
*   **Authentification Sécurisée :** Créez un compte et gérez votre profil en toute sécurité grâce à Firebase Authentication.
*   **Interface Moderne :** Une interface claire et réactive avec un mode sombre.

## Stack Technique

*   **Framework :** [Next.js](https://nextjs.org/) (App Router)
*   **UI :** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Base de données :** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
*   **Fonctionnalités IA :** [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)

---

## Installation et Lancement en Local

Pour faire fonctionner ce projet sur votre machine, suivez ces étapes.

### Prérequis

*   [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
*   Un gestionnaire de paquets comme `npm` ou `yarn`.
*   Un compte Google pour créer un projet Firebase et obtenir une clé API Google.

### 1. Cloner le Dépôt

```bash
git clone <URL_DU_REPO>
cd <NOM_DU_DOSSIER>
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configurer Firebase

L'application utilise Firebase pour l'authentification des utilisateurs et la base de données Firestore.

1.  Rendez-vous sur la [console Firebase](https://console.firebase.google.com/) et créez un nouveau projet.
2.  Activez **Authentication** : Allez dans l'onglet `Authentication`, cliquez sur "Commencer", et activez le fournisseur "E-mail/Mot de passe".
3.  Activez **Firestore Database** : Allez dans l'onglet `Firestore Database`, cliquez sur "Créer une base de données" et démarrez en **mode production**.

### 4. Configurer les Clés d'API

Vous avez besoin de clés pour Firebase et Google AI (Gemini).

1.  **Créez un fichier `.env`** à la racine du projet.
2.  **Clés Firebase :**
    *   Dans votre console Firebase, allez dans les **Paramètres du projet** (icône ⚙️).
    *   Dans l'onglet "Général", descendez jusqu'à "Vos applications".
    *   Cliquez sur l'icône web `</>` pour enregistrer une nouvelle application web.
    *   Firebase vous donnera un objet de configuration `firebaseConfig`. Copiez ces clés.
3.  **Clé Google AI (Gemini) :**
    *   Allez sur [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Cliquez sur **`Create API key`** et copiez la clé générée.
4.  **Remplissez le fichier `.env`** avec vos clés :

    ```env
    # Clés Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=VOTRE_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=VOTRE_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=VOTRE_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=VOTRE_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=VOTRE_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=VOTRE_APP_ID

    # Clé Google AI
    GOOGLE_API_KEY=VOTRE_CLE_API_GOOGLE_GEMINI
    ```

### 5. Lancer l'Application

```bash
npm run dev
```

Ouvrez [http://localhost:9002](http://localhost:9002) dans votre navigateur pour voir l'application.

## Déployer sur GitHub

Pour sauvegarder votre code sur un dépôt GitHub :

1.  **Initialisez un dépôt Git local** (si ce n'est pas déjà fait) :
    ```bash
    git init -b main
    ```
2.  **Ajoutez tous les fichiers pour le premier commit :**
    ```bash
    git add .
    git commit -m "Initial commit"
    ```
3.  **Créez un nouveau dépôt sur GitHub.com.**
4.  **Liez votre dépôt local au dépôt distant et poussez votre code :**
    ```bash
    git remote add origin https://github.com/VOTRE_NOM/VOTRE_REPO.git
    git push -u origin main
    ```
