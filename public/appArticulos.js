document.addEventListener("DOMContentLoaded", function() {
    var articulos = document.querySelectorAll(".articulo");

    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,  
        rootMargin: "0px", 
        threshold: 0.2 
    });

    articulos.forEach(function(articulo) {
        observer.observe(articulo);
    });
});
