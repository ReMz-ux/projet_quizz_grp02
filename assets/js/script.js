// ===== TPN QUIZ - JavaScript =====

// ===== UTILITY FUNCTIONS =====

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('tpn_user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('tpn_user');
        localStorage.removeItem('tpn_token');
        showToast('Vous avez été déconnecté avec succès', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// ===== LOGIN & REGISTRATION =====

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;
        
        if (!userType) {
            showToast('Veuillez sélectionner un type d\'utilisateur', 'error');
            return;
        }
        
        try {
            showToast('Connexion en cours...', 'info');
            
            // Appel à l'API réelle
            const result = await API.login(email, password);
            
            if (result.success && result.user) {
                // Stocker le type d'utilisateur choisi
                const userData = {
                    ...result.user,
                    type: userType
                };
                API.setUser(userData);
                
                showToast('Connexion réussie !', 'success');
                
                // Rediriger vers le dashboard approprié
                setTimeout(() => {
                    if (userType === 'stagiaire') {
                        window.location.href = 'student-dashboard.html';
                    } else {
                        window.location.href = 'trainer-dashboard.html';
                    }
                }, 1000);
            } else {
                showToast(result.error || 'Erreur de connexion. Vérifiez vos identifiants.', 'error');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showToast('Erreur de connexion. Veuillez réessayer.', 'error');
        }
    });
}

// Handle registration form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userType = document.getElementById('userType').value;
        
        // Validation
        if (password !== confirmPassword) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }
        
        if (!userType) {
            showToast('Veuillez sélectionner un type d\'utilisateur', 'error');
            return;
        }
        
        try {
            showToast('Création du compte...', 'info');
            
            // Préparer les données selon le format de l'API
            const userData = {
                firstname: prenom,
                lastname: nom,
                email: email,
                password: password
            };
            
            // Appel à l'API réelle
            const result = await API.register(userData);
            
            if (result.success) {
                showToast('Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showToast(result.error || 'Erreur lors de la création du compte.', 'error');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Erreur lors de la création du compte. Veuillez réessayer.', 'error');
        }
    });
}

// ===== PROFILE =====

// Handle profile form
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            telephone: document.getElementById('telephone').value,
            bio: document.getElementById('bio').value,
            website: document.getElementById('website').value
        };
        
        try {
            showToast('Enregistrement des modifications...', 'info');
            
            // Simuler un délai d'API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showToast('Profil mis à jour avec succès !', 'success');
            
        } catch (error) {
            console.error('Profile update error:', error);
            showToast('Erreur lors de la mise à jour du profil', 'error');
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====

// Handle search
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                showToast(`Recherche de "${searchTerm}"...`, 'info');
                // Ici, vous pouvez implémenter la logique de recherche réelle
                // Par exemple: window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}

const searchBtn = document.querySelector('.search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log('Searching for:', searchTerm);
            showToast(`Recherche de "${searchTerm}"...`, 'info');
        }
    });
}

// ===== QUIZ FUNCTIONALITY =====

// Quiz state
let quizState = {
    currentQuestion: 1,
    totalQuestions: 10,
    answers: {},
    startTime: Date.now()
};

// Save answer
function saveAnswer(questionId, answerId) {
    quizState.answers[questionId] = answerId;
    console.log('Answer saved:', quizState.answers);
}

// Navigate to next question
function nextQuestion() {
    if (quizState.currentQuestion < quizState.totalQuestions) {
        quizState.currentQuestion++;
        console.log('Moving to question', quizState.currentQuestion);
        // Ici, charger la prochaine question depuis l'API
        showToast(`Question ${quizState.currentQuestion}`, 'info');
    } else {
        // Quiz terminé
        submitQuiz();
    }
}

// Navigate to previous question
function previousQuestion() {
    if (quizState.currentQuestion > 1) {
        quizState.currentQuestion--;
        console.log('Moving to question', quizState.currentQuestion);
        // Ici, charger la question précédente depuis l'API
        showToast(`Question ${quizState.currentQuestion}`, 'info');
    }
}

// Submit quiz
function submitQuiz() {
    const timeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
    
    console.log('Quiz submitted:', {
        answers: quizState.answers,
        timeSpent: timeSpent
    });
    
    showToast('Quiz terminé ! Calcul du résultat...', 'success');
    
    // Rediriger vers la page de résultats
    setTimeout(() => {
        window.location.href = 'quiz-results.html?id=1';
    }, 1500);
}

// ===== QUIZ MANAGEMENT (Trainer) =====

// Delete quiz
function deleteQuiz(quizId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
        showToast('Suppression du quiz...', 'info');
        
        // Simuler la suppression
        setTimeout(() => {
            showToast('Quiz supprimé avec succès', 'success');
            // Recharger la page ou supprimer l'élément du DOM
        }, 1000);
    }
}

// Delete user (Trainer)
function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        showToast('Suppression de l\'utilisateur...', 'info');
        
        setTimeout(() => {
            showToast('Utilisateur supprimé avec succès', 'success');
        }, 1000);
    }
}

// Ban user (Trainer)
function banUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) {
        showToast('Bannissement de l\'utilisateur...', 'info');
        
        setTimeout(() => {
            showToast('Utilisateur banni avec succès', 'success');
        }, 1000);
    }
}

// Unban user (Trainer)
function unbanUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir débannir cet utilisateur ?')) {
        showToast('Débannissement de l\'utilisateur...', 'info');
        
        setTimeout(() => {
            showToast('Utilisateur débanni avec succès', 'success');
        }, 1000);
    }
}

// ===== ANIMATIONS =====

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====

// Check auth on protected pages
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = [
        'student-dashboard.html',
        'trainer-dashboard.html',
        'profile.html',
        'statistics.html',
        'manage-quizzes.html',
        'manage-users.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const user = checkAuth();
        if (!user) {
            showToast('Vous devez être connecté pour accéder à cette page', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.quiz-card, .stat-card, .category-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
    });
    
    console.log('TPN Quiz initialized');
});

// ===== EXPORT FUNCTIONS TO GLOBAL SCOPE =====
window.logout = logout;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitQuiz = submitQuiz;
window.deleteQuiz = deleteQuiz;
window.deleteUser = deleteUser;
window.banUser = banUser;
window.unbanUser = unbanUser;
window.showToast = showToast;



