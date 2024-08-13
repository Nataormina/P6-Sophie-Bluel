/*// Déclaration des variables du formulaire de connexion et ses inputs
const loginForm = document.querySelector("#login form");
const inputsForm = document.querySelectorAll("#login input");

// Fonction pour indiquer une erreur
const errorDisplay = (tag, valid) => {
  const container = document.querySelector("." + tag + "-container");
  const label = document.querySelector("." + tag + "-container > label");

  if (!valid) {
    container.classList.add("error");
    label.classList.add("error");
  } else {
    container.classList.remove("error");
    label.classList.remove("error");
  }
};

// Fonction pour afficher le message d'erreur
const errorConnection = (valid) => {
  const pError = document.querySelector(".erreur-connexion");

  if (!valid) {
    pError.classList.add("error");
  } else {
    pError.classList.remove("error");
  }
};

// Fonction pour vérifier que l'email fonctionne bien à l'input
const emailChecker = (value) => {
  if (value.length == 0) {
    errorDisplay("email");
  } else if (!value.match(/^\w+[\w.-]*@\w+(-\w+)*\.\w{2,4}$/)) {
    errorDisplay("email");
  } else if (!value === "sophie.bluel@test.tld") {
    errorDisplay("email");
  } else {
    errorDisplay("email", true);
  }
};

// Fonction pour vérifier que le mot de passe fonctionne bien à l'input
const passwordChecker = (value) => {
  if (value.length == 0) {
    errorDisplay("password");
  } else {
    errorDisplay("password", true);
  }
};

inputsForm.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "emailLog":
        emailChecker(e.target.value);
        break;
      case "passwordForget":
        passwordChecker(e.target.value);
        break;
      default:
        nul;
    }
  });
});

// eventListener submit au clique sur le bouton pour se connecter après avoir rempli le formulaire
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Récupération des valeurs des inputs en objet
  const completedForm = {
    email: emailLog.value,
    password: passwordForget.value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completedForm),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "index.html";
      } else {
        errorDisplay("email");
        errorDisplay("mdp");
        errorConnection();
      }
    });
});*/



const loginApi = "http://localhost:5678/api/users/login";


document.getElementById("login").addEventListener("submit", pushSubmit);



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



// Aide fournie par Companion :
/*function getInputs() {
  // Récupérer les valeurs des champs d'e-mail et de mot de passe
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Vous pouvez maintenant utiliser les valeurs des champs d'e-mail et de mot de passe comme vous le souhaitez
  console.log('E-mail:', email);
  console.log('Mot de passe:', password);
}
getInputs();

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Récupérer les valeurs des champs d'e-mail et de mot de passe
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('E-mail:', email);
  console.log('Mot de passe:', password);
});*/
  
