const loginApi = "http://localhost:5678/api/users/login";


document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", pushSubmit);  
  }
});


function pushSubmit(event) {
  event.preventDefault(); // Empêcher l'envoi du formulaire pour traitement personnalisé
  console.log("Formulaire soumis !");
  // Ajoutez votre logique ici, par exemple la validation ou l'envoi AJAX
}

async function pushSubmit(event) {
  event.preventDefault();
 
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  
  let response = await fetch(loginApi, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(user),
    });
  console.log(response);
  //message d’erreur quand les informations utilisateur / mot de passe ne sont pas correctes
  if (response.status != 200) {
    const errorMessageLogin = document.createElement("div");
    errorMessageLogin.className = "error-login";
    errorMessageLogin.innerHTML = "Erreur de connexion, identifiant ou mot de passe incorrect";
    document.querySelector("form").prepend(errorMessageLogin); 
    
  }
  else { 
    let result = await response.json();
    const token = result.token;
    //Stockage du token d'authentification pour pouvoir réaliser les envois et suppressions de travaux
    sessionStorage.setItem("authToken", token);

    
    //Redirection vers la page d'accueil lorsque l'adresse mail et le mot de passe sont corrects
    window.location.href = "index.html"
  }
}

  
