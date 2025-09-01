
import {URL_SERVER} from "../config1.js"

// Tabla LGYAC
function cargarDatosTabla() {
  fetch(URL_SERVER + '/lgyac')
    .then(response => response.json())
    .then(data => {
      const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
      let tablaHTML = '';

      data.forEach(documento => {
        const lgyacMaestria = documento.lgyac || '';
        const objetivosMaestria = documento.objetivos || '';
        const id = documento.id;

        tablaHTML += `
          <tr data-id="${id}">
            <td>${lgyacMaestria}</td>
            <td>${objetivosMaestria}</td>
          </tr>
        `;
      });

      tablaBody.innerHTML = tablaHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

window.onload = cargarDatosTabla;
