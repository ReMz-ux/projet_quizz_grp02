// ===== TPN QUIZ - QUIZ LIST =====
// Gestion de la liste des quiz par catégorie

// Configuration des catégories
const categories = {
    'html': { name: 'HTML', icon: 'fab fa-html5', color: '#e74c3c' },
    'css': { name: 'CSS', icon: 'fab fa-css3-alt', color: '#3498db' },
    'js': { name: 'JavaScript', icon: 'fab fa-js', color: '#f1c40f' },
    'javascript': { name: 'JavaScript', icon: 'fab fa-js', color: '#f1c40f' },
    'react': { name: 'React', icon: 'fab fa-react', color: '#61dafb' },
    'java': { name: 'Java', icon: 'fab fa-java', color: '#f89820' },
    'sql': { name: 'SQL', icon: 'fas fa-database', color: '#00758f' },
    'php': { name: 'PHP', icon: 'fab fa-php', color: '#777bb3' }
};

const difficulties = {
    'facile': { name: 'Facile', displayName: 'Facile' },
    'intermediaire': { name: 'Intermédiaire', displayName: 'Intermédiaire' },
    'difficile': { name: 'Difficile', displayName: 'Difficile' },
    'expert': { name: 'Expert', displayName: 'Expert' }
};

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'html';
    const difficulty = urlParams.get('difficulty') || 'facile';
    
    // Mettre à jour l'interface
    updatePageInterface(category, difficulty);
    
    // Charger les quiz depuis l'API
    await loadQuizzesFromAPI(category, difficulty);
});

// ===== UI UPDATE =====

/**
 * Met à jour l'interface de la page
 */
function updatePageInterface(category, difficulty) {
    const categoryData = categories[category.toLowerCase()] || categories['html'];
    const difficultyData = difficulties[difficulty.toLowerCase()] || difficulties['facile'];
    
    // Mettre à jour le breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = categoryData.name;
        breadcrumbCategory.href = `quiz-category.html?category=${category}`;
    }
    
    const breadcrumbDifficulty = document.getElementById('breadcrumbDifficulty');
    if (breadcrumbDifficulty) {
        breadcrumbDifficulty.textContent = difficultyData.displayName;
    }
    
    // Mettre à jour l'icône et le titre
    const pageIcon = document.getElementById('pageIcon');
    if (pageIcon) {
        pageIcon.className = categoryData.icon;
        pageIcon.style.color = categoryData.color;
    }
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.innerHTML = `<i class="${categoryData.icon}" style="color: ${categoryData.color};"></i> Quiz ${categoryData.name} - ${difficultyData.displayName}`;
    }
    
    // Mettre à jour la sidebar
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(`category=${category}`)) {
            link.classList.add('active');
        }
    });
}

// ===== QUIZ LOADING =====

/**
 * Charge les quiz depuis l'API
 */
async function loadQuizzesFromAPI(category, difficulty) {
    try {
        showToast('Chargement des quiz...', 'info');
        
        const result = await API.getQuizzes();
        
        if (result.success && result.quizzes) {
            console.log('Quiz chargés:', result.quizzes);
            
            // Filtrer les quiz par catégorie
            const filteredQuizzes = filterQuizzesByCategory(result.quizzes, category);
            
            // Afficher les quiz
            displayQuizzes(filteredQuizzes, difficulty);
            
            // Mettre à jour le compteur
            const quizCount = document.getElementById('quizCount');
            if (quizCount) {
                quizCount.textContent = filteredQuizzes.length;
            }
            
            showToast('Quiz chargés avec succès !', 'success');
        } else {
            console.error('Erreur:', result.error);
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
 * Filtre les quiz par catégorie
 */
function filterQuizzesByCategory(quizzes, category) {
    if (!category || category === 'all') {
        return quizzes;
    }
    
    return quizzes.filter(quiz => {
        if (!quiz.categories || quiz.categories.length === 0) {
            return false;
        }
        
        return quiz.categories.some(cat => 
            cat.title.toLowerCase() === category.toLowerCase() ||
            cat.title.toLowerCase().includes(category.toLowerCase())
        );
    });
}

// ===== QUIZ DISPLAY =====

/**
 * Affiche les quiz
 */
function displayQuizzes(quizzes, difficulty) {
    const container = document.getElementById('quizCardsContainer');
    
    if (!container) {
        console.error('Conteneur de quiz non trouvé');
        return;
    }
    
    container.innerHTML = '';
    
    if (!quizzes || quizzes.length === 0) {
        displayNoQuizzes();
        return;
    }
    
    quizzes.forEach(quiz => {
        const card = createQuizCard(quiz, difficulty);
        container.appendChild(card);
    });
}

/**
 * Crée une carte de quiz
 */
function createQuizCard(quiz, difficulty) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    
    const difficultyClass = `badge-${difficulty}`;
    const difficultyData = difficulties[difficulty] || difficulties['facile'];
    
    const questionCount = quiz.questions ? quiz.questions.length : 0;
    const estimatedTime = questionCount * 2;
    const categories = quiz.categories ? quiz.categories.map(cat => cat.title).join(', ') : 'Non catégorisé';
    
    card.innerHTML = `
        <div class="quiz-header">
            <div>
                <h3 class="quiz-title">${quiz.title || 'Quiz sans titre'}</h3>
                <span class="quiz-badge ${difficultyClass}">${difficultyData.displayName}</span>
            </div>
        </div>
        <div class="quiz-meta">
            <span><i class="fas fa-question-circle"></i> ${questionCount} questions</span>
            <span><i class="fas fa-clock"></i> ${estimatedTime} min</span>
            <span><i class="fas fa-tag"></i> ${categories}</span>
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
    const container = document.getElementById('quizCardsContainer');
    
    if (!container) return;
    
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <i class="fas fa-inbox" style="font-size: 4rem; color: var(--medium-gray); margin-bottom: 20px;"></i>
            <h3 style="color: var(--text-dark); margin-bottom: 10px;">Aucun quiz disponible</h3>
            <p style="color: var(--medium-gray);">Il n'y a pas encore de quiz pour cette catégorie.</p>
            <a href="student-dashboard.html" class="btn btn-secondary" style="margin-top: 20px;">
                <i class="fas fa-arrow-left"></i> Retour au tableau de bord
            </a>
        </div>
    `;
}

/**
 * Affiche les détails d'un quiz (réutilise la fonction du dashboard.js)
 */
async function viewQuizDetails(quizId) {
    try {
        showToast('Chargement des détails...', 'info');
        
        const result = await API.getQuiz(quizId);
        
        if (result.success && result.quiz) {
            const quiz = result.quiz;
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

console.log('Quiz List Manager chargé et prêt !');

