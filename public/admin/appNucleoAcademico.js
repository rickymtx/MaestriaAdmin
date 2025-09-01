
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
            <td>
                  <button onclick="editarProfesor(this)" class="edit-btnNucleo">Editar</button>
                  <button onclick="eliminarProfesor('${id}')" class="delete-btnNucleo">Eliminar</button>
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


// Función para agregar un nuevo Maestro
let contadorFilas = 0;

function añadirProfesor(boton) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  contadorFilas++;
  const idImagenInput = `imagenInput_${contadorFilas}`;
  const idPreviewImagen = `previewImagen_${contadorFilas}`;

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td class="imagen">
      <label for="${idImagenInput}" class="custom-file-upload" style="cursor:pointer;">
        <img id="${idPreviewImagen}" src="https://via.placeholder.com/100" alt="Seleccionar Imagen" class="select-btnImagen">
      </label>
      <input type="file" id="${idImagenInput}" name="imagenPerfil" accept="image/*" style="display:none;">
    </td>
    <td class="datos">
      <strong>Nombre:</strong> <input class="input-amplio" type="text" name="nombre" placeholder="Nombre"><br>
      <strong>Grado-Máximo-Obtenido:</strong> <input class="input-amplio" type="text" name="gradoMaximo" placeholder="Grado Máximo Obtenido"><br>
      <strong>Especialidad:</strong> <input class="input-amplio" type="text" name="especialidad" placeholder="Especialidad"><br>
      <strong>Cédula-Profesional:</strong> <input class="input-amplio" type="text" name="cedulaProfesional" placeholder="Cédula Profesional"><br>
      <strong>Nivel-SNII:</strong> <input class="input-amplio" type="text" name="nivelSNII" placeholder="Nivel SNII"><br>
      <strong>Cargo:</strong> <input class="input-amplio" type="text" name="cargo" placeholder="Cargo"><br>
      <strong>Unidad-Adscripción:</strong> <input class="input-amplio" type="text" name="unidadAdscripcion" placeholder="Unidad Adscripción"><br>
      <strong>Correo-Electrónico:</strong> <input class="input-amplio" type="email" name="correo" placeholder="Correo Electrónico"><br>
      <strong>Semblanza:</strong> <textarea class="input-amplio" name="semblanza" placeholder="Semblanza"></textarea><br>
      <strong>Líneas-de-Investigación:</strong> <textarea class="input-amplio" name="lineasInv" placeholder="Líneas de Investigación"></textarea><br>
      <div class="cvu-container">
        <strong>CVUs:</strong> 
          <div class="cvu-list">
            <input class="input-amplio" type="url" name="cvu[]" placeholder="Link CVU">
          </div>
        <button type="button" onclick="agregarCampoCVU(this)">+ Añadir otro CVU</button>
      </div><br>
      <button onclick="guardarProfesor(this)" class="save-btnNucleo">Guardar</button>
      <button onclick="cancelarFila(this)" class="delete-btnNucleo">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);

  const inputImagen = nuevaFila.querySelector(`#${idImagenInput}`);
  const preview = nuevaFila.querySelector(`#${idPreviewImagen}`);

  inputImagen.addEventListener('change', function () {
    const archivo = this.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  });
}

function agregarCampoCVU(boton) {
  const contenedor = boton.closest('.cvu-container').querySelector('.cvu-list');
  const nuevoInput = document.createElement('input');
  nuevoInput.type = 'url';
  nuevoInput.name = 'cvu[]';
  nuevoInput.className = 'input-amplio';
  nuevoInput.placeholder = 'Link CVU';
  contenedor.appendChild(nuevoInput);
}

function guardarProfesor(boton) {
  const fila = boton.closest('tr');
  const inputs = fila.querySelectorAll('input, textarea');
  const formData = new FormData();

  inputs.forEach(input => {
    if (input.type === 'file') {
      if (input.files[0]) {
        formData.append(input.name, input.files[0]);
      }
    } else {
      formData.append(input.name, input.value);
    }
  });

  fetch(URL_SERVER + '/nucleoBasico', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('Error en la petición POST');
      return response.text();
    })
    .then(mensaje => {
      Swal.fire({
        icon: 'success',
        title: 'Profesor añadido',
        text: 'El profesor fue añadido exitosamente.',
        confirmButtonText: 'Ok'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error al guardar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el profesor.',
        confirmButtonText: 'Ok'
      });
    });
}

function cancelarFila(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

// Actualizar Maestro
function editarProfesor(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const celdaImagen = fila.querySelector('td.imagen');
  const celdaDatos = fila.querySelector('td.datos');

  const imagenActual = celdaImagen.querySelector('img').src;

  const nombre = celdaDatos.querySelector('h3').textContent.trim();

  const gradoMaximo = celdaDatos.innerHTML.match(/Grado Máximo Obtenido:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const especialidad = celdaDatos.innerHTML.match(/Especialidad:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const cedula = celdaDatos.innerHTML.match(/Cédula Profesional:<\/strong>\s*(.*?)<br>/)?.[1] || '';

  const detalles = celdaDatos.querySelector('.detalles');
  const nivel = detalles?.innerHTML.match(/Nivel SNII:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const cargo = detalles?.innerHTML.match(/Cargo:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const unidad = detalles?.innerHTML.match(/Unidad de Adscripción:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const correo = detalles?.innerHTML.match(/Correo Electrónico:<\/strong>\s*(.*?)<br>/)?.[1] || '';
  const semblanza = extraerTextoMultilinea(detalles, 'Semblanza');
  const lineas = extraerTextoMultilinea(detalles, 'Líneas de Investigación');

  const enlacesCVU = Array.from(detalles?.querySelectorAll('a') || []).map(a => a.href).join('\n');

  celdaImagen.innerHTML = `
    <label for="imagenInput_${id}" class="custom-file-upload" style="cursor:pointer;">
      <img id="previewImagen_${id}" src="${imagenActual}" class="select-btnImagen" />
    </label>
    <input type="file" id="imagenInput_${id}" name="imagenPerfil" accept="image/*" style="display:none;">
  `;

  celdaDatos.innerHTML = `
    <strong>Nombre:</strong> <input class="input-amplio" type="text" name="nombre" value="${nombre}"><br>
    <strong>Grado-Máximo-Obtenido:</strong> <input class="input-amplio" type="text" name="gradoMaximo" value="${gradoMaximo}"><br>
    <strong>Especialidad:</strong> <input class="input-amplio" type="text" name="especialidad" value="${especialidad}"><br>
    <strong>Cédula-Profesional:</strong> <input class="input-amplio" type="text" name="cedulaProfesional" value="${cedula}"><br>
    <strong>Nivel-SNII:</strong> <input class="input-amplio" type="text" name="nivelSNII" value="${nivel}"><br>
    <strong>Cargo:</strong> <input class="input-amplio" type="text" name="cargo" value="${cargo}"><br>
    <strong>Unidad-de-Adscripción:</strong> <input class="input-amplio" type="text" name="unidadAdscripcion" value="${unidad}"><br>
    <strong>Correo-Electrónico:</strong> <input class="input-amplio" type="email" name="correo" value="${correo}"><br>
    <strong>Semblanza:</strong> <textarea class="input-amplio" name="semblanza">${semblanza}</textarea><br>
    <strong>Líneas-de-Investigación:</strong> <textarea class="input-amplio" name="lineasInv">${lineas}</textarea><br>
    <strong>CVU:</strong> 
      <textarea class="input-amplio" name="cvu">${enlacesCVU}</textarea><br>
    <small>Ingresa un CVU por línea</small><br>
    <button class="save-btnNucleo" onclick="guardarEdicion(this, '${id}')">Guardar</button>
    <button class="delete-btnNucleo" onclick="cancelarEdicion()">Cancelar</button>
  `;

  const inputImagen = document.getElementById(`imagenInput_${id}`);
  const preview = document.getElementById(`previewImagen_${id}`);
  inputImagen.addEventListener('change', function () {
    const archivo = this.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  });
}

function extraerTextoMultilinea(contenedor, etiqueta) {
  const nodos = Array.from(contenedor.childNodes);
  let recolectando = false;
  let texto = '';

  for (let nodo of nodos) {
    if (nodo.nodeType === 1 && nodo.tagName === 'STRONG') {
      if (nodo.textContent.includes(etiqueta)) {
        recolectando = true;
        continue;
      }
      if (recolectando) break;
    }
    if (recolectando) {
      if (nodo.nodeType === 3) { 
        texto += nodo.textContent;
      } else if (nodo.nodeType === 1 && nodo.tagName === 'BR') {
        texto += '\n';
      }
    }
  }

  return texto.trim();
}

function guardarEdicion(boton, id) {
  const fila = boton.closest('tr');
  const inputs = fila.querySelectorAll('input, textarea');
  const formData = new FormData();

  inputs.forEach(input => {
    if (input.type === 'file') {
      if (input.files[0]) {
        formData.append(input.name, input.files[0]);
      }
    } else {
      if (input.name === 'cvu') {
        const urls = input.value
          .split('\n')
          .map(url => url.trim())
          .filter(url => url !== '');

        urls.forEach(url => formData.append('cvu', url));
      } else {
        formData.append(input.name, input.value);
      }
    }
  });

  fetch(URL_SERVER + `/nucleoBasico/${id}`, {
    method: 'PUT',
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar');
      return response.text();
    })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El perfil fue actualizado correctamente.',
        confirmButtonText: 'Ok'
      }).then(() => location.reload());
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil.',
        confirmButtonText: 'Ok'
      });
    });
}

function cancelarEdicion() {
  location.reload();
}

// Eliminar Maestro
function eliminarProfesor(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará al profesor de forma permanente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/nucleoBasico/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el profesor.');
          }
          const fila = document.querySelector(`tr[data-id="${id}"]`);
          if (fila) {
            fila.remove();
          }

          Swal.fire(
            'Eliminado',
            'El profesor ha sido eliminado correctamente.',
            'success'
          );
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el profesor.',
            'error'
          );
        });
    }
  });
}

window.añadirProfesor = añadirProfesor;
window.agregarCampoCVU = agregarCampoCVU;
window.guardarProfesor = guardarProfesor;
window.cancelarFila = cancelarFila;
window.editarProfesor = editarProfesor;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicion = cancelarEdicion;
window.eliminarProfesor = eliminarProfesor;
