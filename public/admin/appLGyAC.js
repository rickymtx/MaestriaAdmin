
import {URL_SERVER} from "../config1.js"

// Tabla LGyAC
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
            <td>
              <button onclick="editarFila(this)" class="btnEditar">Editar</button>
              <button onclick="eliminarFila('${id}')" class="btnEliminarLGYAC">Eliminar</button>
            </td>
          </tr>
        `;
      });

      tablaBody.innerHTML = tablaHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

// Llama la función al cargar la página
window.onload = cargarDatosTabla;


function añadirCuerpos(btn) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  // Crear nueva fila editable con inputs más grandes
  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input type="text" id="nuevoLgac" placeholder="Nueva LGAC" style="width: 95%; height: 2.5em; font-size: 1em;"></td>
    <td><input type="text" id="nuevoObjetivo" placeholder="Nuevo Objetivo" style="width: 95%; height: 2.5em; font-size: 1em;"></td>
    <td>
      <button onclick="guardarFila(this)" class="btn-guardar">Guardar</button>
      <button onclick="cancelarFila(this)" class="btn-cancelar">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function cancelarFila(btn) {
  const fila = btn.closest('tr');
  fila.remove(); // Elimina la fila temporal
}

function guardarFila(btn) {
  const fila = btn.closest('tr');
  const nuevoLgac = fila.querySelector('#nuevoLgac').value.trim();
  const nuevoObjetivo = fila.querySelector('#nuevoObjetivo').value.trim();

  if (!nuevoLgac || !nuevoObjetivo) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa ambos campos.'
    });
    return;
  }

  // Petición POST al backend
  fetch(URL_SERVER + '/lgyac', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lgyac: nuevoLgac,
      objetivos: nuevoObjetivo
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("Error al guardar");
    return response.json();
  })
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'El nuevo registro se ha guardado correctamente.'
    });
    cargarDatosTabla(); // Recargar la tabla después de guardar
  })
  .catch(error => {
    console.error("Error al guardar los datos:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el registro.'
    });
  });
}


function editarFila(btn) {
  const fila = btn.closest('tr');
  const celdas = fila.querySelectorAll('td');
  const id = fila.getAttribute('data-id');

  // Guardar valores actuales
  const valorActualLgac = celdas[0].innerText;
  const valorActualObjetivos = celdas[1].innerText;

  // Reemplazar celdas con inputs más grandes
  celdas[0].innerHTML = `<input type="text" value="${valorActualLgac}" id="editarLgac" style="width: 95%; height: 2.5em; font-size: 1em;">`;
  celdas[1].innerHTML = `<input type="text" value="${valorActualObjetivos}" id="editarObjetivos" style="width: 95%; height: 2.5em; font-size: 1em;">`;

  // Reemplazar botón Editar con Guardar y Cancelar
  celdas[2].innerHTML = `
    <button onclick="guardarEdicion(this, '${id}')" class="btn-guardar">Guardar</button>
    <button onclick="cancelarEdicion(this, '${valorActualLgac}', '${valorActualObjetivos}')" class="btn-cancelar">Cancelar</button>
  `;
}


function guardarEdicion(btn, id) {
  const fila = btn.closest('tr');
  const nuevoLgac = fila.querySelector('#editarLgac').value.trim();
  const nuevoObjetivo = fila.querySelector('#editarObjetivos').value.trim();

  if (!nuevoLgac || !nuevoObjetivo) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa ambos campos.'
    });
    return;
  }

  fetch(URL_SERVER + `/lgyac/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lgyac: nuevoLgac,
      objetivos: nuevoObjetivo
    })
  })
  .then(response => {
    if (!response.ok) throw new Error("Error al actualizar");
    return response.json();
  })
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'El registro se actualizó correctamente.'
    });
    cargarDatosTabla(); // Recargar tabla
  })
  .catch(error => {
    console.error("Error al actualizar:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el registro.'
    });
  });
}

function cancelarEdicion(btn, valorOriginalLgac, valorOriginalObjetivos) {
  const fila = btn.closest('tr');
  const id = fila.getAttribute('data-id');

  fila.innerHTML = `
    <td>${valorOriginalLgac}</td>
    <td>${valorOriginalObjetivos}</td>
    <td>
      <button onclick="editarFila(this)">Editar</button>
    </td>
  `;
}

function eliminarFila(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgyac/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        return response.json();
      })
      .then(data => {
        Swal.fire('Eliminado', 'El registro ha sido eliminado correctamente.', 'success');
        cargarDatosTabla(); // Recargar la tabla
      })
      .catch(error => {
        console.error("Error al eliminar:", error);
        Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
      });
    }
  });
}

window.añadirCuerpos = añadirCuerpos;
window.cancelarFila = cancelarFila;
window.guardarFila = guardarFila;
window.editarFila = editarFila;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicion = cancelarEdicion;
window.eliminarFila = eliminarFila;
