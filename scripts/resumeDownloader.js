var btnDownloader = document.getElementById('btn');


var setupListeners = function(){
    btnDownloader.addEventListener('click', download );
    btnDownloader.addEventListener('click', clicked );
}


/**
 * Creates a download link for a PDF file and triggers the download when clicked.
 */
var download = function() {
    var lienTelechargement = document.createElement('a');
    lienTelechargement.href = 'chemin/vers/votre/fichier.pdf'; // Remplacez par le chemin ou l'URL de votre fichier
    lienTelechargement.setAttribute('download', 'nom-du-fichier.pdf'); // Remplacez par le nom du fichier à télécharger

    lienTelechargement.click();
}

/**
 * Adds the CSS class 'clicked' to the element with the id 'boutonTelechargement'.
 */
var clicked = function(){
    btnDownloader.innerHTML = '<span class="material-symbols-outlined">check</span>';
    btnDownloader.classList.add('clicked');
}

setupListeners();