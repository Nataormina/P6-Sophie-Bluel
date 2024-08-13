

 // Récupération des projets avec l'api
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => {
  // Ajout des projets dans la div gallery
  const gallery = document.querySelector(".gallery");

  // Création d'une boucle for pour éviter de répéter l'opération pour les 11 projets
  const createGalleryMain = () => {
    for (let i = 0; i < data.length; i++) {
      const figure = document.createElement("figure");
      figure.id = `mainFigure-${data[i].id}`;
      figure.innerHTML = `<img src="${data[i].imageUrl}" alt="${data[i].title}" data-type="${data[i].category.name}" data-id="${data[i].id}">
      <figcaption>${data[i].title}</figcaption>`;
      gallery.appendChild(figure);
    }
  };
  createGalleryMain();

  // Déclaration de la variable portfolio pour y ajouter les filtres
  const portfolio = document.getElementById("portfolio");

  // Création d'un objet set pour récupérer les filtres correspondant aux projets sans les doublons
  const categories = new Set();

  categories.add("Tous");
  data.forEach((item) => {
    categories.add(item.category.name);
  });

  // "Transformer" l'objet set en tableau afin d'exploiter ses données
  const categoriesArray = [...categories];

  // Ajout des boutons pour filtrer les projets dans la section portfolio
  const filtres = document.createElement("div");
  filtres.classList.add("btn-filter");

  categoriesArray.forEach((cate) => {
    const btnFiltre = document.createElement("button");
    btnFiltre.textContent = cate;
    btnFiltre.classList.add("btn");
    filtres.appendChild(btnFiltre);
  });

  portfolio.appendChild(filtres);
  portfolio.insertBefore(filtres, gallery);

  // Création de l'événement au clique sur les boutons filtres pour trier les images
  const figures = document.querySelectorAll(".gallery figure");
  const btnsFiltres = document.querySelectorAll(".btn");

  btnsFiltres.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      const btnClicked = e.target;
      const nameFilter = btnClicked.textContent;

      btnsFiltres.forEach((btn) => {
        if (btn === btnClicked) {
          btn.classList.add("active-btn");
        } else {
          btn.classList.remove("active-btn");
        }
      });

      figures.forEach((figure) => {
        const image = figure.querySelector("img");
        const imageType = image.dataset.type;

        if (nameFilter === "Tous" || nameFilter === imageType) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      });
    });

    if (index === 0) {
      btn.classList.add("active-btn");
    }
  });

  // Fonction pour supprimer les filtres quand nous sommes connectés
  const deleteFiltres = () => {
    if (localStorage.getItem("userId") && localStorage.getItem("token")) {
      filtres.style.display = "none";
    }
  };
  deleteFiltres();
});

/*// eventListener pour accéder à la page de connexion ou se déconnecter
const loginPage = document.getElementById("login");

loginPage.addEventListener("click", () => {
if (localStorage.getItem("userId") && localStorage.getItem("token")) {
  // Si connecté, effectuer la déconnexion et maj du texte du lien
  localStorage.clear();
  loginLi.textContent = "login";
  window.location.href = "index.html";
} else {
  window.location.href = "login.html";
}
});

// Si connecté, effectuer toutes les modifs pour être sur le mode édition
document.addEventListener("DOMContentLoaded", () => {
if (localStorage.getItem("userId") && localStorage.getItem("token")) {
  loginPage.textContent = "logout";

  const modifModeBar = document.querySelector(".publish-changes");
  modifModeBar.style.display = "flex";

  const header = document.querySelector("header");
  header.style.paddingTop = "40px";

  const modifSpan = document.querySelector(".span-modif");
  modifSpan.classList.add("display-modif");
}
});*/

function displayModeAdmin () {
  if (sessionStorage.authToken) {
    console.log("ok");
    const bannerEdition = document.createElement("div");
    bannerEdition.className = "mode-edition";
    bannerEdition.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
    document.body.prepend(bannerEdition);
  }
}

displayModeAdmin();