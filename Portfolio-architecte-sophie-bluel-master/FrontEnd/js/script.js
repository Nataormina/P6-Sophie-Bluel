
 // Récupération des projets avec l'API
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => {
  // Ajout des projets dans la div gallery
  const gallery = document.querySelector(".gallery");

  // Création d'une boucle pour ajouter tous les projets
  const createGalleryMain = () => {
    for (let i = 0; i < data.length; i++) {
      const figure = document.createElement("figure");
      figure.id = `mainFigure-${data[i].id}`;
      figure.innerHTML = `
        <img src="${data[i].imageUrl}" alt="${data[i].title}" data-type="${data[i].category.name}" data-id="${data[i].id}">
        <figcaption>${data[i].title}</figcaption>`;
      gallery.appendChild(figure);
    }
  };
  createGalleryMain();

  // Création des filtres
  const portfolio = document.getElementById("portfolio");
  const categories = new Set();
  categories.add("Tous");
  data.forEach((item) => {
    categories.add(item.category.name);
  });

  const categoriesArray = [...categories];
  const filtres = document.createElement("div");
  filtres.classList.add("btn-filter");

  categoriesArray.forEach((cate) => {
    const btnFiltre = document.createElement("button");
    btnFiltre.textContent = cate;
    btnFiltre.classList.add("btn");
    filtres.appendChild(btnFiltre);
  });

  portfolio.insertBefore(filtres, gallery);

  // Ajouter l'événement de clic sur les filtres
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

  // Vérifier si l'utilisateur est connecté et cacher les filtres en mode édition
  if (sessionStorage.getItem("authToken")) {
    filtres.style.display = "none";
  }
});

/*const faPen = document.querySelector(".fa-pen-to-square");
const modifySpan = document.querySelector(".modify-span");
 // Vérifier si l'utilisateur est connecté et afficher  "span" et "modifier" en mode édition
 if (sessionStorage.getItem("authToken")) {
  faPen.style.display = "flex";
  modifySpan.style.display = "flex";
}*/


document.addEventListener("DOMContentLoaded", () => {
  const authToken = sessionStorage.getItem("authToken");

  if (authToken) {
    const faRegular = document.querySelector(".fa-regular");
    const modify = document.querySelector(".modify");

    if (faRegular && modify) {
      faRegular.style.display = "block";
      modify.style.display = "block";
      modify.innerHTML = '<p><a href=""><i class="fa-regular fa-pen-to-square"></i>modifier</a></p>';

// Ajout de l'écouteur d'événement pour ouvrir la modale
if (modify) {
  modify.addEventListener("click", (event) => {
    event.preventDefault();
    containerModals.style.display = "flex";
  });
  }

    } else {
      console.error("Les éléments .fa-regular ou .modify n'existent pas.");
    }
  } else {
    console.error("authToken est manquant ou invalide.");
  }
});



// Gérer le mode administrateur
function displayModeAdmin() {
if (sessionStorage.authToken) {
  console.log("ok");
  bannerEdition = document.createElement("div"); // Créer la bannière
  bannerEdition.className = "modeEdition";
  bannerEdition.innerHTML = '<p><a href=""><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
  loginLi.innerHTML = '<a href="#">logout</a>';
 
  document.getElementById("loginLi").addEventListener("click", function(event) {
    event.preventDefault();
    sessionStorage.removeItem('authToken');
    console.log("Déconnecté");
    window.location.reload();
  });

  document.body.prepend(bannerEdition);
}
}

const containerModals = document.querySelector(".containerModals");
const loginLi = document.getElementById('loginLi');

displayModeAdmin();

if (bannerEdition) {
bannerEdition.addEventListener("click", (event) => {
  event.preventDefault();
  containerModals.style.display = "flex";
});
}




window.onclick = function(event) {
if (event.target == containerModals) {
  containerModals.style.display = "none";
}
}

document.addEventListener("DOMContentLoaded", function() {
var span = document.querySelector(".close");
span.addEventListener("click", function() {
  containerModals.style.display = "none";
});
});



