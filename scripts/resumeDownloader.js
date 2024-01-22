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
    lienTelechargement.href = 'docs/FlorianHuygheCV.pdf'; 
    lienTelechargement.setAttribute('download', 'FlorianHuygheCV.pdf'); 

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