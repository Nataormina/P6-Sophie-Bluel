
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
const deleteImageFromModal = async (e) => {
  if (e.target.classList.contains('fa-trash-can')) {
    const figureElement = e.target.closest('figure');  // Trouver l'élément figure parent
    const imageId = figureElement.querySelector('img').dataset.id;  // Récupérer l'ID de l'image

    // Suppression de l'image de la modale
    figureElement.remove();

    // Supprimer l'image correspondante de la galerie sur la page d'accueil
    const homepageImage = document.querySelector(`.gallery img[data-id="${imageId}"]`);
    if (homepageImage) {
      homepageImage.closest('figure').remove();
    }

    // Appel à l'API pour supprimer le projet
    try {
      const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        console.log(`Projet avec l'ID ${imageId} supprimé de l'API.`);
      } else {
        console.error('Erreur lors de la suppression du projet via l\'API');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion à l\'API:', error);
    }
  }
};

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



/*// Sélectionner l'élément nécessaire
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


// Ajouter l'écouteur d'événement pour la soumission du formulaire
addPhotoForm.addEventListener("submit", async (event) => {
  event.preventDefault();  // Empêcher la soumission par défaut du formulaire

  // Récupérer les données du formulaire
  const title = document.getElementById('photo-title').value;
  const category = document.getElementById('photo-category').value;
  const fileInput = document.getElementById('photo-file');
  const file = fileInput.files[0];

  // Créer un FormData pour l'envoi des données à l'API
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', file);

 


  
  
  try {
    const response = await fetch("http://localhost:5678/api/works", {
 

      method: "POST",
headers: {
  'Authorization': `Bearer ${sessionStorage.getItem('authToken')},`
  //"content-type": "application/json",
},

      body: formData
    });

    if (response.ok) {
      const gallery = await response.json();

      // Créer dynamiquement un nouvel élément pour la galerie
      const newGalleryMain = () => {
        for (let i = 0; i < data.length; i++) {
      const figure = document.createElement("figure");
      figure.id = `mainFigure-${data[i].id}`;
      figure.innerHTML = `
        <img src="${data[i].imageUrl}" alt="${data[i].title}" data-type="${data[i].category.name}" data-id="${data[i].id}">
        <figcaption>${data[i].title}</figcaption>`;
      gallery.appendChild(figure);
        //<i class="fa-solid fa-trash-can overlay-icon"></i>`;
         return figure;

      }
    };
  
    newGalleryMain();

   
      
      // Ajouter la nouvelle photo à la galerie
      modalPhotos.appendChild(figure.cloneNode(true));
      projetModal.appendChild(figure.cloneNode(true));  // Ajouter également à la galerie principale
       
      
      console.log("Nouvelle photo ajoutée avec succès.");

      // Réinitialiser et masquer le formulaire
      addPhotoForm.reset();
      addPhotoForm.style.display = "none";
      modalPhotos.style.display = "block";  // Réafficher la galerie
     

    } else {
      console.error("Erreur lors de l'ajout de la photo via l'API.");
    }
    
  } catch (error) {
    console.error("Erreur lors de la connexion à l'API :", error);
  }
});*/





document.addEventListener("DOMContentLoaded", function() {
  const addPhotoForm = document.querySelector(".add-photo-form");
  const addPhotoButton = document.querySelector(".add-photo-button");
  const modalPhotos = document.querySelector(".modalPhotos");
  const projetModal = document.querySelector(".projetModal");

  // Ajouter l'écouteur d'événement pour le bouton "Ajouter une photo"
  addPhotoButton.addEventListener("click", () => {
    // Masquer la galerie de la modale
    modalPhotos.style.display = "none";
    // Afficher le formulaire d'ajout de photo
    addPhotoForm.style.display = "block";
  });

  addPhotoForm.addEventListener("submit", async (event) => {
    event.preventDefault();  // Empêche la soumission par défaut du formulaire

    // Récupérer les données du formulaire
    const title = document.getElementById('photo-title').value;
    const category = document.getElementById('photo-category').value;
    const fileInput = document.getElementById('photo-file');
    const file = fileInput.files[0];

  

    // Vérifiez que toutes les données nécessaires sont bien présentes
    if (!title || !category || !file) {
      console.error("Toutes les données du formulaire doivent être fournies.");
      return;
    }

    // Créer un FormData pour l'envoi des données à l'API
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

  
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (response.ok) {
        const newWork = await response.json();
        console.log("Nouvelle photo ajoutée avec succès :", newWork);

        // Créer dynamiquement un nouvel élément pour la galerie
        const figure = document.createElement("figure");
        figure.id = `mainFigure-${newWork.id}`;
        figure.innerHTML = `
          <img src="${newWork.imageUrl}" alt="${newWork.title}" data-type="${newWork.category.name}" data-id="${newWork.id}">
          <figcaption>${newWork.title}</figcaption>`;
        
        // Ajouter la nouvelle photo à la galerie
        modalPhotos.appendChild(figure);
        projetModal.appendChild(figure.cloneNode(true));  // Ajouter également à la galerie principale

        // Réinitialiser et masquer le formulaire
        addPhotoForm.reset();
        addPhotoForm.style.display = "none";
        modalPhotos.style.display = "block";  // Réafficher la galerie
      } else {
        console.error("Erreur lors de l'ajout de la photo via l'API.");
      }

    } catch (error) {
      console.error("Erreur lors de la connexion à l'API :", error);
    }
  });
});



