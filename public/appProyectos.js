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
      threshold: 0.3 
    });

    if (tabla) {
      observer.observe(tabla);
    }
});