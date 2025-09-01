
import {URL_SERVER} from "../config1.js"

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(URL_SERVER + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Error en la autenticación');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      alert('Inicio de sesión exitoso');

      window.location.href = '/admin/bienvenida.html';

    } catch (error) {
      console.error('Hubo un problema con el login:', error);
      alert('Correo o contraseña incorrectos');
    }
  });
});
