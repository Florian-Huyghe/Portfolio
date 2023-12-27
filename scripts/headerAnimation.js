var sections = [...document.querySelectorAll("section")];
var links = [...document.querySelectorAll("header nav a")];

window.addEventListener('scroll', () => {
    animHeader();
})

var animHeader = function(){
    /**
     * Animates the header of a webpage based on the user's scroll position.
     * Updates the active state of the navigation links based on the current section being scrolled into view.
     * 
     * @param {NodeList} sections - A NodeList containing all the section elements on the webpage.
     * @param {NodeList} navLinks - A NodeList containing all the navigation links in the header.
     */
    var sectionData = [];
    sections.forEach(sec => {
        var offset = sec.offsetTop - 100;
        var height = sec.offsetHeight;
        var id = sec.id;
        sectionData.push({offset, height, id});
    });

    var top = window.scrollY;
    sectionData.forEach(data => {
        let {offset, height, id} = data;
        if (top < offset + height && top >= offset  ) {
            //active navbar links
            links.forEach(links => {
                links.classList.remove("active-header");
                document.querySelector("header nav a[href*=" + id + "]").classList.add("active-header");
            })
        }
    })
}
