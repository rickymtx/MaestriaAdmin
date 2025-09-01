
import {URL_SERVER} from "../config1.js"

// Tabla Contacto
fetch(URL_SERVER + '/contacto')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const nombreContacto = documento.nombre || '';
      const puestoContacto = documento.puesto || '';
      const correoContacto = documento.correo || '';
      const telefonoContacto = documento.telefono || '';

      tablaHTML += `
        <tr>
          <td>${nombreContacto}</td>
          <td>${puestoContacto}</td>
          <td>${correoContacto}</td>
          <td>${telefonoContacto}</td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
