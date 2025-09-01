
import {URL_SERVER} from "../config1.js"

// Requisitos para la obtención del grado académico
fetch(URL_SERVER + '/requisitosGrado')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('requisitos-container');
    contenedor.innerHTML = '';

    data.forEach(documento => {
      const requisitos = documento.requisitos || [];

      const aboutTextDiv = document.createElement('div');
      aboutTextDiv.classList.add('about-text');

      const titulo = document.createElement('h2');
      titulo.textContent = 'Requisitos para la obtención del grado académico';
      aboutTextDiv.appendChild(titulo);

      requisitos.forEach(req => {
        const parrafo = document.createElement('p');
        parrafo.textContent = `• ${req}`;
        aboutTextDiv.appendChild(parrafo);
      });

      contenedor.appendChild(aboutTextDiv);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
