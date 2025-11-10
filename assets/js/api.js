// ===== TPN QUIZ - API MANAGER =====
// Gestionnaire de toutes les requêtes API vers le serveur du professeur

// Configuration de l'API
const API_CONFIG = {
    BASE_URL: 'https://quizz.adrardev.fr',
    ENDPOINTS: {
        // Authentification
        LOGIN: '/api/login_check',
        REGISTER: '/api/user',
        ME: '/api/me',
        
        // Utilisateurs
        USERS: '/api/users',
        USER: '/api/user',
        
        // Catégories
        CATEGORIES: '/api/category/all',
        CATEGORY: '/api/category',
        
        // Questions
        QUESTIONS: '/api/question/all',
        QUESTION: '/api/question',
        
        // Quiz
        QUIZZES: '/api/quizz/all',
        QUIZ: '/api/quizz'
    }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Récupère le token JWT depuis le localStorage
 */
function getToken() {
    return localStorage.getItem('tpn_token');
}

/**
 * Sauvegarde le token JWT dans le localStorage
 */
function setToken(token) {
    localStorage.setItem('tpn_token', token);
}

/**
 * Supprime le token JWT du localStorage
 */
function removeToken() {
    localStorage.removeItem('tpn_token');
    localStorage.removeItem('tpn_user');
}

/**
 * Récupère les informations utilisateur depuis le localStorage
 */
function getUser() {
    const user = localStorage.getItem('tpn_user');
    return user ? JSON.parse(user) : null;
}

/**
 * Sauvegarde les informations utilisateur dans le localStorage
 */
function setUser(user) {
    localStorage.setItem('tpn_user', JSON.stringify(user));
}

/**
 * Crée les headers pour les requêtes API
 */
function getHeaders(includeAuth = false) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `bearer ${token}`;
        }
    }
    
    return headers;
}

/**
 * Gère les erreurs API et affiche un message approprié
 */
function handleApiError(error, response = null) {
    console.error('API Error:', error);
    
    if (response) {
        // Si on a une réponse avec un message d'erreur
        if (response.message) {
            return response.message;
        }
        if (response.error) {
            return response.error;
        }
    }
    
    // Messages d'erreur par défaut
    if (error.message === 'Failed to fetch') {
        return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    }
    
    return 'Une erreur est survenue. Veuillez réessayer.';
}

// ===== AUTHENTICATION API =====

/**
 * Connexion utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} - Token JWT et informations utilisateur
 */
async function apiLogin(email, password) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                username: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        // Sauvegarder le token
        if (data.token) {
            setToken(data.token);
            
            // Récupérer les informations de l'utilisateur
            const userInfo = await apiGetMe();
            return { success: true, user: userInfo };
        }
        
        return { success: true, token: data.token };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur (firstname, lastname, email, password)
 * @returns {Promise<Object>} - Informations de l'utilisateur créé
 */
async function apiRegister(userData) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, user: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object>} - Informations de l'utilisateur
 */
async function apiGetMe() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ME}`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        // Sauvegarder les informations utilisateur
        setUser(data);
        
        return data;
        
    } catch (error) {
        console.error('Error getting user info:', error);
        return null;
    }
}

// ===== USERS API =====

/**
 * Récupère la liste de tous les utilisateurs (nécessite authentification)
 * @returns {Promise<Array>} - Liste des utilisateurs
 */
async function apiGetUsers() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
            method: 'GET',
            headers: getHeaders(true)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, users: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== CATEGORIES API =====

/**
 * Récupère toutes les catégories de quiz
 * @returns {Promise<Array>} - Liste des catégories
 */
async function apiGetCategories() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, categories: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Ajoute une nouvelle catégorie (nécessite authentification)
 * @param {string} title - Titre de la catégorie
 * @returns {Promise<Object>} - Catégorie créée
 */
async function apiCreateCategory(title) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORY}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify({ title })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, category: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== QUESTIONS API =====

/**
 * Récupère toutes les questions
 * @returns {Promise<Array>} - Liste des questions avec réponses
 */
async function apiGetQuestions() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUESTIONS}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, questions: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Ajoute une nouvelle question (nécessite authentification)
 * @param {Object} questionData - Données de la question
 * @returns {Promise<Object>} - Question créée
 */
async function apiCreateQuestion(questionData) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUESTION}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(questionData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, question: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== QUIZ API =====

/**
 * Récupère tous les quiz
 * @returns {Promise<Array>} - Liste des quiz
 */
async function apiGetQuizzes() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZZES}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, quizzes: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Récupère un quiz par son ID
 * @param {number} quizId - ID du quiz
 * @returns {Promise<Object>} - Détails du quiz
 */
async function apiGetQuiz(quizId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZ}/${quizId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, quiz: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Crée un nouveau quiz (nécessite authentification)
 * @param {Object} quizData - Données du quiz
 * @returns {Promise<Object>} - Quiz créé
 */
async function apiCreateQuiz(quizData) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.QUIZ}`, {
            method: 'POST',
            headers: getHeaders(true),
            body: JSON.stringify(quizData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(handleApiError(null, data));
        }
        
        return { success: true, quiz: data };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ===== EXPORT FUNCTIONS =====

// Rendre les fonctions disponibles globalement
window.API = {
    // Auth
    login: apiLogin,
    register: apiRegister,
    getMe: apiGetMe,
    
    // Users
    getUsers: apiGetUsers,
    
    // Categories
    getCategories: apiGetCategories,
    createCategory: apiCreateCategory,
    
    // Questions
    getQuestions: apiGetQuestions,
    createQuestion: apiCreateQuestion,
    
    // Quiz
    getQuizzes: apiGetQuizzes,
    getQuiz: apiGetQuiz,
    createQuiz: apiCreateQuiz,
    
    // Utils
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getUser: getUser,
    setUser: setUser
};

console.log('API Manager chargé et prêt !');

