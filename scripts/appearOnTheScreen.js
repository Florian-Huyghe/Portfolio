const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const ratioElement = 0.1;

var appear = function(entries, observer) {
    entries.forEach(function(entry) {
        if(entry.intersectionRatio > ratioElement) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(appear, options);

/**
 * link every element with the class .reveal-x to an observer
 */
document.querySelectorAll('[class*="reveal-"]').forEach(function(x) {
    observer.observe(x);
});

