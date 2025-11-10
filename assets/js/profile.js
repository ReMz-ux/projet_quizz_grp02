// ===== TPN QUIZ - PROFILE PAGE =====
// Gestion de la page profil utilisateur

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
    
    // Charger et afficher les informations de l'utilisateur
    loadUserProfile(user);
});

/**
 * Charge et affiche les informations du profil utilisateur
 */
function loadUserProfile(user) {
    const fullName = `${user.firstname} ${user.lastname}`;
    
    // Mettre à jour le nom dans le header
    const headerNameElement = document.querySelector('.user-info span');
    if (headerNameElement) {
        headerNameElement.textContent = fullName;
    }
    
    // Mettre à jour le nom dans le profil header
    const profileNameElement = document.querySelector('.profile-info h2');
    if (profileNameElement) {
        profileNameElement.textContent = fullName;
    }
    
    // Mettre à jour l'email dans le profil header
    const emailElement = document.querySelector('.profile-info p i.fa-envelope');
    if (emailElement && emailElement.parentElement) {
        emailElement.parentElement.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
    }
    
    // Mettre à jour le rôle
    const roleElement = document.querySelector('.profile-role');
    if (roleElement && user.type) {
        const roleIcon = user.type === 'formateur' ? 'fa-chalkboard-teacher' : 'fa-user-graduate';
        const roleName = user.type === 'formateur' ? 'Formateur' : 'Stagiaire';
        roleElement.innerHTML = `<i class="fas ${roleIcon}"></i> ${roleName}`;
    }
    
    // Pré-remplir le formulaire
    const nomInput = document.getElementById('nom');
    if (nomInput) nomInput.value = user.lastname || '';
    
    const prenomInput = document.getElementById('prenom');
    if (prenomInput) prenomInput.value = user.firstname || '';
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.value = user.email || '';
        emailInput.disabled = true; // L'email ne peut pas être modifié
        emailInput.style.backgroundColor = '#f5f5f5';
        emailInput.style.cursor = 'not-allowed';
    }
    
    // Téléphone - on garde vide si pas d'info
    const telephoneInput = document.getElementById('telephone');
    if (telephoneInput && user.phone) {
        telephoneInput.value = user.phone;
    } else if (telephoneInput) {
        telephoneInput.value = '';
        telephoneInput.placeholder = '+33 X XX XX XX XX';
    }
    
    // Bio - on garde vide si pas d'info
    const bioInput = document.getElementById('bio');
    if (bioInput && user.bio) {
        bioInput.value = user.bio;
    } else if (bioInput) {
        bioInput.value = '';
        bioInput.placeholder = 'Parlez-nous de vous...';
    }
    
    // Site web - on garde vide si pas d'info
    const websiteInput = document.getElementById('website');
    if (websiteInput && user.website) {
        websiteInput.value = user.website;
    } else if (websiteInput) {
        websiteInput.value = '';
        websiteInput.placeholder = 'https://monsite.com';
    }
    
    console.log('Profil chargé:', user);
}

/**
 * Gère la soumission du formulaire de profil
 */
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        showToast('Mise à jour du profil...', 'info');
        
        // Récupérer les données du formulaire
        const formData = {
            lastname: document.getElementById('nom').value,
            firstname: document.getElementById('prenom').value,
            telephone: document.getElementById('telephone').value,
            bio: document.getElementById('bio').value,
            website: document.getElementById('website').value
        };
        
        // Pour l'instant, on sauvegarde juste dans le localStorage
        // (L'API du prof n'a peut-être pas d'endpoint pour modifier le profil)
        const user = API.getUser();
        const updatedUser = {
            ...user,
            ...formData
        };
        
        API.setUser(updatedUser);
        
        showToast('Profil mis à jour avec succès !', 'success');
        
        // Recharger les infos affichées
        setTimeout(() => {
            loadUserProfile(updatedUser);
        }, 500);
    });
}

console.log('Profile Manager chargé et prêt !');

