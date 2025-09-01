
// Función para "Ver más..." y "Ver menos..."
function toggleDetalles(element) {
    const detalles = element.previousElementSibling;
    if (detalles.classList.contains('oculto')) {
        detalles.classList.remove('oculto');
        element.textContent = 'Ver menos...';
    } else {
        detalles.classList.add('oculto');
        element.textContent = 'Ver más...';
    }
}