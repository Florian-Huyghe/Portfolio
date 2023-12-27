const menuHamburger = document.querySelector('header span.menu-hamburger');
const navLinks = document.querySelector('header nav.navbar');
var links = [...document.querySelectorAll("header nav a")];
var i=0;

var setupListeners = function(){
    menuHamburger.addEventListener('click', animMenuHamburger );
    for(let i=0; i<links.length; i++){
        links[i].addEventListener('click', removeMenu );
    }
}

var animMenuHamburger = function(){
    if(i%2!==0){
        menuHamburger.textContent = 'menu';
    } else {
        menuHamburger.textContent = 'menu_open';
    }
    navLinks.classList.toggle('mobile-menu');
    i++;
}

var removeMenu = function(){
    navLinks.classList.remove('mobile-menu');
    menuHamburger.textContent = 'menu';
}
setupListeners();