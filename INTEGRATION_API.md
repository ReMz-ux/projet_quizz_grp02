# 🚀 Guide d'Intégration API - TPN Quiz

## 📋 Vue d'ensemble

Votre site est maintenant entièrement connecté à l'API du professeur (`https://quizz.adrardev.fr`). Ce document explique comment tout fonctionne et comment tester.

---

## 🗂️ Structure des Fichiers

### Fichiers JavaScript créés :

1. **`assets/js/api.js`** 
   - Gère toutes les communications avec l'API
   - Contient toutes les fonctions pour appeler les endpoints
   - Gère l'authentification JWT

2. **`assets/js/script.js`** (modifié)
   - Connecté à l'API pour login/register
   - Utilise les vraies fonctions API

3. **`assets/js/dashboard.js`**
   - Charge et affiche les quiz depuis l'API
   - Gère l'interface du dashboard

4. **`assets/js/quiz-play.js`**
   - Charge un quiz spécifique
   - Gère le déroulement du quiz
   - Calcule et sauvegarde les résultats

5. **`assets/js/quiz-list.js`**
   - Affiche la liste des quiz filtrés par catégorie
   - Charge les quiz depuis l'API

---

## 🔐 Authentification

### Comment ça marche :

1. L'utilisateur remplit le formulaire de connexion (`login.html`)
2. Le script appelle `API.login(email, password)`
3. L'API retourne un **token JWT**
4. Le token est sauvegardé dans le `localStorage`
5. Toutes les requêtes suivantes incluent ce token

### Compte de test fourni par le prof :
```
Email: adm@test.com
Mot de passe: password
```

---

## 📡 Fonctions API Disponibles

### Authentification
```javascript
// Connexion
const result = await API.login(email, password);
// Retourne: { success: true, user: {...}, token: "..." }

// Inscription
const result = await API.register({
    firstname: "Prénom",
    lastname: "Nom",
    email: "email@mail.com",
    password: "password"
});

// Récupérer les infos de l'utilisateur connecté
const user = await API.getMe();
```

### Quiz
```javascript
// Récupérer tous les quiz
const result = await API.getQuizzes();
// Retourne: { success: true, quizzes: [...] }

// Récupérer un quiz spécifique
const result = await API.getQuiz(quizId);
// Retourne: { success: true, quiz: {...} }

// Créer un quiz (nécessite authentification)
const result = await API.createQuiz({
    title: "Mon Quiz",
    description: "Description",
    categories: [{ id: 1 }],
    questions: [{ id: 1 }, { id: 2 }]
});
```

### Catégories
```javascript
// Récupérer toutes les catégories
const result = await API.getCategories();

// Créer une catégorie (nécessite authentification)
const result = await API.createCategory("Nom de la catégorie");
```

### Questions
```javascript
// Récupérer toutes les questions
const result = await API.getQuestions();

// Créer une question (nécessite authentification)
const result = await API.createQuestion({
    title: "Question ?",
    description: "Description de la question",
    pointNumber: 5,
    answers: [
        { text: "Réponse 1", valid: true },
        { text: "Réponse 2", valid: false }
    ]
});
```

### Utilisateurs
```javascript
// Récupérer tous les utilisateurs (nécessite authentification)
const result = await API.getUsers();
```

---

## 🔄 Flux de l'Application

### 1. Page d'accueil (`index.html`)
- Affiche la page publique
- Boutons pour login/register

### 2. Connexion (`login.html`)
- ✅ **Connecté à l'API**
- Formulaire envoie les données à l'API réelle
- Sauvegarde le token JWT
- Redirige vers le dashboard approprié

### 3. Inscription (`register.html`)
- ✅ **Connecté à l'API**
- Crée un nouveau compte via l'API
- Redirige vers la page de connexion

### 4. Dashboard Étudiant (`student-dashboard.html`)
- ✅ **Connecté à l'API**
- Charge les quiz depuis l'API
- Affiche les informations de l'utilisateur
- Permet de lancer un quiz

### 5. Liste des Quiz (`quiz-list.html`)
- ✅ **Connecté à l'API**
- Charge et filtre les quiz par catégorie
- Affiche les détails de chaque quiz

### 6. Jouer au Quiz (`quiz-play.html`)
- ✅ **Connecté à l'API**
- Charge les questions depuis l'API
- Gère le timer et la navigation
- Calcule le score
- Sauvegarde les résultats

---

## 🧪 Comment Tester

### Étape 1 : Tester l'inscription
1. Ouvrez `register.html` dans votre navigateur
2. Remplissez le formulaire :
   - Nom : Test
   - Prénom : Utilisateur
   - Email : test@test.fr
   - Mot de passe : password123
   - Type : Stagiaire
3. Cliquez sur "S'inscrire"
4. Vous devriez voir un message de succès et être redirigé vers login.html

### Étape 2 : Tester la connexion
1. Ouvrez `login.html`
2. Utilisez le compte du prof :
   - Email : `adm@test.com`
   - Mot de passe : `password`
   - Type : Stagiaire
3. Cliquez sur "Se connecter"
4. Vous devriez être redirigé vers le dashboard

### Étape 3 : Tester le dashboard
1. Sur le dashboard, vous devriez voir :
   - Votre nom dans le header
   - Les quiz chargés depuis l'API
   - Un message de bienvenue

### Étape 4 : Tester le quiz
1. Cliquez sur "Commencer" sur un quiz
2. Vous devriez voir les questions chargées depuis l'API
3. Répondez aux questions
4. Cliquez sur "Suivant" puis "Terminer"
5. Vous devriez voir vos résultats

---

## 🐛 Débogage

### Ouvrir la console du navigateur
- **Chrome/Edge** : F12 ou Clic droit > Inspecter
- **Firefox** : F12
- Dans l'onglet "Console", vous verrez :
  - Les requêtes API
  - Les réponses
  - Les erreurs éventuelles

### Messages de la console :
```
✅ "API Manager chargé et prêt !"
✅ "Dashboard Manager chargé et prêt !"
✅ "Quiz chargés: [...]"
❌ "API Error: ..."
```

### Vérifier le token JWT :
```javascript
// Dans la console du navigateur :
console.log(localStorage.getItem('tpn_token'));
```

### Vérifier les infos utilisateur :
```javascript
// Dans la console du navigateur :
console.log(JSON.parse(localStorage.getItem('tpn_user')));
```

---

## ⚠️ Problèmes Courants

### 1. Erreur CORS
**Symptôme** : `Access to fetch at '...' has been blocked by CORS policy`

**Solution** : L'API du prof devrait déjà gérer CORS. Si le problème persiste, contactez le professeur.

### 2. Token expiré
**Symptôme** : `"message": "Expired JWT Token"`

**Solution** : Reconnectez-vous pour obtenir un nouveau token.

### 3. Token invalide
**Symptôme** : `"message": "Invalid JWT Token"`

**Solution** : Supprimez le token et reconnectez-vous :
```javascript
localStorage.removeItem('tpn_token');
localStorage.removeItem('tpn_user');
```

### 4. Aucun quiz ne s'affiche
**Causes possibles** :
- L'API n'a pas encore de quiz
- Le filtre de catégorie ne correspond à rien
- Erreur de connexion

**Solution** : Vérifiez la console pour voir les erreurs.

---

## 📝 Structure d'un Quiz (Retour API)

```javascript
{
    "id": 1,
    "title": "Quiz HTML",
    "description": "Test vos connaissances",
    "categories": [
        { "id": 1, "title": "HTML" }
    ],
    "questions": [
        {
            "id": 1,
            "title": "Quelle balise pour un paragraphe ?",
            "description": "Question sur les balises",
            "value": 5,
            "answers": [
                { "id": 1, "text": "<p>", "valid": true },
                { "id": 2, "text": "<para>", "valid": false }
            ]
        }
    ]
}
```

---

## 🎯 Prochaines Étapes

### Pour améliorer le projet :

1. **Ajouter la gestion des résultats**
   - Enregistrer les résultats dans l'API
   - Afficher l'historique des quiz

2. **Dashboard formateur**
   - Créer/modifier des quiz
   - Voir les statistiques des étudiants

3. **Améliorer l'UX**
   - Loading states
   - Messages d'erreur plus détaillés
   - Animations

4. **Optimisations**
   - Cacher les quiz déjà chargés
   - Pagination pour les grandes listes
   - Recherche de quiz

---

## 📞 Support

Si vous avez des questions ou des problèmes :

1. Vérifiez d'abord la console du navigateur
2. Regardez la documentation de l'API du prof
3. Testez les endpoints avec Postman ou Thunder Client
4. Demandez au prof si l'API fonctionne correctement

---

## ✅ Checklist de Déploiement

Avant de pousser sur GitHub :

- [x] Tous les fichiers API sont créés
- [x] Login/Register connectés à l'API
- [x] Dashboard charge les quiz
- [x] Quiz-play fonctionne avec l'API
- [x] Gestion des erreurs en place
- [x] Documentation créée

---

**🎉 Félicitations ! Votre site est maintenant entièrement connecté à l'API !**

