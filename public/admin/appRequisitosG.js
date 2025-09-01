
import {URL_SERVER} from "../config1.js"

// Requisitos para la obtención del grado académico
fetch(URL_SERVER + '/requisitosGrado')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('requisitos-container');
    contenedor.innerHTML = '';

    data.forEach(documento => {
      const requisitos = documento.requisitos || [];

      const aboutTextDiv = document.createElement('div');
      aboutTextDiv.classList.add('about-text');

      const titulo = document.createElement('h2');
      titulo.textContent = 'Requisitos para la obtención del grado académico';
      aboutTextDiv.appendChild(titulo);

      requisitos.forEach(req => {
        const parrafo = document.createElement('p');
        parrafo.textContent = `• ${req}`;
        aboutTextDiv.appendChild(parrafo);
      });

      contenedor.appendChild(aboutTextDiv);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

let documentoIdGlobal = '';

fetch(URL_SERVER + '/requisitosGrado')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById('requisitos-container');
    contenedor.innerHTML = '';

    data.forEach(documento => {
      documentoIdGlobal = documento.id;

      const requisitos = documento.requisitos || [];

      const aboutTextDiv = document.createElement('div');
      aboutTextDiv.classList.add('about-text');

      const titulo = document.createElement('h2');
      titulo.textContent = 'Requisitos para la obtención del grado académico';
      aboutTextDiv.appendChild(titulo);

      requisitos.forEach(req => {
        const parrafo = document.createElement('p');
        parrafo.textContent = `• ${req}`;
        aboutTextDiv.appendChild(parrafo);
      });

      contenedor.appendChild(aboutTextDiv);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function añadirRequisito() {
  if (document.getElementById('nuevo-requisito')) return;

  const contenedor = document.getElementById('requisitos-container');

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'nuevo-requisito';
  input.placeholder = 'Escribe el nuevo requisito';
  input.classList.add('input-requisito');

  const btnGuardar = document.createElement('button');
  btnGuardar.textContent = 'Guardar';
  btnGuardar.classList.add('guardar-btn');
  btnGuardar.onclick = guardarRequisito;

  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.classList.add('cancelar-btn');
  btnCancelar.onclick = () => {
    input.remove();
    btnGuardar.remove();
    btnCancelar.remove();
  };

  contenedor.appendChild(input);
  contenedor.appendChild(btnGuardar);
  contenedor.appendChild(btnCancelar);
}

function guardarRequisito() {
  const input = document.getElementById('nuevo-requisito');
  const nuevoTexto = input.value.trim();

  if (!nuevoTexto) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'Por favor escribe un requisito'
    });
    return;
  }

  fetch(URL_SERVER + `/requisitosGrado/${documentoIdGlobal}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requisito: nuevoTexto })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al guardar el requisito');
      return response.json();
    })
    .then(data => {
      console.log('Requisito guardado:', data);

      Swal.fire({
        icon: 'success',
        title: '¡Requisito guardado!',
        text: 'El nuevo requisito se ha agregado correctamente',
        confirmButtonText: 'Ok'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el requisito'
      });
    });
}


// Función para cargar y mostrar requisitos con opción de editar
function cargarRequisitos() {
  fetch(URL_SERVER + '/requisitosGrado')
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById('requisitos-container');
      contenedor.innerHTML = '';

      data.forEach(documento => {
        documentoIdGlobal = documento.id;

        const requisitos = documento.requisitos || [];

        const aboutTextDiv = document.createElement('div');
        aboutTextDiv.classList.add('about-text');

        const titulo = document.createElement('h2');
        titulo.textContent = 'Requisitos para la obtención del grado académico';
        aboutTextDiv.appendChild(titulo);

        requisitos.forEach((req, index) => {
          const reqContainer = document.createElement('div');
          reqContainer.classList.add('req-container');
          reqContainer.style.display = 'flex';
          reqContainer.style.alignItems = 'center';
          reqContainer.style.gap = '10px';
          reqContainer.style.marginBottom = '5px';

          const parrafo = document.createElement('p');
          parrafo.textContent = `• ${req}`;
          parrafo.style.margin = 0;
          parrafo.style.flex = '1';

          const btnEditar = document.createElement('button');
          btnEditar.textContent = 'Editar';
          btnEditar.classList.add('btnEditar');
          btnEditar.onclick = () => editarRequisito(reqContainer, req, index);

          const btnEliminar = document.createElement('button');
          btnEliminar.textContent = 'Eliminar';
          btnEliminar.classList.add('btnEliminar'); 
          btnEliminar.onclick = () => eliminarRequisito(index);

          reqContainer.appendChild(parrafo);
          reqContainer.appendChild(btnEditar);
          reqContainer.appendChild(btnEliminar);

          aboutTextDiv.appendChild(reqContainer);
        });

        contenedor.appendChild(aboutTextDiv);
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

function editarRequisito(container, textoOriginal, index) {
  container.innerHTML = ''; 

  const input = document.createElement('input');
  input.type = 'text';
  input.value = textoOriginal;
  input.classList.add('input-requisito'); 
  input.style.flex = '1';

  const btnGuardar = document.createElement('button');
  btnGuardar.textContent = 'Guardar';
  btnGuardar.classList.add('guardar-btn');
  btnGuardar.onclick = () => guardarEdicion(input.value.trim(), index);

  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.classList.add('cancelar-btn');
  btnCancelar.onclick = () => {

    container.innerHTML = '';
    const parrafo = document.createElement('p');
    parrafo.textContent = `• ${textoOriginal}`;
    parrafo.style.margin = 0;
    parrafo.style.flex = '1';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => editarRequisito(container, textoOriginal, index);

    container.appendChild(parrafo);
    container.appendChild(btnEditar);
  };

  container.appendChild(input);
  container.appendChild(btnGuardar);
  container.appendChild(btnCancelar);
}

function guardarEdicion(nuevoTexto, index) {
  if (!nuevoTexto) {
    Swal.fire({
      icon: 'warning',
      title: 'Campo vacío',
      text: 'El requisito no puede estar vacío'
    });
    return;
  }

  fetch(URL_SERVER + `/requisitosGrado/${documentoIdGlobal}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ index: index, nuevoRequisito: nuevoTexto })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar el requisito');
      return response.json();
    })
    .then(data => {
      console.log('Requisito actualizado:', data);

      Swal.fire({
        icon: 'success',
        title: '¡Requisito actualizado!',
        text: 'El requisito se ha modificado correctamente',
        confirmButtonText: 'Ok'
      }).then(() => {
        cargarRequisitos();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar el requisito'
      });
    });
}

cargarRequisitos();


function eliminarRequisito(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este requisito se eliminará permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/requisitosGrado/${documentoIdGlobal}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index: index })
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar el requisito');
          return response.json();
        })
        .then(data => {
          console.log('Requisito eliminado:', data);

          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El requisito se ha eliminado correctamente',
            confirmButtonText: 'Ok'
          }).then(() => {
            cargarRequisitos();
          });
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar el requisito'
          });
        });
    }
  });
}

window.añadirRequisito = añadirRequisito;
