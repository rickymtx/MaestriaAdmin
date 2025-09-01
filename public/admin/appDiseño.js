//Srcipt para Eventos
document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector(".tabla-eventos");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.3 // Ajusta la sensibilidad (0.3 = 30% visible)
    });

    if (tabla) {
      observer.observe(tabla);
    }
});


//Script para Articulos
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

//Script para Capitulos
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

//Script para Proyectos de Investigación
document.addEventListener("DOMContentLoaded", function() {
    var proyectos = document.querySelectorAll(".proyecto");

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

    proyectos.forEach(function(proyecto) {
        observer.observe(proyecto);
    });
});
