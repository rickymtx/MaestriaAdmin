document.addEventListener("DOMContentLoaded", function() {
    var capitulos = document.querySelectorAll(".capitulo");

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

    capitulos.forEach(function(capitulo) {
        observer.observe(capitulo);
    });
});

