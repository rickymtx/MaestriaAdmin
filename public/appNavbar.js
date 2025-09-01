
// Funcionalidad Navbar
window.addEventListener('scroll', function () {
    const navbarMaestria = document.querySelector('.navbarMaestria');

    if (window.innerWidth > 768) {
        if (window.scrollY > 70) {
            navbarMaestria.classList.add('fixed-navbar');
        } else {
            navbarMaestria.classList.remove('fixed-navbar');
        }
    } else {
        navbarMaestria.classList.remove('fixed-navbar');
    }
});