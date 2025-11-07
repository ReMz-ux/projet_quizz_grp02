const form = document.querySelector("#registerForm");

form.addEventListener("submit",function {
    
        fetch('https://quizz.adrardev.fr/api/user', {
            method: 'POST',
            body: json.stringify({
                    "firstname":"test1",
                    "lastname":"test11",
                    "email":"test1@test.com",
                    "password":"test1"
                    })
        })
        .then(response => response.json())
        .then(data => {
        console.log('Utilisateur créé :', data);
        })
        .catch(error => {
        console.error('Erreur POST :', error);
        });

});