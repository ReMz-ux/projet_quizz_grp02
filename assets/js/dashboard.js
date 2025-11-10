// ===== TPN QUIZ - DASHBOARD =====
// Gestion du dashboard étudiant et formateur

// ===== DASHBOARD INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier que l'utilisateur est connecté
    const user = API.getUser();
    
    if (!user) {
        showToast('Vous devez être connecté pour accéder à cette page', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Mettre à jour l'interface avec les infos utilisateur
    updateUserInterface(user);
    
    // Charger les quiz (version simulée pour le développement)
    loadMockQuizzes();
    
    // Charger les catégories
    await loadCategories();
});

// ===== USER INTERFACE =====

/**
 * Met à jour l'interface avec les informations de l'utilisateur
 */
function updateUserInterface(user) {
    const fullName = `${user.firstname} ${user.lastname}`;
    
    // Mettre à jour le nom d'utilisateur dans le header
    const userNameElements = document.querySelectorAll('.user-info span');
    userNameElements.forEach(element => {
        element.textContent = fullName;
    });
    
    // Mettre à jour le nom dans le profil
    const profileNameElements = document.querySelectorAll('.profile-info h2');
    profileNameElements.forEach(element => {
        element.textContent = fullName;
    });
    
    // Mettre à jour tous les endroits avec "stagiaire XX" ou "formateur XX"
    document.querySelectorAll('*').forEach(element => {
        // Ne traiter que les nœuds texte
        element.childNodes.forEach(node => {
            if (node.nodeType === 3) { // Text node
                const text = node.textContent;
                // Remplacer "stagiaire XX" par le vrai nom
                if (text.match(/stagiaire \d+/i)) {
                    node.textContent = text.replace(/stagiaire \d+/i, fullName);
                }
                // Remplacer "formateur XX" par le vrai nom
                if (text.match(/formateur \d+/i)) {
                    node.textContent = text.replace(/formateur \d+/i, fullName);
                }
            }
        });
    });
    
    // Mettre à jour l'email dans l'alerte
    const alertElements = document.querySelectorAll('.alert span');
    alertElements.forEach(element => {
        if (element.textContent.includes('connecté')) {
            const userType = user.type === 'stagiaire' ? 'stagiaire' : 'formateur';
            element.textContent = `vous êtes connecté en tant que ${userType} : ${fullName}`;
        }
    });
}

// ===== QUIZ LOADING =====

/**
 * Charge les quiz simulés (pour le développement)
 */
function loadMockQuizzes() {
    console.log('Chargement des quiz simulés...');
    
    // Quiz simulés avec différentes catégories et difficultés
    const mockQuizzes = [
        {
            id: 1,
            title: 'Les bases du HTML',
            description: 'Testez vos connaissances sur les bases du HTML5',
            difficulty: 'facile',
            categories: [{ id: 1, title: 'HTML' }],
            questions: Array(10).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 2,
            title: 'CSS Flexbox',
            description: 'Maîtrisez le système de mise en page Flexbox',
            difficulty: 'intermediaire',
            categories: [{ id: 2, title: 'CSS' }],
            questions: Array(15).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 3,
            title: 'JavaScript ES6+',
            description: 'Les fonctionnalités avancées de JavaScript ES6+',
            difficulty: 'difficile',
            categories: [{ id: 3, title: 'JavaScript' }],
            questions: Array(20).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 4,
            title: 'HTML Sémantique',
            description: 'Apprenez à utiliser les balises sémantiques HTML5',
            difficulty: 'facile',
            categories: [{ id: 1, title: 'HTML' }],
            questions: Array(12).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 5,
            title: 'CSS Grid Layout',
            description: 'Créez des mises en page complexes avec CSS Grid',
            difficulty: 'intermediaire',
            categories: [{ id: 2, title: 'CSS' }],
            questions: Array(15).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 6,
            title: 'React Hooks',
            description: 'Maîtrisez les hooks useState, useEffect et autres',
            difficulty: 'difficile',
            categories: [{ id: 4, title: 'React' }],
            questions: Array(18).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 7,
            title: 'SQL de base',
            description: 'Apprenez les requêtes SQL fondamentales',
            difficulty: 'facile',
            categories: [{ id: 5, title: 'SQL' }],
            questions: Array(10).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 8,
            title: 'PHP POO',
            description: 'Programmation orientée objet en PHP',
            difficulty: 'intermediaire',
            categories: [{ id: 6, title: 'PHP' }],
            questions: Array(15).fill(null).map((_, i) => ({ id: i + 1 }))
        },
        {
            id: 9,
            title: 'Java Avancé',
            description: 'Concepts avancés de Java et design patterns',
            difficulty: 'difficile',
            categories: [{ id: 7, title: 'Java' }],
            questions: Array(20).fill(null).map((_, i) => ({ id: i + 1 }))
        }
    ];
    
    displayQuizzes(mockQuizzes);
    console.log('Quiz simulés chargés:', mockQuizzes);
}

/**
 * Charge tous les quiz depuis l'API (désactivé pour l'instant)
 */
async function loadQuizzesFromAPI() {
    try {
        showToast('Chargement des quiz...', 'info');
        
        const result = await API.getQuizzes();
        
        if (result.success && result.quizzes) {
            console.log('Quiz chargés:', result.quizzes);
            displayQuizzes(result.quizzes);
            showToast('Quiz chargés avec succès !', 'success');
        } else {
            console.error('Erreur lors du chargement des quiz:', result.error);
            showToast(result.error || 'Erreur lors du chargement des quiz', 'error');
            displayNoQuizzes();
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des quiz', 'error');
        displayNoQuizzes();
    }
}

/**
 * Affiche les quiz dans le dashboard
 */
function displayQuizzes(quizzes) {
    const container = document.querySelector('.cards-grid');
    
    if (!container) {
        console.log('Conteneur de quiz non trouvé');
        return;
    }
    
    // Vider le conteneur
    container.innerHTML = '';
    
    if (!quizzes || quizzes.length === 0) {
        displayNoQuizzes();
        return;
    }
    
    // Limiter à 3 quiz pour le dashboard (les plus récents)
    const recentQuizzes = quizzes.slice(0, 3);
    
    recentQuizzes.forEach(quiz => {
        const card = createQuizCard(quiz);
        container.appendChild(card);
    });
}

/**
 * Crée une carte de quiz
 */
function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    
    // Déterminer le niveau de difficulté
    const difficulty = quiz.difficulty || 'facile';
    const difficultyClass = `badge-${difficulty}`;
    const difficultyNames = {
        'facile': 'Facile',
        'intermediaire': 'Intermédiaire',
        'difficile': 'Difficile',
        'expert': 'Expert'
    };
    const difficultyName = difficultyNames[difficulty] || 'Facile';
    
    // Calculer le nombre de questions
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    
    // Calculer le temps estimé (2 min par question par défaut)
    const estimatedTime = questionCount * 2;
    
    // Obtenir les catégories
    const categories = quiz.categories ? quiz.categories.map(cat => cat.title).join(', ') : 'Non catégorisé';
    
    // Nombre de joueurs simulé
    const players = Math.floor(Math.random() * 200) + 50;
    
    card.innerHTML = `
        <div class="quiz-header">
            <div>
                <h3 class="quiz-title">${quiz.title || 'Quiz sans titre'}</h3>
                <span class="quiz-badge ${difficultyClass}">${difficultyName}</span>
            </div>
        </div>
        <div class="quiz-meta">
            <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
            <span><i class="fas fa-clock"></i> ${estimatedTime} min</span>
            <span><i class="fas fa-users"></i> ${players} joueurs</span>
        </div>
        <p class="quiz-description">
            ${quiz.description || 'Aucune description disponible'}
        </p>
        <div class="quiz-actions">
            <a href="quiz-play.html?id=${quiz.id}" class="btn btn-secondary btn-small">
                <i class="fas fa-play"></i> Commencer
            </a>
            <button class="btn btn-outline btn-small" style="color: var(--text-dark); border-color: var(--medium-gray);" onclick="viewQuizDetails(${quiz.id})">
                <i class="fas fa-info-circle"></i> Détails
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Affiche un message quand il n'y a pas de quiz
 */
function displayNoQuizzes() {
    const container = document.querySelector('.cards-grid');
    
    if (!container) return;
    
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <i class="fas fa-inbox" style="font-size: 4rem; color: var(--medium-gray); margin-bottom: 20px;"></i>
            <h3 style="color: var(--text-dark); margin-bottom: 10px;">Aucun quiz disponible</h3>
            <p style="color: var(--medium-gray);">Les quiz seront bientôt disponibles.</p>
        </div>
    `;
}

// ===== CATEGORIES LOADING =====

/**
 * Charge les catégories depuis l'API
 */
async function loadCategories() {
    try {
        const result = await API.getCategories();
        
        if (result.success && result.categories) {
            console.log('Catégories chargées:', result.categories);
            updateSidebarCategories(result.categories);
        } else {
            console.log('Aucune catégorie disponible ou erreur:', result.error);
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
    }
}

/**
 * Met à jour la sidebar avec les catégories de l'API
 */
function updateSidebarCategories(categories) {
    // Pour l'instant, on garde les catégories statiques
    // On peut les mettre à jour dynamiquement plus tard
    console.log('Catégories disponibles:', categories);
}

// ===== QUIZ DETAILS =====

/**
 * Affiche les détails d'un quiz
 */
async function viewQuizDetails(quizId) {
    try {
        showToast('Chargement des détails...', 'info');
        
        const result = await API.getQuiz(quizId);
        
        if (result.success && result.quiz) {
            const quiz = result.quiz;
            
            // Créer une modal avec les détails
            const modal = createQuizDetailsModal(quiz);
            document.body.appendChild(modal);
            
        } else {
            showToast(result.error || 'Erreur lors du chargement des détails', 'error');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des détails', 'error');
    }
}

/**
 * Crée une modal avec les détails du quiz
 */
function createQuizDetailsModal(quiz) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    const categories = quiz.categories ? quiz.categories.map(cat => cat.title).join(', ') : 'Non catégorisé';
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">${quiz.title}</h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--medium-gray);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <p style="color: var(--medium-gray); margin-bottom: 20px;">
                ${quiz.description || 'Aucune description disponible'}
            </p>
            
            <div style="display: grid; gap: 15px; margin-bottom: 20px;">
                <div style="padding: 15px; background: var(--light-gray); border-radius: 8px;">
                    <strong><i class="fas fa-question-circle"></i> Questions:</strong> ${questionCount}
                </div>
                <div style="padding: 15px; background: var(--light-gray); border-radius: 8px;">
                    <strong><i class="fas fa-tag"></i> Catégories:</strong> ${categories}
                </div>
                <div style="padding: 15px; background: var(--light-gray); border-radius: 8px;">
                    <strong><i class="fas fa-clock"></i> Temps estimé:</strong> ${questionCount * 2} minutes
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="this.closest('.modal').remove()" class="btn btn-outline" style="color: var(--text-dark); border-color: var(--medium-gray);">
                    Fermer
                </button>
                <a href="quiz-play.html?id=${quiz.id}" class="btn btn-secondary">
                    <i class="fas fa-play"></i> Commencer le quiz
                </a>
            </div>
        </div>
    `;
    
    // Fermer la modal en cliquant sur le fond
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// ===== EXPORT FUNCTIONS =====

window.viewQuizDetails = viewQuizDetails;
window.loadQuizzes = loadQuizzes;

console.log('Dashboard Manager chargé et prêt !');

