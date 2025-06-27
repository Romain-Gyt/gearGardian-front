# GearGuardian

GearGuardian est une application web conçue pour aider les grimpeurs à gérer leur équipement d'escalade, à suivre son usure et à garantir leur sécurité grâce à des analyses intelligentes. Ne perdez plus jamais la trace de la durée de vie de votre matériel !

[3518556c-874d-410a-81b9-05f07746f926](https://github.com/user-attachments/assets/346ee6d3-59fb-4907-a409-c9941d6bb6fd)


## Fonctionnalités

*   **Gestion Complète :** Ajoutez, modifiez, et archivez tout votre équipement d'escalade (cordes, baudriers, casques, etc.).
*   **Suivi de la Durée de Vie :** Calcule automatiquement le pourcentage d'usure basé sur la date de mise en service et la durée de vie recommandée.
*   **Alertes Visuelles :** Des badges de couleur et un bandeau d'alerte vous informent en un coup d'œil de l'état de votre matériel.
*   **Analyse par IA :** Obtenez une analyse de sécurité sur l'état de votre équipement en téléversant une simple photo. Le modèle identifie les points d'usure potentiels et fournit des recommandations.
*   **Authentification Sécurisée :** Inscrivez-vous et connectez-vous via une API Spring sécurisée par JWT.
*   **Interface Moderne :** Une interface claire et réactive avec un mode sombre.

## Stack Technique

*   **Framework :** [Next.js](https://nextjs.org/) (App Router)
*   **UI :** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend :** API Spring Boot (JWT, base de données relationnelle)
*   **Fonctionnalités IA :** [Google Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)

---

## Installation et Lancement en Local

Pour faire fonctionner ce projet sur votre machine, suivez ces étapes.

### Prérequis

*   [Node.js](https://nodejs.org/) (version 20.x ou supérieure)
*   Un gestionnaire de paquets comme `npm` ou `yarn`.

### 1. Cloner le Dépôt

```bash
git clone <URL_DU_REPO>
cd <NOM_DU_DOSSIER>
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configurer les Clés d'API

Vous avez besoin d'une URL pour l'API Spring et d'une clé Google AI (Gemini).

1.  **Créez un fichier `.env`** à la racine du projet.
2.  **Définissez l'URL de l'API :**
    *   `NEXT_PUBLIC_API_URL=http://localhost:8080`
3.  **Clé Google AI (Gemini) :**
    *   Allez sur [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Cliquez sur **`Create API key`** et copiez la clé générée.
4.  **Exemple de fichier `.env`** :

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
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
