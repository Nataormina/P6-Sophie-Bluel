
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


  
  

  // Sélectionner le bouton "Ajouter une photo" et le conteneur pour les projets
  const addPhotoButton = containerModals.querySelector(".add-photo-button");
  const projetModal = containerModals.querySelector(".projetModal");
  const modalPhotos = containerModals.querySelector(".modalPhotos");
  

 
// Récupération des projets avec l'API
fetch("http://localhost:5678/api/works")
.then((response) => response.json())
.then((data) => {
  // Ajout des projets dans la div gallery
  const modalPhotos = document.querySelector(".modalPhotos");

  // Création d'une boucle pour ajouter tous les projets
  const createPhotosModal= () => {
    for (let i = 0; i < data.length; i++) {
      const figure = document.createElement("figure");
      figure.id = `mainFigure-${data[i].id}`;
      figure.innerHTML = `
        <img src="${data[i].imageUrl}" alt="${data[i].title}" data-type="${data[i].category.name}" data-id="${data[i].id}">
        <figcaption>${data[i].title}</figcaption>`;
        
      modalPhotos.appendChild(figure);
    }
  }

  createPhotosModal();
})
.catch((error) => {
  console.error("Erreur lors de la récupération des données :", error);
});





 // Créer l'input file caché pour sélectionner les photos
  const photoInput = document.createElement("input");
  photoInput.type = "file";
  photoInput.accept = "image/*";
  photoInput.multiple = true;
  photoInput.style.display = "none";

  // Ajouter l'input au body pour pouvoir y accéder via le JavaScript
  document.body.appendChild(photoInput);

  // Ajouter l'écouteur d'événement pour le bouton "Ajouter une photo"
  addPhotoButton.addEventListener("click", () => {
    photoInput.click(); // Ouvre la boîte de dialogue pour sélectionner des fichiers
  });

  // Gérer l'ajout des photos après la sélection
  photoInput.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      // Parcourir les fichiers sélectionnés et les afficher dans la modale
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "100px";
          img.style.margin = "10px";
          projetModal.appendChild(img);
        };
        reader.readAsDataURL(file);
  
    }
  }
  });

  
 
 

 /* // Liste des images à charger (basée sur les fichiers présents dans le dossier images)
  const images = [
    
'abajour-tahina.png',
    'image2.jpg',
    'image3.jpg',
    // Ajoute ici d'autres noms de fichiers d'images
  ];*/



  
   

  // Chemin de base vers le dossier d'images
  const basePath = 'images/';
 

  // Charger les images et les afficher dans la modale
  images.forEach((imageName) => {
    const img = document.createElement("img");
    img.src = `${basePath}${imageName}`;
    img.alt = imageName;
    img.style.maxWidth = "100px";
    img.style.margin = "10px";

const deleteIcon = document.createElement("img");
    deleteIcon.src = "path/to/trash-icon.png"; // Chemin de l'icône de poubelle
    deleteIcon.className = "delete-icon";

    // Ajouter un événement pour supprimer l'image
    deleteIcon.addEventListener("click", () => {
      projetModal.removeChild(img);
    });

    const imageContainer = document.createElement("div");
    imageContainer.appendChild(img);
    imageContainer.appendChild(deleteIcon);

    projetModal.appendChild(img);
  });

  
  


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




