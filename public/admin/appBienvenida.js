//Script para mensaje de bienvenida
const urlParams = new URLSearchParams(window.location.search);
const mensaje = urlParams.get('mensaje');

if (mensaje) {
    switch (mensaje) {
        case 'exito':
            alert('Inicio de sesión exitoso.');
            break;
    }

    history.replaceState(null, "", window.location.pathname);
}
