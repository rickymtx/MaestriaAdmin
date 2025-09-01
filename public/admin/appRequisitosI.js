
import {URL_SERVER} from "../config1.js"

// Requisitos y antecedentes académicos de ingreso de los candidatos
fetch(URL_SERVER + '/requisitosIngreso')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('requisitos-container');
    contenedor.innerHTML = ''; 

    data.forEach(documento => {
      const antecedentes = documento.antecedentes || [];
      const requisitos = documento.requisitos || [];
      const seleccion = documento.seleccion || [];

      const aboutTextDiv = document.createElement('div');
      aboutTextDiv.classList.add('about-text');

      // Título principal
      const tituloPrincipal = document.createElement('h2');
      tituloPrincipal.textContent = 'Requisitos y antecedentes académicos de ingreso de los candidatos';
      aboutTextDiv.appendChild(tituloPrincipal);

      // === Sección: Antecedentes ===
      const tituloAntecedentes = document.createElement('h3');
      tituloAntecedentes.classList.add('centrado');
      tituloAntecedentes.textContent = 'Antecedentes';
      aboutTextDiv.appendChild(tituloAntecedentes);

      antecedentes.forEach((item, index) => {
        const contenedorItem = document.createElement('div');
        contenedorItem.classList.add('item-contenedor');

        const textoSpan = document.createElement('span');
        textoSpan.classList.add('texto-antecedente');
        textoSpan.textContent = `• ${item}`;

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');

        const editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar';
        editarBtn.classList.add('editar-btn');
        editarBtn.onclick = () => editarAntecedente(index, item, contenedorItem);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('eliminar-btn');
        deleteBtn.onclick = () => eliminarAntecedente(index);

        btnContainer.appendChild(editarBtn);
        btnContainer.appendChild(deleteBtn);

        contenedorItem.appendChild(textoSpan);
        contenedorItem.appendChild(btnContainer);
        aboutTextDiv.appendChild(contenedorItem);
      });

      // Botón de acción Antecedentes
      const btnAntecedente = document.createElement('div');
      btnAntecedente.classList.add('actions');
      btnAntecedente.innerHTML = `<button onclick="añadirAntecedente(this)" class="añadir-btnAntecedentes">Añadir Antecedente</button>`;
      aboutTextDiv.appendChild(btnAntecedente);

      // === Sección: Requisitos ===
      const tituloRequisitos = document.createElement('h3');
      tituloRequisitos.classList.add('centrado');
      tituloRequisitos.textContent = 'Requisitos';
      aboutTextDiv.appendChild(tituloRequisitos);

      // Parrafo introductorio fijo
      const pIntroRequisitos = document.createElement('p');
      pIntroRequisitos.textContent = 'Los alumnos que soliciten ingreso al programa deberán de cubrir la fase de selección que incluye los siguientes puntos:';
      aboutTextDiv.appendChild(pIntroRequisitos);

      requisitos.forEach((item, index) => {
        const contenedorItem = document.createElement('div');
        contenedorItem.classList.add('item-contenedor');

        const textoSpan = document.createElement('span');
        textoSpan.classList.add('texto-requisito');
        textoSpan.textContent = `• ${item}`;

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');

        const editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar';
        editarBtn.classList.add('editar-btn');
        editarBtn.onclick = () => editarRequisito(index, item, contenedorItem);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('eliminar-btn');
        deleteBtn.onclick = () => eliminarRequisito(index);

        btnContainer.appendChild(editarBtn);
        btnContainer.appendChild(deleteBtn);

        contenedorItem.appendChild(textoSpan);
        contenedorItem.appendChild(btnContainer);
        aboutTextDiv.appendChild(contenedorItem);
      });

      // Botón de acción Requisitos
      const btnRequisito = document.createElement('div');
      btnRequisito.classList.add('actions');
      btnRequisito.innerHTML = `<button onclick="añadirRequisito(this)" class="añadir-btnRequisito">Añadir Requisito</button>`;
      aboutTextDiv.appendChild(btnRequisito);

      // === Sección: Proceso de Selección ===
      const tituloSeleccion = document.createElement('h3');
      tituloSeleccion.classList.add('centrado');
      tituloSeleccion.textContent = 'Proceso de Selección de Aspirantes';
      aboutTextDiv.appendChild(tituloSeleccion);

      // Parrafo introductorio fijo
      const pIntroSeleccion = document.createElement('p');
      pIntroSeleccion.textContent = 'La selección de estudiantes se basa en la evaluación de 3 aspectos básicos:';
      aboutTextDiv.appendChild(pIntroSeleccion);

      seleccion.forEach((item, index) => {
        const contenedorItem = document.createElement('div');
        contenedorItem.classList.add('item-contenedor');

        const textoSpan = document.createElement('span');
        textoSpan.classList.add('texto-seleccion');
        textoSpan.textContent = `• ${item}`;

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');

        const editarBtn = document.createElement('button');
        editarBtn.textContent = 'Editar';
        editarBtn.classList.add('editar-btn');
        editarBtn.onclick = () => editarSeleccion(index, item, contenedorItem);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('eliminar-btn');
        deleteBtn.onclick = () => eliminarSeleccion(index);

        btnContainer.appendChild(editarBtn);
        btnContainer.appendChild(deleteBtn);

        contenedorItem.appendChild(textoSpan);
        contenedorItem.appendChild(btnContainer);
        aboutTextDiv.appendChild(contenedorItem);
      });

      // Botón de acción Selección
      const btnSeleccion = document.createElement('div');
      btnSeleccion.classList.add('actions');
      btnSeleccion.innerHTML = `<button onclick="añadirSeleccion(this)" class="añadir-btnSeleccion">Añadir Selección</button>`;
      aboutTextDiv.appendChild(btnSeleccion);

      // Agregar todo al contenedor principal
      contenedor.appendChild(aboutTextDiv);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


// Añadir Antecedente
function añadirAntecedente(button) {
  const contenedor = button.parentElement;

  if (contenedor.querySelector('.input-group')) return;

  button.style.display = 'none';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nuevo antecedente';
  input.classList.add('input-antecedente');

  const buttonRow = document.createElement('div');
  buttonRow.classList.add('button-row');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => guardarAntecedente(input.value, contenedor, inputGroup, button);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => {
    inputGroup.remove();
    button.style.display = ''; 
  };

  buttonRow.appendChild(guardarBtn);
  buttonRow.appendChild(cancelarBtn);

  inputGroup.appendChild(input);
  inputGroup.appendChild(buttonRow);

  contenedor.appendChild(inputGroup);
}

function guardarAntecedente(valor, contenedor, inputGroup, addButton) {
  if (!valor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un antecedente válido.'
    });
    return;
  }

  addButton.style.display = 'none';

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        console.error("No hay documento existente para actualizar.");
        return;
      }

      const doc = data[0];
      const nuevosAntecedentes = [...(doc.antecedentes || []), valor];

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: nuevosAntecedentes,
          requisitos: doc.requisitos || [],
          seleccion: doc.seleccion || []
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: response.message || 'Antecedente añadido con éxito'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error('Error al guardar el antecedente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar el antecedente.'
        });

        addButton.style.display = '';
      });
    });
}

// Actualizar Antecedente
function editarAntecedente(index, valorOriginal, contenedor) {
  contenedor.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = valorOriginal;
  input.classList.add('input-antecedenteEdit');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => actualizarAntecedente(index, input.value);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => location.reload();

  contenedor.appendChild(input);
  contenedor.appendChild(guardarBtn);
  contenedor.appendChild(cancelarBtn);
}

function actualizarAntecedente(index, nuevoValor) {
  if (!nuevoValor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un antecedente válido.'
    });
    return;
  }

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        throw new Error("No hay documento existente para actualizar.");
      }

      const doc = data[0];
      const antecedentesActualizados = [...(doc.antecedentes || [])];
      antecedentesActualizados[index] = nuevoValor;

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: antecedentesActualizados,
          requisitos: doc.requisitos || [],
          seleccion: doc.seleccion || []
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El antecedente fue actualizado correctamente.'
        }).then(() => {
          location.reload();
        });
      })
      .catch(error => {
        console.error('Error al actualizar el antecedente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el antecedente.'
        });
      });
    });
}

// Eliminar Antecedente
function eliminarAntecedente(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el antecedente seleccionado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

      fetch(URL_SERVER + '/requisitosIngreso')
        .then(res => res.json())
        .then(data => {
          if (!data.length) {
            Swal.fire('Error', 'No hay datos para eliminar', 'error');
            return;
          }

          const doc = data[0];
          const antecedentesActuales = doc.antecedentes || [];

          antecedentesActuales.splice(index, 1);

          fetch(URL_SERVER + '/requisitosIngreso', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              antecedentes: antecedentesActuales,
              requisitos: doc.requisitos || [],
              seleccion: doc.seleccion || []
            })
          })
          .then(res => res.json())
          .then(response => {
            Swal.fire('¡Eliminado!', 'El antecedente fue eliminado correctamente.', 'success')
              .then(() => location.reload());
          })
          .catch(err => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el antecedente.', 'error');
          });
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo leer la información actual.', 'error');
        });
    }
  });
}


// Añadir Requisito
function añadirRequisito(button) {
  const contenedor = button.parentElement;

  if (contenedor.querySelector('.input-group')) return;

  button.style.display = 'none';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nuevo requisito';
  input.classList.add('input-requisito');

  const buttonRow = document.createElement('div');
  buttonRow.classList.add('button-row');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => guardarRequisito(input.value, contenedor, inputGroup, button);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => {
    inputGroup.remove();
    button.style.display = '';
  };

  buttonRow.appendChild(guardarBtn);
  buttonRow.appendChild(cancelarBtn);

  inputGroup.appendChild(input);
  inputGroup.appendChild(buttonRow);

  contenedor.appendChild(inputGroup);
}

function guardarRequisito(valor, contenedor, inputGroup, addButton) {
  if (!valor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un requisito válido.'
    });
    return;
  }

  addButton.style.display = 'none';

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        console.error("No hay documento existente para actualizar.");
        return;
      }

      const doc = data[0];
      const nuevosRequisitos = [...(doc.requisitos || []), valor];

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: doc.antecedentes || [],
          requisitos: nuevosRequisitos,
          seleccion: doc.seleccion || []
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: response.message || 'Requisito añadido con éxito'
        }).then(() => {
          location.reload();
        });
      })
      .catch(error => {
        console.error('Error al guardar el requisito:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar el requisito.'
        });

        addButton.style.display = '';
      });
    });
}

// Actualizar Requisito
function editarRequisito(index, valorOriginal, contenedor) {
  contenedor.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = valorOriginal;
  input.classList.add('input-requisitoEdit');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => actualizarRequisito(index, input.value);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => location.reload();

  contenedor.appendChild(input);
  contenedor.appendChild(guardarBtn);
  contenedor.appendChild(cancelarBtn);
}

function actualizarRequisito(index, nuevoValor) {
  if (!nuevoValor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un requisito válido.'
    });
    return;
  }

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        throw new Error("No hay documento existente para actualizar.");
      }

      const doc = data[0];
      const requisitosActualizados = [...(doc.requisitos || [])];
      requisitosActualizados[index] = nuevoValor;

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: doc.antecedentes || [],
          requisitos: requisitosActualizados,
          seleccion: doc.seleccion || []
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El requisito fue actualizado correctamente.'
        }).then(() => {
          location.reload();
        });
      })
      .catch(error => {
        console.error('Error al actualizar el requisito:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el requisito.'
        });
      });
    });
}

// Eliminar Requisito 
function eliminarRequisito(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará el requisito permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + '/requisitosIngreso')
        .then(res => res.json())
        .then(data => {
          if (!data.length) {
            throw new Error("No hay documento existente.");
          }

          const doc = data[0];
          const requisitosActualizados = [...(doc.requisitos || [])];
          requisitosActualizados.splice(index, 1);

          fetch(URL_SERVER + '/requisitosIngreso', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              antecedentes: doc.antecedentes || [],
              requisitos: requisitosActualizados,
              seleccion: doc.seleccion || []
            })
          })
            .then(res => res.json())
            .then(response => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El requisito fue eliminado correctamente.'
              }).then(() => {
                location.reload();
              });
            })
            .catch(error => {
              console.error('Error al eliminar el requisito:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar el requisito.'
              });
            });
        });
    }
  });
}


// Añadir Selección
function añadirSeleccion(button) {
  const contenedor = button.parentElement;

  if (contenedor.querySelector('.input-group')) return;

  button.style.display = 'none';

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nueva selección';
  input.classList.add('input-requisito');

  const buttonRow = document.createElement('div');
  buttonRow.classList.add('button-row');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => guardarSeleccion(input.value, contenedor, inputGroup, button);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => {
    inputGroup.remove();
    button.style.display = '';
  };

  buttonRow.appendChild(guardarBtn);
  buttonRow.appendChild(cancelarBtn);

  inputGroup.appendChild(input);
  inputGroup.appendChild(buttonRow);

  contenedor.appendChild(inputGroup);
}

function guardarSeleccion(valor, contenedor, inputGroup, addButton) {
  if (!valor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un valor válido para selección.'
    });
    return;
  }

  addButton.style.display = 'none';

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        console.error("No hay documento existente para actualizar.");
        return;
      }

      const doc = data[0];
      const nuevaSeleccion = [...(doc.seleccion || []), valor];

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: doc.antecedentes || [],
          requisitos: doc.requisitos || [],
          seleccion: nuevaSeleccion
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: response.message || 'Selección añadida con éxito'
        }).then(() => {
          location.reload();
        });
      })
      .catch(error => {
        console.error('Error al guardar la selección:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar la selección.'
        });

        addButton.style.display = '';
      });
    });
}

// Actualizar Selección
function editarSeleccion(index, valorOriginal, contenedor) {
  contenedor.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = valorOriginal;
  input.classList.add('input-seleccionEdit');

  const guardarBtn = document.createElement('button');
  guardarBtn.textContent = 'Guardar';
  guardarBtn.classList.add('guardar-btn');
  guardarBtn.onclick = () => actualizarSeleccion(index, input.value);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.classList.add('cancelar-btn');
  cancelarBtn.onclick = () => location.reload();

  contenedor.appendChild(input);
  contenedor.appendChild(guardarBtn);
  contenedor.appendChild(cancelarBtn);
}

function actualizarSeleccion(index, nuevoValor) {
  if (!nuevoValor.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor, ingresa un valor válido.'
    });
    return;
  }

  fetch(URL_SERVER + '/requisitosIngreso')
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        throw new Error("No hay documento existente para actualizar.");
      }

      const doc = data[0];
      const seleccionActualizada = [...(doc.seleccion || [])];
      seleccionActualizada[index] = nuevoValor;

      fetch(URL_SERVER + '/requisitosIngreso', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          antecedentes: doc.antecedentes || [],
          requisitos: doc.requisitos || [],
          seleccion: seleccionActualizada
        })
      })
      .then(res => res.json())
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El elemento de selección fue actualizado correctamente.'
        }).then(() => {
          location.reload();
        });
      })
      .catch(error => {
        console.error('Error al actualizar la selección:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la selección.'
        });
      });
    });
}

// Eliminar Selección
function eliminarSeleccion(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el elemento de selección.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar' 
  }).then(result => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + '/requisitosIngreso')
        .then(res => res.json())
        .then(data => {
          const doc = data[0];
          const nuevaSeleccion = [...(doc.seleccion || [])];
          nuevaSeleccion.splice(index, 1);

          fetch(URL_SERVER + '/requisitosIngreso', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              antecedentes: doc.antecedentes || [],
              requisitos: doc.requisitos || [],
              seleccion: nuevaSeleccion
            })
          })
          .then(res => res.json())
          .then(() => {
            Swal.fire('Eliminado', 'El elemento de selección fue eliminado.', 'success')
              .then(() => location.reload());
          })
          .catch(error => {
            console.error('Error al eliminar la selección:', error);
            Swal.fire('Error', 'No se pudo eliminar el elemento.', 'error');
          });
        });
    }
  });
}

window.añadirAntecedente = añadirAntecedente;
window.añadirRequisito = añadirRequisito;
window.añadirSeleccion = añadirSeleccion;
