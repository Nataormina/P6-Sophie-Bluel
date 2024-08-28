
 // Récupération des projets avec l'API
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => {
  // Ajout des projets dans la div gallery et dans la modale
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

  

  // Sélectionner le bouton "Ajouter une photo" et le conteneur pour les projets
  const addPhotoButton = containerModals.querySelector(".add-photo-button");
  const projetModal = containerModals.querySelector(".projetModal");
  const modalPhotos = containerModals.querySelector(".modalPhotos");
  

 
// Récupération des projets avec l'API
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => {
  // Ajout des projets dans la div gallery
  const modalPhotos = document.querySelector(".projetModal");

  // Création d'une boucle pour ajouter tous les projets
  const createPhotosModal= () => {
    for (let i = 0; i < data.length; i++) {
      const figure = document.createElement("figure");
      //figure.id = `mainFigure-${data[i].id}`;
      figure.innerHTML = `<div class="projetModal">
        <img src="${data[i].imageUrl}" alt="${data[i].title}" data-type="${data[i].category.name}" data-id="${data[i].id}">
        <figcaption>${data[i].title}</figcaption>
        <i class="fa-solid fa-trash-can overlay-icon"></i>
        </div>
        `
        
      modalPhotos.appendChild(figure);
    }
  }

  createPhotosModal();
})

.catch((error) => {
  console.error("Erreur lors de la récupération des données :", error);
});

// Fonction pour supprimer un projet du DOM
const deleteImageFromModal = (e) => {
  if (e.target.classList.contains('fa-trash-can')) {
    const figureElement = e.target.closest('figure');  // Trouver l'élément figure parent
    figureElement.remove();  // Supprimer l'élément du DOM
    console.log(`Image avec l'ID ${figureElement.dataset.id} supprimée du DOM.`);
  }
};

// Récupération des projets avec l'API et création de la galerie dans la modale
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    createPhotosModal(data);  // Créer dynamiquement les éléments dans la modale
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error);
  });

// Ajout de l'écouteur d'événements sur la modale pour la suppression des images
document.querySelector(".projetModal").addEventListener('click', deleteImageFromModal);

  

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







// Sélectionner l'élément nécessaire
const addPhotoForm = document.querySelector(".add-photo-form");


// Ajouter l'écouteur d'événement pour le bouton "Ajouter une photo"
addPhotoButton.addEventListener("click", () => {
  // Masquer la galerie de la modale
  modalPhotos.style.display = "none";

  // Afficher le formulaire d'ajout de photo
  addPhotoForm.style.display = "block";
});

// Ajouter l'écouteur d'événements pour soumettre le formulaire
const pictureForm = document.getElementById("picture-form");

pictureForm.addEventListener("submit", (event) => {
  event.preventDefault();  // Empêche la soumission du formulaire par défaut

  // Vous pouvez ajouter ici la logique pour traiter le formulaire, comme uploader l'image
  
  // Après la soumission du formulaire, vous pouvez masquer le formulaire et revenir à la galerie
  addPhotoForm.style.display = "none";
  projetModal.style.display = "block";  // Réafficher la galerie
});
