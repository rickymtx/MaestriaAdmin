
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
        <tr data-id="${id}">
          <td>${nombreContacto}</td>
          <td>${puestoContacto}</td>
          <td>${correoContacto}</td>
          <td>${telefonoContacto}</td>
          <td>
              <button onclick="editarContacto(this)" class="edit-btnContacto">Editar</button>
              <button onclick="eliminarContacto(this)" class="delete-btnContacto">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirContacto(boton) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input type="text" placeholder="Nombre" id="nuevoNombre" class="input-amplio"></td>
    <td><input type="text" placeholder="Puesto" id="nuevoPuesto" class="input-amplio"></td>
    <td><input type="email" placeholder="Correo" id="nuevoCorreo" class="input-amplio"></td>
    <td><input type="text" placeholder="Teléfono" id="nuevoTelefono" class="input-amplio"></td>
    <td>
      <button onclick="guardarContacto(this)" class="save-btnContacto">Guardar</button>
      <button onclick="cancelarContacto(this)" class="cancel-btnContacto">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarContacto(boton) {
  const fila = boton.closest('tr');

  const nombre = fila.querySelector('#nuevoNombre').value;
  const puesto = fila.querySelector('#nuevoPuesto').value;
  const correo = fila.querySelector('#nuevoCorreo').value;
  const telefono = fila.querySelector('#nuevoTelefono').value;

  if (!nombre || !puesto || !correo || !telefono) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos'
    });
    return;
  }

  fetch(URL_SERVER + '/contacto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, puesto, correo, telefono })
  })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Contacto guardado',
        text: 'El contacto se ha guardado exitosamente'
      });
      cargarContactos();
    })
    .catch(error => {
      console.error('Error al guardar el contacto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar el contacto'
      });
    });
}

function cancelarContacto(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function cargarContactos() {
  fetch(URL_SERVER + '/contacto')
    .then(response => response.json())
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
          <tr data-id="${id}">
            <td>${nombreContacto}</td>
            <td>${puestoContacto}</td>
            <td>${correoContacto}</td>
            <td>${telefonoContacto}</td>
            <td>
              <button onclick="editarContacto(this)" class="edit-btnContacto">Editar</button>
              <button onclick="eliminarContacto(this)" class="delete-btnContacto">Eliminar</button>
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

cargarContactos();


function editarContacto(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const celdas = fila.querySelectorAll('td');

  const originales = {
    nombre: celdas[0].innerText,
    puesto: celdas[1].innerText,
    correo: celdas[2].innerText,
    telefono: celdas[3].innerText
  };

  celdas[0].innerHTML = `<input type="text" class="input-amplio" value="${originales.nombre}" />`;
  celdas[1].innerHTML = `<input type="text" class="input-amplio" value="${originales.puesto}" />`;
  celdas[2].innerHTML = `<input type="email" class="input-amplio" value="${originales.correo}" />`;
  celdas[3].innerHTML = `<input type="text" class="input-amplio" value="${originales.telefono}" />`;
  celdas[4].innerHTML = `
    <button onclick="guardarEdicion(this, '${id}')" class="save-btnContacto">Guardar</button>
    <button onclick="cancelarEdicion(this, ${JSON.stringify(originales).replace(/"/g, '&quot;')})" class="cancel-btnContacto">Cancelar</button>
  `;
}

function guardarEdicion(boton, id) {
  const fila = boton.closest('tr');
  const inputs = fila.querySelectorAll('input');

  const nombre = inputs[0].value;
  const puesto = inputs[1].value;
  const correo = inputs[2].value;
  const telefono = inputs[3].value;

  if (!nombre || !puesto || !correo || !telefono) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos'
    });
    return;
  }

  fetch(URL_SERVER + `/contacto/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, puesto, correo, telefono })
  })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Contacto actualizado',
        text: 'Los datos del contacto fueron actualizados correctamente'
      });
      cargarContactos(); 
    })
    .catch(error => {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Ocurrió un error al intentar actualizar el contacto'
      });
    });
}

function cancelarEdicion(boton, originales) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  fila.innerHTML = `
    <td>${originales.nombre}</td>
    <td>${originales.puesto}</td>
    <td>${originales.correo}</td>
    <td>${originales.telefono}</td>
    <td>
      <button onclick="editarContacto(this)">Editar</button>
    </td>
  `;
}


function eliminarContacto(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el contacto permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/contacto/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo eliminar el contacto');
          }
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Contacto eliminado',
            text: 'El contacto fue eliminado correctamente'
          });
          cargarContactos(); 
        })
        .catch(error => {
          console.error('Error al eliminar el contacto:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al eliminar el contacto'
          });
        });
    }
  });
}

window.eliminarContacto = eliminarContacto;
window.editarContacto = editarContacto;
window.añadirContacto = añadirContacto;
window.guardarContacto = guardarContacto;
window.cancelarContacto = cancelarContacto;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicion = cancelarEdicion;
