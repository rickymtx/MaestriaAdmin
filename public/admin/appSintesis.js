
import {URL_SERVER} from "../config1.js"

//Tabla Maestría con Orientación Profesional
fetch(URL_SERVER + '/maestriaOrientacion')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const materiaMaestria = documento.materia || '';
      const creditosMaestria = documento.creditos || '';

      tablaHTML += `
        <tr data-id="${id}">
          <td class="materia">${materiaMaestria}</td>
          <td class="creditos">${creditosMaestria}</td>
          <td>
              <button onclick="editarFila(this)" class="edit-btn">Editar</button>
              <button onclick="eliminarFila(this)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirOrientacion() {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td><input type="text" id="nuevaMateria" placeholder="Materia" class="input-amplio"></td>
    <td><input type="number" id="nuevosCreditos" placeholder="Créditos" class="input-amplio"></td>
    <td>
      <button onclick="guardarFila(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarFila(this)" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarFila(boton) {
  const fila = boton.closest('tr');
  const materia = fila.querySelector('#nuevaMateria').value;
  const creditos = fila.querySelector('#nuevosCreditos').value;

  if (!materia || !creditos) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.',
    });
    return;
  }

  const nuevoDato = {
    materia: materia,
    creditos: parseInt(creditos, 10)
  };

  fetch(URL_SERVER + '/maestriaOrientacion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoDato)
  })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Guardado correctamente',
        text: data.message,
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error al guardar los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los datos.',
      });
    });
}

function cancelarFila(boton) {
  const fila = boton.closest('tr');
  fila.remove();

  Swal.fire({
    icon: 'info',
    title: 'Cancelado',
    text: 'La fila fue eliminada.',
    timer: 1500,
    showConfirmButton: false
  });
}

function editarFila(boton) {
  const fila = boton.closest('tr');
  const materia = fila.querySelector('.materia').textContent;
  const creditos = fila.querySelector('.creditos').textContent;

  fila.innerHTML = `
    <td><input type="text" value="${materia}" class="edit-materia input-amplio" /></td>
    <td><input type="number" value="${creditos}" class="edit-creditos input-amplio" /></td>
    <td>
      <button onclick="guardarEdicion(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarEdicionOrientacion(this, '${materia}', '${creditos}')" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;
}

function guardarEdicion(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const materia = fila.querySelector('.edit-materia').value.trim();
  const creditos = parseInt(fila.querySelector('.edit-creditos').value.trim(), 10);

  if (!materia || isNaN(creditos)) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos inválidos',
      text: 'Por favor, completa todos los campos correctamente.',
    });
    return;
  }

  const datosActualizados = {
    materia,
    creditos
  };

  fetch(URL_SERVER + `/maestriaOrientacion/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: data.message,
        confirmButtonText: 'OK'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error al actualizar los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron actualizar los datos.',
      });
    });
}

function cancelarEdicionOrientacion(boton, materiaOriginal, creditosOriginal) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  fila.innerHTML = `
    <td class="materia">${materiaOriginal}</td>
    <td class="creditos">${creditosOriginal}</td>
    <td>
      <button onclick="editarFila(this)">Editar</button>
    </td>
  `;
}

function eliminarFila(boton) {
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
      fetch(URL_SERVER + `/maestriaOrientacion/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: data.message,
            confirmButtonText: 'OK'
          }).then(() => {
            location.reload();
          });
        })
        .catch(error => {
          console.error('Error al eliminar el documento:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el documento.'
          });
        });
    }
  });
}

//**********************************************************************************************//

// Tabla Distribución de Asignaturas
fetch(URL_SERVER + '/distribucionAsignaturas')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla2').getElementsByTagName('tbody')[0];
    tablaBody.innerHTML = '';

    data.forEach(doc => {
      const fila = document.createElement('tr');
      fila.setAttribute('data-id', doc.id); 

      fila.innerHTML = `
        <td>${doc.materia}</td>
        <td>${doc.creditos}</td>
        <td>
          <button onclick="editarAsignatura(this)" class="edit-btn">Editar</button>
          <button onclick="eliminarAsignatura(this)" class="delete-btn">Eliminar</button>
        </td>
      `;

      tablaBody.appendChild(fila);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirDistribucion() {
  const tablaBody = document.getElementById('tabla2').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');

  nuevaFila.innerHTML = `
    <td><input type="text" placeholder="Materia" class="input-materia-asignatura input-amplio"></td>
    <td><input type="number" placeholder="Créditos" class="input-creditos-asignatura input-amplio"></td>
    <td>
      <button onclick="guardarAsignatura(this)" class="btn-guardar-asignatura">Guardar</button>
      <button onclick="cancelarNuevaFila(this)" class="btn-cancelar-asignatura">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarAsignatura(boton) {
  const fila = boton.closest('tr');
  const materia = fila.querySelector('.input-materia-asignatura').value;
  const creditos = fila.querySelector('.input-creditos-asignatura').value;

  if (!materia || !creditos) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa ambos campos.'
    });
    return;
  }

  fetch(URL_SERVER + '/distribucionAsignaturas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      materia: materia,
      creditos: parseInt(creditos)
    })
  })
    .then(response => response.json())
    .then(data => {
      fila.innerHTML = `
        <td>${materia}</td>
        <td>${creditos}</td>
      `;

      Swal.fire({
        icon: 'success',
        title: 'Asignatura guardada',
        text: 'La asignatura se ha guardado correctamente.'
      });

      console.log("Asignatura guardada correctamente:", data);
    })
    .catch(error => {
      console.error('Error al guardar asignatura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar. Revisa la consola.'
      });
    });
}

function cancelarNuevaFila(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarAsignatura(boton) {
  const fila = boton.closest('tr');
  const tds = fila.querySelectorAll('td');
  const materia = tds[0].textContent;
  const creditos = tds[1].textContent;

  tds[0].innerHTML = `<input type="text" value="${materia}" class="input-editar-materia input-amplio">`;
  tds[1].innerHTML = `<input type="number" value="${creditos}" class="input-editar-creditos input-amplio">`;
  tds[2].innerHTML = `
    <button onclick="guardarEdicionAsignaturas(this)" class="save-btnSintesis">Guardar</button>
    <button onclick="cancelarEdicion(this, '${materia}', '${creditos}')" class="cancel-btnSintesis">Cancelar</button>
  `;
}

function guardarEdicionAsignaturas(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const materia = fila.querySelector('.input-editar-materia').value;
  const creditos = fila.querySelector('.input-editar-creditos').value;

  fetch(URL_SERVER + `/distribucionAsignaturas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      materia: materia,
      creditos: parseInt(creditos)
    })
  })
  .then(res => res.json())
  .then(data => {
    fila.innerHTML = `
      <td>${materia}</td>
      <td>${creditos}</td>
      <td>
        <button onclick="editarAsignatura(this)">Editar</button>
      </td>
    `;

    Swal.fire({
      icon: 'success',
      title: 'Asignatura actualizada',
      text: 'Los datos se actualizaron correctamente.'
    });

    console.log('Actualización exitosa:', data);
  })
  .catch(error => {
    console.error('Error al actualizar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'Ocurrió un error. Revisa la consola para más detalles.'
    });
  });
}

function cancelarEdicion(boton, materiaAnterior, creditosAnterior) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td>${materiaAnterior}</td>
    <td>${creditosAnterior}</td>
    <td>
      <button onclick="editarAsignatura(this)">Editar</button>
    </td>
  `;
}

function eliminarAsignatura(boton) {
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
      fetch(URL_SERVER + `/distribucionAsignaturas/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json())
      .then(data => {
        console.log('Documento eliminado:', data);
        fila.remove();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La asignatura fue eliminada correctamente.'
        });
      })
      .catch(error => {
        console.error('Error al eliminar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'Ocurrió un error. Revisa la consola.'
        });
      });
    }
  });
}

//**********************************************************************************************//

// Tabla Asignaturas Básicas
fetch(URL_SERVER + '/asignaturasBasicas')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla3').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const materiasBasicas = documento.materia || '';
      const creditosBasicas = documento.creditos || '';

      tablaHTML += `
        <tr data-id="${id}">
          <td>${materiasBasicas}</td>
          <td>${creditosBasicas}</td>
          <td>
            <button onclick="editarFilaBasicas(this)" class="edit-btn">Editar</button>
            <button onclick="eliminarFilaBasicas(this)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirBasicas() {
  const tablaBody = document.getElementById('tabla3').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');

  nuevaFila.innerHTML = `
    <td><input type="text" placeholder="Materia" class="input-materia input-amplio"></td>
    <td><input type="number" placeholder="Créditos" class="input-creditos input-amplio" min="0"></td>
    <td>
      <button onclick="guardarFilaBasicas(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarFilaBasicas(this)" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarFilaBasicas(boton) {
  const fila = boton.closest('tr');
  const materia = fila.querySelector('.input-materia').value.trim();
  const creditos = parseInt(fila.querySelector('.input-creditos').value);

  if (!materia || isNaN(creditos)) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos correctamente.'
    });
    return;
  }

  const nuevoDato = {
    materia,
    creditos
  };

  fetch(URL_SERVER + '/asignaturasBasicas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoDato)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        fila.innerHTML = `
        <td>${materia}</td>
        <td>${creditos}</td>
        <td>
          <button onclick="editarFilaBasicas(this)">Editar</button>
          <button onclick="eliminarFilaBasicas(this)">Eliminar</button>
        </td>
      `;

        Swal.fire({
          icon: 'success',
          title: 'Guardado correctamente',
          text: 'La asignatura se ha añadido a la tabla.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Hubo un error al guardar los datos.'
        });
      }
    })
    .catch(error => {
      console.error("Error al enviar los datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.'
      });
    });
}

function cancelarFilaBasicas(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}


function editarFilaBasicas(boton) {
  const fila = boton.closest('tr');
  const materia = fila.children[0].innerText;
  const creditos = fila.children[1].innerText;

  fila.innerHTML = `
    <td><input type="text" class="input-materia input-amplio" value="${materia}"></td>
    <td><input type="number" class="input-creditos input-amplio" value="${creditos}"></td>
    <td>
      <button onclick="guardarEdicionBasicas(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarEdicionBasicas(this, '${materia}', '${creditos}')" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;
}

function guardarEdicionBasicas(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');
  const materia = fila.querySelector('.input-materia').value.trim();
  const creditos = parseInt(fila.querySelector('.input-creditos').value);

  if (!materia || isNaN(creditos)) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos correctamente.'
    });
    return;
  }

  const nuevosDatos = { materia, creditos };

  fetch(URL_SERVER + `/asignaturasBasicas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevosDatos)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        fila.innerHTML = `
        <td>${materia}</td>
        <td>${creditos}</td>
        <td><button onclick="editarFila(this)">Editar</button></td>
      `;

        Swal.fire({
          icon: 'success',
          title: 'Actualización exitosa',
          text: 'La asignatura ha sido actualizada correctamente.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: data.error || 'Hubo un problema al actualizar los datos.'
        });
      }
    })
    .catch(error => {
      console.error("Error al actualizar los datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo conectar con el servidor.'
      });
    });
}

function cancelarEdicionBasicas(boton, materiaOriginal, creditosOriginal) {
  const fila = boton.closest('tr');

  fila.innerHTML = `
    <td>${materiaOriginal}</td>
    <td>${creditosOriginal}</td>
    <td><button onclick="editarFila(this)">Editar</button></td>
  `;
}


function eliminarFilaBasicas(boton) {
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
      fetch(URL_SERVER + `/asignaturasBasicas/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            fila.remove();

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La asignatura ha sido eliminada correctamente.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: data.error || 'Ocurrió un problema al eliminar la asignatura.'
            });
          }
        })
        .catch(error => {
          console.error("Error al eliminar el documento:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo conectar con el servidor.'
          });
        });
    }
  });
}

//**********************************************************************************************//

// Tabla Asignaturas Optativas
fetch(URL_SERVER + '/asignaturasOptativas')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tabla4').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id; 
      const materiasOptativas = documento.materia || '';
      const creditosOptativas = documento.creditos || '';

      tablaHTML += `
        <tr data-id="${id}">
          <td class="materia">${materiasOptativas}</td>
          <td class="creditos">${creditosOptativas}</td>
          <td>
              <button onclick="editarFilaOptativas(this)" class="edit-btn">Editar</button>
              <button onclick="eliminarFilaOptativas(this)" class="delete-btn">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirOptativas() {
  const tablaBody = document.getElementById("tabla4").getElementsByTagName("tbody")[0];

  const nuevaFila = document.createElement("tr");

  nuevaFila.innerHTML = `
    <td><input type="text" id="nuevaMateria" placeholder="Materia" class="input-amplio"></td>
    <td><input type="number" id="nuevosCreditos" placeholder="Créditos" class="input-amplio"></td>
    <td>
      <button onclick="guardarFilaOptativas(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarFilaOptativas(this)" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarFilaOptativas(boton) {
  const fila = boton.parentElement.parentElement;
  const materia = fila.querySelector("#nuevaMateria").value;
  const creditos = fila.querySelector("#nuevosCreditos").value;

  if (!materia || !creditos) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  fetch(URL_SERVER + "/asignaturasOptativas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      materia: materia,
      creditos: parseInt(creditos),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar en la base de datos");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fila guardada:", data);
      fila.innerHTML = `
        <td>${materia}</td>
        <td>${creditos}</td>
      `;
      Swal.fire({
        icon: 'success',
        title: 'Guardado correctamente',
        text: 'La asignatura optativa fue registrada.'
      });
    })
    .catch((error) => {
      console.error("Error al guardar la fila:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo guardar en la base de datos.'
      });
    });
}

function cancelarFilaOptativas(boton) {
  const fila = boton.parentElement.parentElement;
  fila.remove();
}

function editarFilaOptativas(boton) {
  const fila = boton.parentElement.parentElement;
  const materiaTexto = fila.querySelector(".materia").textContent;
  const creditosTexto = fila.querySelector(".creditos").textContent;

  fila.innerHTML = `
    <td><input type="text" value="${materiaTexto}" class="edit-materia input-amplio"></td>
    <td><input type="number" value="${creditosTexto}" class="edit-creditos input-amplio"></td>
    <td>
      <button onclick="guardarEdicionOptativas(this)" class="save-btnSintesis">Guardar</button>
      <button onclick="cancelarEdicionOptativas(this, '${materiaTexto}', '${creditosTexto}')" class="cancel-btnSintesis">Cancelar</button>
    </td>
  `;
}

function guardarEdicionOptativas(boton) {
  const fila = boton.parentElement.parentElement;
  const id = fila.getAttribute("data-id");
  const materia = fila.querySelector(".edit-materia").value;
  const creditos = fila.querySelector(".edit-creditos").value;

  fetch(URL_SERVER + `/asignaturasOptativas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      materia: materia,
      creditos: parseInt(creditos),
    }),
  })
    .then(response => {
      if (!response.ok) throw new Error("Error al actualizar");
      return response.json();
    })
    .then(() => {
      fila.innerHTML = `
        <td class="materia">${materia}</td>
        <td class="creditos">${creditos}</td>
        <td><button onclick="editarFilaOptativas(this)">Editar</button></td>
      `;
      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'La asignatura fue actualizada correctamente.'
      });
    })
    .catch(error => {
      console.error("Error en la actualización:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'No se pudo actualizar la asignatura.'
      });
    });
}

function cancelarEdicionOptativas(boton, materiaOriginal, creditosOriginal) {
  const fila = boton.parentElement.parentElement;
  fila.innerHTML = `
    <td class="materia">${materiaOriginal}</td>
    <td class="creditos">${creditosOriginal}</td>
    <td><button onclick="editarFilaOptativas(this)">Editar</button></td>
  `;
}

function eliminarFilaOptativas(boton) {
  const fila = boton.parentElement.parentElement;
  const id = fila.getAttribute("data-id");

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la asignatura optativa.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/asignaturasOptativas/${id}`, {
        method: "DELETE",
      })
        .then(response => {
          if (!response.ok) throw new Error("Error al eliminar");
          return response.json();
        })
        .then(() => {
          fila.remove();
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'La asignatura optativa fue eliminada correctamente.'
          });
        })
        .catch(error => {
          console.error("Error en la eliminación:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la asignatura.'
          });
        });
    }
  });
}

window.añadirOrientacion = añadirOrientacion;
window.guardarFila = guardarFila;
window.cancelarFila = cancelarFila;
window.editarFila = editarFila;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicionOrientacion = cancelarEdicionOrientacion;
window.eliminarFila = eliminarFila;

window.añadirDistribucion = añadirDistribucion;
window.guardarAsignatura = guardarAsignatura;
window.cancelarNuevaFila = cancelarNuevaFila;
window.editarAsignatura = editarAsignatura;
window.guardarEdicionAsignaturas = guardarEdicionAsignaturas;
window.cancelarEdicion = cancelarEdicion;
window.eliminarAsignatura = eliminarAsignatura;

window.añadirBasicas = añadirBasicas;
window.guardarFilaBasicas = guardarFilaBasicas;
window.cancelarFilaBasicas = cancelarFilaBasicas;
window.editarFilaBasicas = editarFilaBasicas;
window.guardarEdicionBasicas = guardarEdicionBasicas;
window.cancelarEdicionBasicas = cancelarEdicionBasicas;
window.eliminarFilaBasicas = eliminarFilaBasicas;

window.añadirOptativas = añadirOptativas;
window.guardarFilaOptativas = guardarFilaOptativas;
window.cancelarFilaOptativas = cancelarFilaOptativas;
window.editarFilaOptativas = editarFilaOptativas;
window.guardarEdicionOptativas = guardarEdicionOptativas;
window.cancelarEdicionOptativas = cancelarEdicionOptativas;
window.eliminarFilaOptativas = eliminarFilaOptativas;
