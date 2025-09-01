
import {URL_SERVER} from "../config1.js"

//Tabla Cuerpos Académicos (Tabla 1)
fetch(URL_SERVER + '/cuerposAcademicos')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const nombreProyecto = documento.nomProy || '';
      const integrantes = documento.integrantes ? documento.integrantes.join('<br>') : '';
      const id = documento.id || documento._id;

      tablaHTML += `
        <tr data-id="${id}">
          <td>
            <div class="vista">
              ${nombreProyecto}<br>${integrantes}
              <br><button class="edit-btnCuerpos">Editar</button>
              <button class="delete-btnCuerpos">Eliminar</button>
            </div>
            <div class="edicion" style="display: none;">
              <textarea class="nombreEditado" rows="3" style="width: 100%;">${nombreProyecto}</textarea><br>
              <textarea class="integrantesEditados" rows="10" style="width: 100%;">${documento.integrantes ? documento.integrantes.join('\n') : ''}</textarea><br>
              <button class="save-btnCuerpos">Guardar</button>
              <button class="cancelar-btnCuerpos">Cancelar</button>
            </div>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;

    document.querySelectorAll('.edit-btnCuerpos').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        row.querySelector('.vista').style.display = 'none';
        row.querySelector('.edicion').style.display = 'block';
      });
    });

    document.querySelectorAll('.cancelar-btnCuerpos').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        row.querySelector('.edicion').style.display = 'none';
        row.querySelector('.vista').style.display = 'block';
      });
    });

    document.querySelectorAll('.save-btnCuerpos').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const id = row.dataset.id;
        const nuevoNombre = row.querySelector('.nombreEditado').value.trim();
        const nuevosIntegrantes = row.querySelector('.integrantesEditados').value.trim().split('\n').map(i => i.trim()).filter(i => i);

        if (!nuevoNombre || nuevosIntegrantes.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor llena todos los campos.'
          });
          return;
        }

        const cuerpoActualizado = {
          nomProy: nuevoNombre,
          integrantes: nuevosIntegrantes
        };

        fetch(URL_SERVER + `/cuerposAcademicos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuerpoActualizado)
        })
        .then(response => {
          if (!response.ok) throw new Error('Error al actualizar');
          return response.json();
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: 'El registro fue actualizado exitosamente.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            location.reload();
          });
        })
        .catch(error => {
          console.error('Error al actualizar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el registro.'
          });
        });
      });
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron obtener los datos del servidor.'
    });
  });


function añadirCuerpos() {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <textarea id="nuevoNombreProyecto" rows="2" placeholder="Nombre del cuerpo académico" style="width: 100%;"></textarea><br>
      <textarea id="nuevosIntegrantes" rows="3" placeholder="Integrantes (uno por línea)" style="width: 100%;"></textarea><br>
      <button id="guardarFila" class="save-btnCuerpos">Guardar</button>
      <button id="cancelarFila" class="cancelar-btnCuerpos">Cancelar</button>
    </td>
  `;
  tablaBody.appendChild(nuevaFila);

  document.getElementById('guardarFila').addEventListener('click', () => {
    const nombre = document.getElementById('nuevoNombreProyecto').value.trim();
    const integrantesTexto = document.getElementById('nuevosIntegrantes').value.trim();
    const integrantesArray = integrantesTexto.split('\n').map(i => i.trim()).filter(i => i);

    if (!nombre || integrantesArray.length === 0) {
      alert('Por favor llena todos los campos.');
      return;
    }

    const nuevoCuerpo = {
      nomProy: nombre,
      integrantes: integrantesArray
    };

    fetch(URL_SERVER + '/cuerposAcademicos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoCuerpo)
  })
  .then(response => {
    if (!response.ok) throw new Error('Error al guardar');
    return response.json();
  })
  .then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Guardado correctamente',
      text: 'El nuevo registro fue añadido.',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error('Error al guardar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo guardar el nuevo registro.'
    });
  });
  });

  document.getElementById('cancelarFila').addEventListener('click', () => {
    nuevaFila.remove();
  });
}


document.getElementById('tabla1').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btnCuerpos')) {
    const row = event.target.closest('tr');
    const id = row.dataset.id;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(URL_SERVER + `/cuerposAcademicos/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar');
          return response.json();
        })
        .then(() => {
          row.remove();
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El registro ha sido eliminado correctamente.',
            timer: 2000,
            showConfirmButton: false
          });
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el registro.'
          });
        });
      }
    });
  }
});


// Tabla Sistema Nacional de Investigadoras e Investigadores (Tabla 2)
fetch(URL_SERVER + '/sistemaNacional') 
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla2').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const numeroProfesores = documento.numProfesores || '';
      const nivelSistema = documento.nivelC || '';
      const nivelNacional = documento.nivel1 || '';
      const id = documento._id || documento.id; 

      tablaHTML += `
        <tr data-id="${id}">
          <td class="editable">${numeroProfesores}</td>
          <td class="editable">${nivelSistema}</td>
          <td class="editable">${nivelNacional}</td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

let datosOriginales = []; 

function editarSistema(btn) {
  const tabla = document.getElementById('tabla2');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  datosOriginales = [];

  for (let fila of filas) {
    const celdas = fila.querySelectorAll('td');
    const filaDatos = [];

    celdas.forEach((celda, index) => {
      const valor = celda.textContent.trim();
      filaDatos.push(valor);
      celda.innerHTML = `<input type="text" class="input-amplio" value="${valor}">`;
    });

    datosOriginales.push(filaDatos);
  }

  btn.style.display = 'none';
  document.querySelector('.save-btnSistema').style.display = 'inline-block';
  document.querySelector('.cancel-btnSistema').style.display = 'inline-block';
}

function guardarEdicionSistema(btn) {
  const tabla = document.getElementById('tabla2');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  let errores = false;

  const promesas = Array.from(filas).map(fila => {
    const id = fila.getAttribute('data-id');
    const inputs = fila.querySelectorAll('input');

    const nuevoDato = {
      numProfesores: inputs[0].value,
      nivelC: inputs[1].value,
      nivel1: inputs[2].value
    };

    return fetch(URL_SERVER + `/sistemaNacional/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoDato)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar los datos');
      return response.json();
    })
    .then(data => {
      inputs[0].parentElement.textContent = nuevoDato.numProfesores;
      inputs[1].parentElement.textContent = nuevoDato.nivelC;
      inputs[2].parentElement.textContent = nuevoDato.nivel1;
    })
    .catch(error => {
      errores = true;
      console.error('Error:', error);
    });
  });

  Promise.all(promesas).then(() => {
    if (errores) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar algunos cambios.'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Guardado',
        text: 'Los cambios se guardaron correctamente.'
      });
    }

    btn.style.display = 'none';
    document.querySelector('.cancel-btnSistema').style.display = 'none';
    document.querySelector('.edit-btnSistema').style.display = 'inline-block';
  });
}

function cancelarEdicionSistema(btn) {
  const tabla = document.getElementById('tabla2');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  if (!datosOriginales || datosOriginales.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin cambios',
      text: 'No hay datos originales para restaurar.'
    });
    return;
  }

  Array.from(filas).forEach((fila, index) => {
    const celdas = fila.querySelectorAll('td');
    const datosFila = datosOriginales[index];

    celdas.forEach((celda, i) => {
      celda.textContent = datosFila[i]; 
    });
  });

  Swal.fire({
    icon: 'info',
    title: 'Edición cancelada',
    text: 'Los cambios han sido descartados.'
  });

  btn.style.display = 'none';
  document.querySelector('.save-btnSistema').style.display = 'none';
  document.querySelector('.edit-btnSistema').style.display = 'inline-block';
}


//Tabla Perfil Deseable (Tabla 3)
fetch(URL_SERVER + '/perfilDeseable')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla3').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const numeroProfesores = documento.numProfesores || '';
      const id = documento.id; 

      tablaHTML += `
        <tr data-id="${id}">
          <td class="editable">${numeroProfesores}</td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });


  let originalDataPerfil = [];

  function editarPerfil(btn) {
  const tabla = document.getElementById('tabla3');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  originalDataPerfil = [];

  Array.from(filas).forEach(fila => {
    const celda = fila.querySelector('.editable');
    const textoOriginal = celda.innerText.trim();
    originalDataPerfil.push(textoOriginal);

    celda.innerHTML = `<textarea class="edit-area" rows="1">${textoOriginal}</textarea>`;
  });

  btn.style.display = 'none';
  document.querySelector('.save-btnPerfil').style.display = 'inline';
  document.querySelector('.cancel-btnPerfil').style.display = 'inline';
}

function guardarPerfil(btn) {
  const tabla = document.getElementById('tabla3');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  let actualizacionesExitosas = 0;

  Array.from(filas).forEach((fila, index, arr) => {
    const id = fila.getAttribute('data-id');
    const celda = fila.querySelector('.editable');
    const textarea = celda.querySelector('textarea');
    const valor = textarea ? textarea.value.trim() : celda.innerText.trim();

    const dataActualizada = { numProfesores: valor };

    fetch(URL_SERVER + `/perfilDeseable/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataActualizada)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error en la actualización');
      return response.json();
    })
    .then(result => {
      actualizacionesExitosas++;
      celda.innerHTML = valor;

      if (actualizacionesExitosas === arr.length) {
        Swal.fire({
          icon: 'success',
          title: '¡Actualización exitosa!',
          text: 'Los datos fueron actualizados correctamente.',
          confirmButtonColor: '#3085d6'
        });
      }
    })
    .catch(error => {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar los datos.',
        confirmButtonColor: '#d33'
      });
    });
  });

  btn.style.display = 'none';
  document.querySelector('.edit-btnPerfil').style.display = 'inline';
  document.querySelector('.cancel-btnPerfil').style.display = 'none';
}

function cancelarEdicionPerfil(btn) {
  const tabla = document.getElementById('tabla3');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  Array.from(filas).forEach((fila, i) => {
    const celda = fila.querySelector('.editable');
    celda.innerHTML = originalDataPerfil[i];
  });

  btn.style.display = 'none';
  document.querySelector('.edit-btnPerfil').style.display = 'inline';
  document.querySelector('.save-btnPerfil').style.display = 'none';
}


//Tabla Otros reconocimientos (Tabla 4)
fetch(URL_SERVER + '/otrosReconocimientos')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla4').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id; 
      const otroProfesor = documento.profesor || '';
      const tipoReconocimiento = documento.tipoRec || '';

      tablaHTML += `
        <tr data-id="${id}">
          <td class="profesor">${otroProfesor}</td>
          <td class="tipoRec">${tipoReconocimiento}</td>
          <td>
              <button onclick="editarFila(this)" class="edit-btnOtros">Editar</button>
              <button onclick="eliminarFila(this)" class="delete-btnOtros">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirReconocimientos() {
  const tabla = document.getElementById('tabla4').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');

  nuevaFila.innerHTML = `
    <td><input type="text" placeholder="Nombre del profesor" id="nuevoProfesor" class="input-amplio"></td>
    <td><input type="text" placeholder="Tipo de reconocimiento" id="nuevoReconocimiento" class="input-amplio"></td>
    <td>
      <button onclick="guardarFila(this)" class="save-btnOtros">Guardar</button>
      <button onclick="cancelarFila(this)" class="cancel-btnOtros ">Cancelar</button>
    </td>
  `;

  tabla.appendChild(nuevaFila);
}

function guardarFila(boton) {
  const fila = boton.closest('tr');
  const profesor = fila.querySelector('#nuevoProfesor').value.trim();
  const tipoRec = fila.querySelector('#nuevoReconocimiento').value.trim();

  if (!profesor || !tipoRec) {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Por favor completa todos los campos.'
    });
    return;
  }

  fetch(URL_SERVER + '/otrosReconocimientos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profesor, tipoRec })
  })
  .then(response => {
    if (!response.ok) throw new Error('Error al guardar');
    return response.json();
  })
  .then(data => {
    fila.innerHTML = `
      <td>${profesor}</td>
      <td>${tipoRec}</td>
    `;
    
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'La información se guardó correctamente.'
    });
  })
  .catch(error => {
    console.error('Error:', error);
    
    Swal.fire({
      icon: 'error',
      title: '¡Ocurrió un error!',
      text: 'No se pudo guardar la información.'
    });
  });
}

function cancelarFila(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarFila(boton) {
  const fila = boton.closest('tr');
  const profesor = fila.querySelector('.profesor').textContent;
  const tipoRec = fila.querySelector('.tipoRec').textContent;

  fila.dataset.originalProfesor = profesor;
  fila.dataset.originalTipoRec = tipoRec;

  fila.innerHTML = `
    <td><input type="text" value="${profesor}" class="edit-profesor input-amplio"></td>
    <td><input type="text" value="${tipoRec}" class="edit-reconocimiento input-amplio"></td>
    <td>
      <button onclick="guardarEdicion(this)" class="save-btnOtros ">Guardar</button>
      <button onclick="cancelarEdicion(this)" class="cancel-btnOtros ">Cancelar</button>
    </td>
  `;
}

function guardarEdicion(boton) {
  const fila = boton.closest('tr');
  const id = fila.dataset.id; 
  const profesor = fila.querySelector('.edit-profesor').value.trim();
  const tipoRec = fila.querySelector('.edit-reconocimiento').value.trim();

  if (!profesor || !tipoRec) {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Completa todos los campos.'
    });
    return;
  }

  fetch(URL_SERVER + `/otrosReconocimientos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profesor, tipoRec })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar');
      return response.json();
    })
    .then(data => {
      fila.innerHTML = `
        <td class="profesor">${profesor}</td>
        <td class="tipoRec">${tipoRec}</td>
        <td>
          <button onclick="editarFila(this)">Editar</button>
        </td>
      `;

      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'La información se ha actualizado correctamente.'
      });
    })
    .catch(error => {
      console.error('Error:', error);

      Swal.fire({
        icon: 'error',
        title: '¡Ocurrió un error!',
        text: 'No se pudo actualizar la información.'
      });
    });
}

function cancelarEdicion(boton) {
  const fila = boton.closest('tr');
  const profesor = fila.dataset.originalProfesor;
  const tipoRec = fila.dataset.originalTipoRec;

  fila.innerHTML = `
    <td class="profesor">${profesor}</td>
    <td class="tipoRec">${tipoRec}</td>
    <td>
      <button onclick="editarFila(this)">Editar</button>
    </td>
  `;
}

function eliminarFila(boton) {
  const fila = boton.closest('tr');
  const id = fila.dataset.id;

  Swal.fire({
  title: '¿Estás seguro?',
  text: 'Esta acción no se puede deshacer.',
  icon: 'warning',
  showCancelButton: true,
  cancelButtonText: 'Cancelar',
  confirmButtonText: 'Sí, eliminar',
  confirmButtonColor: '#d33',       
  cancelButtonColor: '#3085d6',    
  reverseButtons: false,
  buttonsStyling: true         
  }).then(result => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/otrosReconocimientos/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar');
          return response.json();
        })
        .then(data => {
          fila.remove();

          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El registro ha sido eliminado correctamente.'
          });
        })
        .catch(error => {
          console.error('Error:', error);

          Swal.fire({
            icon: 'error',
            title: '¡Ocurrió un error!',
            text: 'No se pudo eliminar el registro.'
          });
        });
    }
  });
}


//Tabla Convenios Firmados (Tabla 5)
fetch(URL_SERVER + '/conveniosFirmados')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla5').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const conveniosFirmados = documento.empresaProd || '';
      const id = documento.id; 

      tablaHTML += `
        <tr data-id="${id}">
          <td class="editable">${conveniosFirmados}</td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

let originalDataConvenios = [];

function editarConvenios(btn) {
  const tabla = document.getElementById('tabla5');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  originalDataConvenios = [];

  Array.from(filas).forEach(fila => {
    const celda = fila.querySelector('.editable');
    const textoOriginal = celda.innerText.trim();
    originalDataConvenios.push(textoOriginal);

    celda.innerHTML = `<textarea class="edit-area" rows="1">${textoOriginal}</textarea>`;
  });

  btn.style.display = 'none';
  document.querySelector('.save-btnConvenios').style.display = 'inline';
  document.querySelector('.cancel-btnConvenios').style.display = 'inline';
}

function guardarConvenios(btn) {
  const tabla = document.getElementById('tabla5');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  let actualizacionesExitosas = 0;

  Array.from(filas).forEach((fila, index, arr) => {
    const id = fila.getAttribute('data-id');
    const celda = fila.querySelector('.editable');
    const textarea = celda.querySelector('textarea');
    const valor = textarea ? textarea.value.trim() : celda.innerText.trim();

    const dataActualizada = { empresaProd: valor };

    fetch(URL_SERVER + `/conveniosFirmados/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataActualizada)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error en la actualización');
      return response.json();
    })
    .then(result => {
      actualizacionesExitosas++;
      celda.innerHTML = valor;

      if (actualizacionesExitosas === arr.length) {
        Swal.fire({
          icon: 'success',
          title: '¡Actualización exitosa!',
          text: 'Los datos fueron actualizados correctamente.',
          confirmButtonColor: '#3085d6'
        });
      }
    })
    .catch(error => {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar los datos.',
        confirmButtonColor: '#d33'
      });
    });
  });

  btn.style.display = 'none';
  document.querySelector('.edit-btnConvenios').style.display = 'inline';
  document.querySelector('.cancel-btnConvenios').style.display = 'none';
}

function cancelarEdicionConvenios(btn) {
  const tabla = document.getElementById('tabla5');
  const filas = tabla.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  Array.from(filas).forEach((fila, i) => {
    const celda = fila.querySelector('.editable');
    celda.innerHTML = originalDataConvenios[i];
  });

  btn.style.display = 'none';
  document.querySelector('.edit-btnConvenios').style.display = 'inline';
  document.querySelector('.save-btnConvenios').style.display = 'none';
}


//Tabla Participación en redes de investigación científica y tecnológica (Tabla 6)
fetch(URL_SERVER + '/participacionRedes')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla6').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const participacionRedes = documento.nombre || '';
      const id = documento.id;

      tablaHTML += `
        <tr data-id="${id}">
          <td>• <span class="nombre-red">${participacionRedes}</span></td>
          <td>
              <button onclick="editarFilaParticipacion(this)" class="edit-btnParti">Editar</button>
              <button onclick="eliminarFilaParticipacion(this)" class="delete-btnParti">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirFilaParticipacion() {
  const tablaBody = document.getElementById('tabla6').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');

  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Nombre de la Red" class="input-red input-amplio" />
      <br>
      <button onclick="guardarFilaParticipacion(this)" class="save-btnParti">Guardar</button>
      <button onclick="cancelarFila(this)" class="cancel-btnParti">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarFilaParticipacion(boton) {
  const fila = boton.closest('tr');
  const input = fila.querySelector('.input-red');
  const nombreRed = input.value.trim();

  if (nombreRed === "") {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'El campo no puede estar vacío.'
    });
    return;
  }

  fetch(URL_SERVER + '/participacionRedes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre: nombreRed })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del servidor:', data);
    fila.innerHTML = `<td>${nombreRed}</td>`;

    Swal.fire({
      icon: 'success',
      title: 'Guardado exitosamente',
      text: 'La fila se agregó correctamente.'
    });
  })
  .catch(error => {
    console.error('Error al guardar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al guardar',
      text: 'Hubo un problema. Inténtalo de nuevo.'
    });
  });
}

function editarFilaParticipacion(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const nombreActual = fila.querySelector('.nombre-red').textContent.trim();

  fila.innerHTML = `
    <td>
      <input type="text" value="${nombreActual}" class="input-red input-amplio" />
    </td>
    <td>
      <button onclick="guardarEdicionFila(this, '${id}')" class="save-btnParti">Guardar</button>
      <button onclick="cancelarEdicionFila(this, '${nombreActual}')" class="cancel-btnParti">Cancelar</button>
    </td>
  `;
}

function guardarEdicionFila(boton, id) {
  const fila = boton.closest('tr');
  const nuevoNombre = fila.querySelector('.input-red').value.trim();

  if (nuevoNombre === '') {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'El campo no puede estar vacío.'
    });
    return;
  }

  fetch(URL_SERVER + `/participacionRedes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre: nuevoNombre })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Actualizado:", data);
    fila.innerHTML = `
      <td><span class="nombre-red">${nuevoNombre}</span></td>
      <td>
        <button onclick="editarFilaParticipacion(this)" class="edit-btnParti">Editar</button>
      </td>
    `;

    Swal.fire({
      icon: 'success',
      title: 'Actualización exitosa',
      text: 'El campo se actualizó correctamente.'
    });
  })
  .catch(error => {
    console.error('Error al actualizar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'Hubo un problema. Inténtalo de nuevo.'
    });
  });
}

function cancelarEdicionFila(boton, nombreAnterior) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  fila.innerHTML = `
    <td><span class="nombre-red">${nombreAnterior}</span></td>
    <td>
      <button onclick="editarFilaParticipacion(this)" class="edit-btnParti">Editar</button>
    </td>
  `;
}

function eliminarFilaParticipacion(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/participacionRedes/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudo eliminar el documento");
        }
        return response.json();
      })
      .then(data => {
        console.log("Eliminado:", data);
        fila.remove();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La participación ha sido eliminada correctamente.'
        });
      })
      .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al eliminar el registro.'
        });
      });
    }
  });
}

window.añadirCuerpos = añadirCuerpos;
window.editarSistema = editarSistema;
window.guardarEdicionSistema = guardarEdicionSistema;
window.cancelarEdicionSistema = cancelarEdicionSistema;
window.editarPerfil = editarPerfil;
window.guardarPerfil = guardarPerfil;
window.cancelarEdicionPerfil = cancelarEdicionPerfil;
window.cancelarEdicionPerfil = cancelarEdicionPerfil;
window.añadirReconocimientos = añadirReconocimientos;
window.cancelarFila = cancelarFila;
window.guardarFila = guardarFila;
window.guardarFila = guardarFila;
window.editarFila = editarFila;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicion = cancelarEdicion;
window.eliminarFila = eliminarFila;
window.editarConvenios = editarConvenios;
window.guardarConvenios = guardarConvenios;
window.cancelarEdicionConvenios = cancelarEdicionConvenios;
window.añadirFilaParticipacion = añadirFilaParticipacion;
window.guardarFilaParticipacion = guardarFilaParticipacion;
window.editarFilaParticipacion = editarFilaParticipacion;
window.guardarEdicionFila = guardarEdicionFila;
window.cancelarEdicionFila = cancelarEdicionFila;
window.eliminarFilaParticipacion = eliminarFilaParticipacion;
