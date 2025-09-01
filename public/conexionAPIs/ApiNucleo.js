
import {URL_SERVER} from "../config1.js"

// Nucleo Académico Básico
fetch(URL_SERVER + '/nucleoBasico')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const nombreProfe = documento.nombre || "";
      const gradoMaximo = documento.gradoMaximo || "";
      const especialidad = documento.especialidad || "";
      const cedula = documento.cedulaProfesional || "";
      const nivel = documento.nivelSNII || "";
      const cargo = documento.cargo || "";
      const unidad = documento.unidadAdscripcion || "";
      const correo = documento.correo || "";
      const semblanza = (documento.semblanza || "")
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/\n/g, '<br>');
      const lineas = (documento.lineasInv || "")
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/\n/g, '<br>');
      const image = documento.imageURL || "";

      const cvus = Array.isArray(documento.cvu) ? documento.cvu : (documento.cvu ? [documento.cvu] : []);

      let cvuHTML = '';
      cvus.forEach((link, index) => {
        if (link) {
          cvuHTML += `<a href="${link}" target="_blank">CVU ${index + 1}</a><br>`;
        }
      });

      tablaHTML += `
        <tr data-id="${id}">
            <td class="imagen">
                <img src="${image}" alt="Foto de perfil">
            </td>
            <td class="datos">
                <h3>${nombreProfe}</h3>
                <strong>Grado Máximo Obtenido:</strong> ${gradoMaximo}<br>
                <strong>Especialidad:</strong> ${especialidad}<br>
                <strong>Cédula Profesional:</strong> ${cedula}<br>
                <div class="detalles oculto">
                    <strong>Nivel SNII:</strong> ${nivel}<br>
                    <strong>Cargo:</strong> ${cargo}<br>
                    <strong>Unidad de Adscripción:</strong> ${unidad}<br>
                    <strong>Correo Electrónico:</strong> ${correo}<br>
                    <strong>Semblanza:</strong> ${semblanza}<br>
                    <strong>Líneas de Investigación:</strong> ${lineas}<br>
                    <strong>CVU:</strong><br>
                    ${cvuHTML}
                </div>
                <span class="toggle-btn" onclick="toggleDetalles(this)">Ver más...</span>
            </td>
        </tr>
        <div class="separator"></div>
        `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
