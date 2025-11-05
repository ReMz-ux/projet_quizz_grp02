// ===== API CONFIGURATION EXAMPLE =====
// Copiez ce fichier vers api-config.js et configurez vos endpoints

const API_CONFIG = {
    // Base URL de l'API
    BASE_URL: 'http://localhost:3000/api',
    
    // Endpoints d'authentification
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VERIFY_EMAIL: '/auth/verify-email',
        RESET_PASSWORD: '/auth/reset-password',
        CHANGE_PASSWORD: '/auth/change-password'
    },
    
    // Endpoints des quiz
    QUIZ: {
        // Récupérer tous les quiz
        GET_ALL: '/quiz',
        // Récupérer un quiz par ID
        GET_BY_ID: (id) => `/quiz/${id}`,
        // Récupérer les quiz par catégorie
        GET_BY_CATEGORY: (category) => `/quiz/category/${category}`,
        // Récupérer les quiz par difficulté
        GET_BY_DIFFICULTY: (difficulty) => `/quiz/difficulty/${difficulty}`,
        // Créer un quiz (formateur)
        CREATE: '/quiz',
        // Modifier un quiz (formateur)
        UPDATE: (id) => `/quiz/${id}`,
        // Supprimer un quiz (formateur)
        DELETE: (id) => `/quiz/${id}`,
        // Rechercher des quiz
        SEARCH: '/quiz/search',
        // Quiz populaires
        POPULAR: '/quiz/popular',
        // Quiz récents
        RECENT: '/quiz/recent'
    },
    
    // Endpoints des questions
    QUESTIONS: {
        // Récupérer les questions d'un quiz
        GET_BY_QUIZ: (quizId) => `/quiz/${quizId}/questions`,
        // Ajouter une question
        ADD: (quizId) => `/quiz/${quizId}/questions`,
        // Modifier une question
        UPDATE: (quizId, questionId) => `/quiz/${quizId}/questions/${questionId}`,
        // Supprimer une question
        DELETE: (quizId, questionId) => `/quiz/${quizId}/questions/${questionId}`
    },
    
    // Endpoints des tentatives de quiz
    ATTEMPTS: {
        // Démarrer un quiz
        START: '/attempts/start',
        // Soumettre une réponse
        SUBMIT_ANSWER: (attemptId) => `/attempts/${attemptId}/answer`,
        // Terminer un quiz
        FINISH: (attemptId) => `/attempts/${attemptId}/finish`,
        // Récupérer les résultats
        GET_RESULT: (attemptId) => `/attempts/${attemptId}/result`,
        // Historique des tentatives
        GET_HISTORY: '/attempts/history',
        // Tentative par ID
        GET_BY_ID: (attemptId) => `/attempts/${attemptId}`
    },
    
    // Endpoints des utilisateurs
    USERS: {
        // Profil de l'utilisateur connecté
        GET_PROFILE: '/users/profile',
        // Mettre à jour le profil
        UPDATE_PROFILE: '/users/profile',
        // Récupérer tous les utilisateurs (formateur)
        GET_ALL: '/users',
        // Utilisateur par ID
        GET_BY_ID: (userId) => `/users/${userId}`,
        // Bannir un utilisateur (formateur)
        BAN: (userId) => `/users/${userId}/ban`,
        // Débannir un utilisateur (formateur)
        UNBAN: (userId) => `/users/${userId}/unban`,
        // Supprimer un utilisateur (formateur)
        DELETE: (userId) => `/users/${userId}`,
        // Statistiques utilisateur
        GET_STATS: (userId) => `/users/${userId}/stats`
    },
    
    // Endpoints des statistiques
    STATS: {
        // Statistiques personnelles
        PERSONAL: '/stats/personal',
        // Statistiques globales (formateur)
        GLOBAL: '/stats/global',
        // Statistiques par catégorie
        BY_CATEGORY: '/stats/by-category',
        // Classement
        LEADERBOARD: '/stats/leaderboard',
        // Progression
        PROGRESS: '/stats/progress'
    },
    
    // Endpoints des commentaires
    COMMENTS: {
        // Récupérer les commentaires d'un quiz
        GET_BY_QUIZ: (quizId) => `/quiz/${quizId}/comments`,
        // Ajouter un commentaire
        ADD: (quizId) => `/quiz/${quizId}/comments`,
        // Modifier un commentaire
        UPDATE: (quizId, commentId) => `/quiz/${quizId}/comments/${commentId}`,
        // Supprimer un commentaire
        DELETE: (quizId, commentId) => `/quiz/${quizId}/comments/${commentId}`,
        // Modérer un commentaire (formateur)
        MODERATE: (commentId) => `/comments/${commentId}/moderate`
    },
    
    // Endpoints des badges
    BADGES: {
        // Récupérer tous les badges disponibles
        GET_ALL: '/badges',
        // Badges de l'utilisateur
        GET_USER_BADGES: '/badges/user',
        // Débloquer un badge
        UNLOCK: (badgeId) => `/badges/${badgeId}/unlock`
    },
    
    // Endpoints des catégories
    CATEGORIES: {
        // Récupérer toutes les catégories
        GET_ALL: '/categories',
        // Catégorie par ID
        GET_BY_ID: (categoryId) => `/categories/${categoryId}`,
        // Créer une catégorie (formateur)
        CREATE: '/categories',
        // Modifier une catégorie (formateur)
        UPDATE: (categoryId) => `/categories/${categoryId}`,
        // Supprimer une catégorie (formateur)
        DELETE: (categoryId) => `/categories/${categoryId}`
    },
    
    // Configuration des en-têtes
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Timeout des requêtes (en millisecondes)
    TIMEOUT: 10000,
    
    // Clé pour le stockage local
    STORAGE_KEYS: {
        TOKEN: 'tpn_token',
        USER: 'tpn_user',
        THEME: 'tpn_theme'
    }
};

// ===== HELPER FUNCTIONS =====

// Fonction pour construire l'URL complète
function buildUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Fonction pour obtenir les en-têtes avec token
function getHeaders() {
    const token = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
    const headers = { ...API_CONFIG.HEADERS };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Fonction pour faire une requête GET
async function apiGet(endpoint) {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: 'GET',
            headers: getHeaders(),
            timeout: API_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API GET Error:', error);
        throw error;
    }
}

// Fonction pour faire une requête POST
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
            timeout: API_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API POST Error:', error);
        throw error;
    }
}

// Fonction pour faire une requête PUT
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
            timeout: API_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API PUT Error:', error);
        throw error;
    }
}

// Fonction pour faire une requête DELETE
async function apiDelete(endpoint) {
    try {
        const response = await fetch(buildUrl(endpoint), {
            method: 'DELETE',
            headers: getHeaders(),
            timeout: API_CONFIG.TIMEOUT
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API DELETE Error:', error);
        throw error;
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        buildUrl,
        getHeaders,
        apiGet,
        apiPost,
        apiPut,
        apiDelete
    };
}



