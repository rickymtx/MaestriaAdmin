
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
        const id = documento.id;
        const imagenCohorte = documento.imagen || '';
        const tituloImg = documento.titulo || '';

      tablaHTML += `
        <tr>
            <th class="titulo">${tituloImg}</th>
        </tr>
        <tr>
            <td><img src="${imagenCohorte}" class="imagen" /></td>
        </tr>
        <tr>
          <td>
              <button onclick="editarImagen('${id}', '${tituloImg}', '${imagenCohorte}')" class="edit-btnImagen">Editar</button>
              <button onclick="eliminarImagen('${id}')" class="delete-btnImagen">Eliminar</button>
          </td>
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


function añadirImagen(btn) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  const filaTitulo = document.createElement('tr');
  const thTitulo = document.createElement('th');
  thTitulo.innerHTML = `<input type="text" placeholder="Título de la imagen..." class="input-titulo">`;
  filaTitulo.appendChild(thTitulo);

  const filaImagen = document.createElement('tr');
  const tdImagen = document.createElement('td');
  tdImagen.innerHTML = `
    <input type="file" accept="image/*" class="input-imagen" onchange="mostrarVistaPrevia(this)">
    <img src="" class="imagen vista-previa" style="display:none; margin-top: 10px;" />
  `;
  filaImagen.appendChild(tdImagen);

  const filaBotones = document.createElement('tr');
  const tdBotones = document.createElement('td');
  tdBotones.innerHTML = `
    <button onclick="guardarImagen(this)" class="save-btnImagenes">Guardar</button>
    <button onclick="cancelarAgregar(this)" class="cancel-btnImagenes">Cancelar</button>
  `;
  filaBotones.appendChild(tdBotones);

  const filaEspacio = document.createElement('tr');
  filaEspacio.className = "espacio";
  filaEspacio.innerHTML = `<td>&nbsp;</td>`;

  tablaBody.appendChild(filaTitulo);
  tablaBody.appendChild(filaImagen);
  tablaBody.appendChild(filaBotones);
  tablaBody.appendChild(filaEspacio);
}

function mostrarVistaPrevia(input) {
  const file = input.files[0];
  const img = input.parentNode.querySelector('.vista-previa');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      img.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function cancelarAgregar(btn) {
  const tr = btn.closest('tr');
  const tbody = tr.parentNode;
  for (let i = 0; i < 4; i++) {
    tbody.removeChild(tbody.lastChild);
  }
}

function guardarImagen(btn) {
  const fila = btn.closest('tr');
  const tablaBody = fila.parentNode;

  const inputTitulo = tablaBody.querySelector('.input-titulo');
  const inputImagen = tablaBody.querySelector('.input-imagen');

  const titulo = inputTitulo.value.trim();
  const imagen = inputImagen.files[0];

  if (!titulo || !imagen) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor proporciona un título y selecciona una imagen.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('imagenCohorte', imagen);

  fetch(URL_SERVER + '/cohorteGeneracional', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: '¡Imagen guardada!',
        text: 'La imagen se ha guardado exitosamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la imagen. Intenta de nuevo.',
      });
    }
  })
  .catch(err => {
    console.error('Error al enviar datos:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error del servidor',
      text: 'Ocurrió un problema al enviar los datos.',
    });
  });
}


function editarImagen(id, tituloActual, imagenActual) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  fetch(URL_SERVER + '/cohorteGeneracional')
    .then(response => response.json())
    .then(data => {
      tablaBody.innerHTML = '';

      let html = '';

      data.forEach(documento => {
        const docId = documento.id;
        const imagen = documento.imagen || '';
        const titulo = documento.titulo || '';

        if (docId === id) {
          html += `
            <tr>
              <td>
                <input type="text" value="${titulo}" id="input-titulo-${docId}" class="input-titulo">
              </td>
            </tr>
            <tr data-id="${docId}" data-imagen-original="${imagen}">
              <td>
                <img src="${imagen}" class="imagen imagen-edit" id="imagen-prev-${docId}" />
                <input type="file" id="input-file-${docId}" style="display: none;" accept="image/*">
                <button onclick="document.getElementById('input-file-${docId}').click()" class="edit-btnImagen">Seleccionar imagen</button>
              </td>
            </tr>
            <tr>
              <td>
                <button onclick="guardarEdicion('${docId}')" class="btn-guardar">Guardar</button>
                <button onclick="cancelarEdicion()" class="btn-cancelar">Cancelar</button>
              </td>
            </tr>
            <tr class="espacio"><td>&nbsp;</td></tr>
          `;
        } else {
          html += `
            <tr><th class="titulo">${titulo}</th></tr>
            <tr><td><img src="${imagen}" class="imagen" /></td></tr>
            <tr><td><button onclick="editarImagen('${docId}', '${titulo}', '${imagen}')" class="edit-btnImagen">Editar</button></td></tr>
            <tr class="espacio"><td>&nbsp;</td></tr>
          `;
        }
      });

      tablaBody.innerHTML = html;

      const inputFile = document.getElementById(`input-file-${id}`);
      const imgPreview = document.getElementById(`imagen-prev-${id}`);

      inputFile.onchange = () => {
        const file = inputFile.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imgPreview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
    });
  }

  function cancelarEdicion() {
    location.reload();
  }

  function guardarEdicion(id) {
  const tituloNuevo = document.getElementById(`input-titulo-${id}`).value;
  const inputFile = document.getElementById(`input-file-${id}`);
  const file = inputFile.files[0];
  const formData = new FormData();

  formData.append('titulo', tituloNuevo);
  if (file) formData.append('imagenCohorte', file);

  fetch(URL_SERVER + `/cohorteGeneracional/${id}`, {
    method: 'PUT',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error('Error en la actualización');
      return res.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data); 
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'La imagen y título fueron actualizados correctamente.',
        confirmButtonText: 'OK'
      }).then(() => {
        location.reload();
      });
    })
    .catch(err => {
      console.error('Error en la petición:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el registro.',
      });
    });
}


function eliminarImagen(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará la imagen y no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/cohorteGeneracional/${id}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al eliminar');
        return res.text(); 
      })
      .then(msg => {
        console.log(msg);
        Swal.fire(
          'Eliminado',
          'La imagen ha sido eliminada correctamente.',
          'success'
        ).then(() => {
          location.reload();
        });
      })
      .catch(err => {
        console.error(err);
        Swal.fire(
          'Error',
          'No se pudo eliminar la imagen.',
          'error'
        );
      });
    }
  });
}

window.añadirImagen = añadirImagen;
window.cancelarAgregar = cancelarAgregar;
window.guardarImagen = guardarImagen;
window.mostrarVistaPrevia = mostrarVistaPrevia;
window.editarImagen = editarImagen;
window.cancelarEdicion = cancelarEdicion;
window.guardarEdicion = guardarEdicion;
window.eliminarImagen = eliminarImagen;
