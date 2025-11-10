// ===== TPN QUIZ - QUIZ PLAY =====
// Gestion du jeu de quiz

// État du quiz
let quizState = {
    quiz: null,
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
    timer: null
};

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier que l'utilisateur est connecté
    const user = API.getUser();
    
    if (!user) {
        showToast('Vous devez être connecté pour jouer', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Mettre à jour le nom de l'utilisateur dans le header
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement && user.firstname && user.lastname) {
        userNameElement.textContent = `${user.firstname} ${user.lastname}`;
    }
    
    // Récupérer l'ID du quiz depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (!quizId) {
        showToast('Aucun quiz sélectionné', 'error');
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 2000);
        return;
    }
    
    // Charger le quiz
    await loadQuiz(quizId);
});

// ===== QUIZ LOADING =====

/**
 * Charge le quiz depuis l'API
 */
async function loadQuiz(quizId) {
    try {
        showToast('Chargement du quiz...', 'info');
        
        const result = await API.getQuiz(quizId);
        
        if (result.success && result.quiz) {
            quizState.quiz = result.quiz;
            quizState.startTime = Date.now();
            
            // Initialiser le quiz
            initializeQuiz();
            
            showToast('Quiz chargé avec succès !', 'success');
        } else {
            showToast(result.error || 'Erreur lors du chargement du quiz', 'error');
            setTimeout(() => {
                window.location.href = 'student-dashboard.html';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement du quiz', 'error');
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 2000);
    }
}

// ===== QUIZ INITIALIZATION =====

/**
 * Initialise l'affichage du quiz
 */
function initializeQuiz() {
    const quiz = quizState.quiz;
    
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        showToast('Ce quiz ne contient aucune question', 'error');
        setTimeout(() => {
            window.location.href = 'student-dashboard.html';
        }, 2000);
        return;
    }
    
    // Mettre à jour le titre
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-question-circle"></i> ${quiz.title}`;
    }
    
    // Mettre à jour le total de questions
    const totalQuestionsElement = document.getElementById('totalQuestions');
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = quiz.questions.length;
    }
    
    // Afficher la première question
    displayQuestion(0);
    
    // Démarrer le timer si présent
    startTimer();
}

// ===== QUESTION DISPLAY =====

/**
 * Affiche une question
 */
function displayQuestion(index) {
    const quiz = quizState.quiz;
    
    if (!quiz || !quiz.questions || index >= quiz.questions.length) {
        return;
    }
    
    const question = quiz.questions[index];
    quizState.currentQuestionIndex = index;
    
    // Mettre à jour le numéro de question
    const currentQuestionElement = document.getElementById('currentQuestion');
    if (currentQuestionElement) {
        currentQuestionElement.textContent = index + 1;
    }
    
    // Mettre à jour la barre de progression
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const percentage = ((index + 1) / quiz.questions.length) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    // Mettre à jour le numéro de question dans la carte
    const questionNumberElement = document.querySelector('.question-number');
    if (questionNumberElement) {
        questionNumberElement.innerHTML = `<i class="fas fa-question-circle"></i> Question ${index + 1}`;
    }
    
    // Mettre à jour le texte de la question
    const questionTextElement = document.querySelector('.question-text');
    if (questionTextElement) {
        questionTextElement.textContent = question.title || question.description || 'Question sans texte';
    }
    
    // Afficher les réponses
    displayAnswers(question);
    
    // Mettre à jour le bouton suivant/terminer
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        if (index === quiz.questions.length - 1) {
            nextBtn.innerHTML = 'Terminer <i class="fas fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Suivant <i class="fas fa-arrow-right"></i>';
        }
    }
    
    // Désactiver le bouton précédent si on est à la première question
    const prevBtn = document.querySelector('[onclick*="previousQuestion"]');
    if (prevBtn) {
        if (index === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = '1';
        }
    }
}

/**
 * Affiche les réponses d'une question
 */
function displayAnswers(question) {
    const answersContainer = document.querySelector('.answers-list');
    
    if (!answersContainer || !question.answers) {
        console.error('Pas de conteneur de réponses ou pas de réponses');
        return;
    }
    
    answersContainer.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        
        // Vérifier si cette réponse était déjà sélectionnée
        const savedAnswer = quizState.answers[question.id];
        const isSelected = savedAnswer === answer.id;
        if (isSelected) {
            answerDiv.classList.add('selected');
        }
        
        answerDiv.innerHTML = `
            <input type="radio" 
                   name="answer" 
                   id="answer${index}" 
                   value="${answer.id}" 
                   ${isSelected ? 'checked' : ''}
                   style="margin-right: 10px;">
            <label for="answer${index}" style="cursor: pointer; flex: 1;">
                <strong>${letters[index]}.</strong> ${answer.text}
            </label>
        `;
        
        // Ajouter l'événement de sélection
        answerDiv.onclick = function() {
            selectAnswer(this, question.id, answer.id);
        };
        
        answersContainer.appendChild(answerDiv);
    });
}

// ===== ANSWER SELECTION =====

/**
 * Sélectionne une réponse
 */
function selectAnswer(element, questionId, answerId) {
    // Retirer la classe selected de toutes les options
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Ajouter la classe selected à l'option cliquée
    element.classList.add('selected');
    
    // Cocher le radio button
    element.querySelector('input[type="radio"]').checked = true;
    
    // Sauvegarder la réponse
    quizState.answers[questionId] = answerId;
    
    console.log('Réponse sauvegardée:', { questionId, answerId });
}

// ===== NAVIGATION =====

/**
 * Passe à la question suivante
 */
function nextQuestion() {
    const quiz = quizState.quiz;
    const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
    
    // Vérifier qu'une réponse a été sélectionnée
    if (!quizState.answers[currentQuestion.id]) {
        showToast('Veuillez sélectionner une réponse', 'error');
        return;
    }
    
    // Si c'est la dernière question, terminer le quiz
    if (quizState.currentQuestionIndex === quiz.questions.length - 1) {
        finishQuiz();
    } else {
        // Passer à la question suivante
        displayQuestion(quizState.currentQuestionIndex + 1);
    }
}

/**
 * Revient à la question précédente
 */
function previousQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        displayQuestion(quizState.currentQuestionIndex - 1);
    }
}

// ===== TIMER =====

/**
 * Démarre le timer
 */
function startTimer() {
    const timerElement = document.getElementById('timer');
    
    if (!timerElement) return;
    
    // Calculer le temps total (2 minutes par question)
    const totalTime = quizState.quiz.questions.length * 120; // 120 secondes = 2 minutes
    let timeLeft = totalTime;
    
    quizState.timer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Changer la couleur si moins de 2 minutes
        if (timeLeft < 120) {
            timerElement.style.color = '#e74c3c';
        }
        
        if (timeLeft <= 0) {
            clearInterval(quizState.timer);
            showToast('Temps écoulé ! Le quiz va se terminer.', 'error');
            setTimeout(() => {
                finishQuiz();
            }, 2000);
        }
    }, 1000);
}

// ===== QUIZ COMPLETION =====

/**
 * Termine le quiz et calcule le score
 */
function finishQuiz() {
    // Arrêter le timer
    if (quizState.timer) {
        clearInterval(quizState.timer);
    }
    
    const quiz = quizState.quiz;
    let score = 0;
    let maxScore = 0;
    
    // Calculer le score
    quiz.questions.forEach(question => {
        const userAnswerId = quizState.answers[question.id];
        const correctAnswer = question.answers.find(a => a.valid === true);
        
        if (correctAnswer) {
            maxScore += question.value || 1;
            
            if (userAnswerId === correctAnswer.id) {
                score += question.value || 1;
            }
        }
    });
    
    // Calculer le pourcentage
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    
    // Calculer le temps passé
    const timeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
    
    // Sauvegarder les résultats dans le localStorage pour la page de résultats
    const results = {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: score,
        maxScore: maxScore,
        percentage: percentage,
        timeSpent: timeSpent,
        totalQuestions: quiz.questions.length,
        answers: quizState.answers,
        questions: quiz.questions
    };
    
    localStorage.setItem('quiz_results', JSON.stringify(results));
    
    showToast(`Quiz terminé ! Score : ${percentage}%`, 'success');
    
    // Rediriger vers la page de résultats
    setTimeout(() => {
        window.location.href = `quiz-results.html?id=${quiz.id}`;
    }, 1500);
}

// ===== EXPORT FUNCTIONS =====

window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;

console.log('Quiz Play Manager chargé et prêt !');

