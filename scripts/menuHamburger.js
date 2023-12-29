const menuHamburger = document.querySelector('header span.menu-hamburger');
const navLinks = document.querySelector('header nav.navbar');
var links = [...document.querySelectorAll("header nav a")];

var setupListeners = function(){
    menuHamburger.addEventListener('click', animMenuHamburger );
    for(let i=0; i<links.length; i++){
        links[i].addEventListener('click', removeMenu );
    }
}

var animMenuHamburger = function(){
    if(menuHamburger.textContent == 'menu_open'){
        menuHamburger.textContent = 'menu';
    } else {
        menuHamburger.textContent = 'menu_open';
    }
    navLinks.classList.toggle('mobile-menu');
}

var removeMenu = function(){
    navLinks.classList.remove('mobile-menu');
    menuHamburger.textContent = 'menu';
}
setupListeners();