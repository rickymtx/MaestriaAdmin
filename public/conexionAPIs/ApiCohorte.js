
import {URL_SERVER} from "../config1.js"

// Tabla de Egresados
fetch(URL_SERVER + '/cohorteGeneracional')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
        const imagenCohorte = documento.imagen || '';
        const tituloImg = documento.titulo || '';

      tablaHTML += `
        <tr>
            <th class="titulo-cohorte">${tituloImg}</th>
        </tr>
        <tr>
            <td><img src="${imagenCohorte}" class="imagen-cohorte" /></td>
        </tr>
        <tr class="espacio">
            <td>&nbsp;</td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
