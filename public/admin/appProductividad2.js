
import {URL_SERVER} from "../config1.js"

// Tabla LGAC: Ingeniería en Sistemas (ARTICULOS)
fetch(URL_SERVER + '/lgacArticulos')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaArticulos').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id; 
      const tituloArticulo = documento.titulo || '';
      const descripcionArticulo = documento.descripcion || '';
      const urlArticulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-articulo" data-id="${id}">
          <td onclick="window.open('${urlArticulo}', '_blank')">
            <strong class="titulo-articulo">${tituloArticulo}</strong><br>
            <span class="descripcion-articulo">${descripcionArticulo}</span>
            <br><small style="color:gray">${urlArticulo}</small>
          </td>
          <td>
            <button onclick="editarArticulo(this)" class="edit-btnArticulos">Editar</button>
            <button onclick="eliminarArticulo('${id}')" class="delete-btnArticulos">Eliminar</button>
          </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirArticulos(boton) {
  const tablaBody = document.getElementById('tablaArticulos').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Artículo" id="nuevoTitulo" class="input-articulo" /><br>
      <input type="text" placeholder="Descripción del Artículo" id="nuevaDescripcion" class="input-articulo" /><br>
      <input type="text" placeholder="URL del Artículo" id="nuevaURL" class="input-articulo" /><br>
      <button onclick="guardarArticulo(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarArticulo(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarArticulo(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.'
    });
    return;
  }

  const nuevoArticulo = { titulo, descripcion, url };

  fetch(URL_SERVER + '/lgacArticulos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo guardado',
      text: 'El artículo se ha guardado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });
  })
  .catch(error => {
    console.error("Error al guardar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarArticulo(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}


function editarArticulo(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  const titulo = fila.querySelector('.titulo-articulo').innerText;
  const descripcion = fila.querySelector('.descripcion-articulo').innerText;
  const url = fila.querySelector('small')?.innerText || '';

  fila.innerHTML = `
    <td>
      <input type="text" value="${titulo}" class="input-articulo" id="editarTitulo"><br>
      <input type="text" value="${descripcion}" class="input-articulo" id="editarDescripcion"><br>
      <input type="text" value="${url}" class="input-articulo" id="editarURL"><br>
    </td>
    <td>
      <button onclick="guardarEdicion(this, '${id}')" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarEdicion(this, '${titulo}', '${descripcion}', '${url}')" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicion(boton, id) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editarTitulo').value.trim();
  const descripcion = fila.querySelector('#editarDescripcion').value.trim();
  const url = fila.querySelector('#editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const articuloActualizado = { titulo, descripcion, url };

  fetch(URL_SERVER + `/lgacArticulos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articuloActualizado)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo actualizado',
      text: 'El artículo se ha actualizado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error("Error al actualizar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicion(boton, titulo, descripcion, url) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-articulo">${titulo}</strong><br>
      <span class="descripcion-articulo">${descripcion}</span>
      <br><small style="color:gray">${url}</small>
    </td>
    <td>
      <button onclick="editarArticulo(this)">Editar</button>
    </td>
  `;
}

function eliminarArticulo(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgacArticulos/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El artículo ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error("Error al eliminar el artículo:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar el artículo.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// Tabla LGAC: Ingeniería en Sistemas (CAPITULOS)
fetch(URL_SERVER + '/lgacCapitulos')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaCapitulos').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach((documento, index) => {
      const id = documento.id; 
      const titulo = documento.titulo || '';
      const descripcion = documento.descripcion || '';
      const url = documento.url || '';

      tablaHTML += `
        <tr class="fila-capitulos" data-id="${id}">
          <td onclick="window.open('${url}', '_blank')">
            <strong class="titulo-capitulos">${titulo}</strong><br>
            <span class="descripcion-capitulos">${descripcion}</span>
            <br><small style="color:grey">${url}</small>
          </td>
          <td>
            <button onclick="editarCapitulo(this)" class="edit-btnCapitulos">Editar</button>
            <button onclick="eliminarCapitulo(this)" class="delete-btnCapitulos">Eliminar</button>
          </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirCapitulos(btn) {
  const tablaBody = document.getElementById('tablaCapitulos').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.classList.add('fila-nueva');

  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Capítulo" class="input-titulo" /><br>
      <input type="text" placeholder="Descripción del Capítulo" class="input-descripcion" /><br>
      <input type="text" placeholder="URL del Capítulo" class="input-url" /><br>
      <button onclick="guardarCapitulo(this)" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarCapitulo(this)" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarCapitulo(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('.input-titulo').value.trim();
  const descripcion = fila.querySelector('.input-descripcion').value.trim();
  const url = fila.querySelector('.input-url').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  const nuevoCapitulo = {
    titulo: titulo,
    descripcion: descripcion,
    url: url
  };

  fetch(URL_SERVER + '/lgacCapitulos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoCapitulo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al guardar el capítulo");
      }
      return response.json();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo guardado',
        text: 'El nuevo capítulo se ha añadido correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el capítulo.'
      });
    });
}

function cancelarCapitulo(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}


function editarCapitulo(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");
  const titulo = fila.querySelector("strong").innerText;
  const descripcion = fila.querySelector("span").innerText;
  const url = fila.querySelector("small").innerText;

  fila.innerHTML = `
    <td>
      <input type="text" class="input-titulo" value="${titulo}" style="width:100%;"><br>
      <input type="text" class="input-descripcion" value="${descripcion}" style="width:100%;"><br>
      <input type="text" class="input-url" value="${url}" style="width:100%;">
    </td>
    <td>
      <button onclick="guardarEdicionCapitulo(this, '${id}')" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarEdicionCapitulo(this, '${titulo}', '${descripcion}', '${url}', '${id}')" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionCapitulo(btn, id) {
  const fila = btn.closest("tr");
  const nuevoTitulo = fila.querySelector(".input-titulo").value.trim();
  const nuevaDescripcion = fila.querySelector(".input-descripcion").value.trim();
  const nuevaUrl = fila.querySelector(".input-url").value.trim();

  if (!nuevoTitulo || !nuevaDescripcion || !nuevaUrl) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos antes de guardar.'
    });
    return;
  }

  const datosActualizados = {
    titulo: nuevoTitulo,
    descripcion: nuevaDescripcion,
    url: nuevaUrl
  };

  fetch(URL_SERVER + `/lgacCapitulos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la actualización");
      }
      return res.json();
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo actualizado',
        text: 'Los datos del capítulo fueron actualizados correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al actualizar el capítulo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el capítulo.'
      });
    });
}

function cancelarEdicionCapitulo(btn, titulo, descripcion, url, id) {
  const fila = btn.closest("tr");
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-capitulos">${titulo}</strong><br>
      <span class="descripcion-capitulos">${descripcion}</span>
      <br><small style="color:grey">${url}</small>
    </td>
    <td>
      <button onclick="editarCapitulo(this)">Editar</button>
    </td>
  `;
  fila.setAttribute("data-id", id);
}


function eliminarCapitulo(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");

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
      fetch(URL_SERVER + `/lgacCapitulos/${id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al eliminar");
          }
          return response.json();
        })
        .then(data => {
          const siguienteFila = fila.nextElementSibling;
          fila.remove();
          if (siguienteFila && siguienteFila.classList.contains("separator")) {
            siguienteFila.remove();
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El capítulo ha sido eliminado correctamente.',
            confirmButtonText: 'OK'
          });
        })
        .catch(error => {
          console.error("Error al eliminar el capítulo:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el capítulo.'
          });
        });
    }
  });
}


// Tabla LGAC: Ingeniería en Sistemas (PROYECTOS)
fetch(URL_SERVER + '/lgacProyectos')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaProyectos').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloProyecto = documento.titulo || '';
      const descripcionProyecto = documento.descripcion || '';
      const urlProyecto = documento.url || '';

      tablaHTML += `
        <tr class="fila-proyectos" data-id="${id}">
            <td onclick="window.open('${urlProyecto}', '_blank')">
                <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                <span class="descripcion-proyectos">${descripcionProyecto}</span>
                <br><small style="color:gray">${urlProyecto}</small>
            </td>
            <td>
                <button onclick="editarProyecto(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarProyecto(this)" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirProyecto(boton) {
  const tablaBody = document.getElementById('tablaProyectos').getElementsByTagName('tbody')[0];

  if (document.getElementById('fila-edicion')) return;

  const nuevaFila = document.createElement('tr');
  nuevaFila.id = 'fila-edicion';
  nuevaFila.innerHTML = `
    <td>
      <input type="text" id="nuevoTitulo" placeholder="Título del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaDescripcion" placeholder="Descripción del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaURL" placeholder="URL del Proyecto" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarProyecto()" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarProyecto()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function cancelarProyecto() {
  const fila = document.getElementById('fila-edicion');
  if (fila) fila.remove();
}

function guardarProyecto() {
  const titulo = document.getElementById('nuevoTitulo').value.trim();
  const descripcion = document.getElementById('nuevaDescripcion').value.trim();
  const url = document.getElementById('nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos.'
    });
    return;
  }

  const nuevoProyecto = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + '/lgacProyectos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoProyecto)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al guardar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto guardado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto guardado',
      text: 'El nuevo proyecto ha sido agregado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      cancelarProyecto();
      recargarProyectos();
    });

  })
  .catch(error => {
    console.error('Error al guardar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al guardar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function recargarProyectos() {
  fetch(URL_SERVER + '/lgacProyectos')
    .then(response => response.json())
    .then(data => {
      const tablaBody = document.getElementById('tablaProyectos').getElementsByTagName('tbody')[0];
      let tablaHTML = '';

      data.forEach(documento => {
          const id = documento.id;
          const tituloProyecto = documento.titulo || '';
          const descripcionProyecto = documento.descripcion || '';
          const urlProyecto = documento.url || '';

          tablaHTML += `
            <tr class="fila-proyectos" data-id="${id}">
                <td onclick="window.open('${urlProyecto}', '_blank')">
                    <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                    <span class="descripcion-proyectos">${descripcionProyecto}</span>
                    <br><small style="color:gray">${urlProyecto}</small>
                </td>
                <td>
                    <button onclick="editarProyecto(this)" class="edit-btnArticulos">Editar</button>
                    <button onclick="eliminarProyecto(this)" class="delete-btnArticulos">Eliminar</button>
                </td>
            </tr>
            <tr class="espacio separator"></tr>
          `;
        });

      tablaBody.innerHTML = tablaHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

recargarProyectos();


function editarProyecto(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  if (document.getElementById('fila-edicion')) return;

  const titulo = fila.querySelector('.titulo-proyectos').innerText;
  const descripcion = fila.querySelector('.descripcion-proyectos').innerText;
  const url = fila.querySelector('small').innerText;

  fila.innerHTML = `
    <td>
      <input type="text" id="editarTitulo" value="${titulo}" class="input-tabla"/><br>
      <input type="text" id="editarDescripcion" value="${descripcion}" class="input-tabla"/><br>
      <input type="text" id="editarURL" value="${url}" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarEdicionProyectos('${id}', this)" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarEdicionProyectos()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  fila.id = 'fila-edicion';
}

function guardarEdicionProyectos(id, boton) {
  const fila = boton.closest('tr');

  const titulo = document.getElementById('editarTitulo').value.trim();
  const descripcion = document.getElementById('editarDescripcion').value.trim();
  const url = document.getElementById('editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const datosActualizados = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + `/lgacProyectos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al actualizar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto actualizado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto actualizado',
      text: 'El proyecto ha sido editado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      recargarProyectos(); 
    });
  })
  .catch(error => {
    console.error('Error al actualizar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionProyectos() {
  recargarProyectos(); 
}

function eliminarProyecto(boton) {
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
      const fila = boton.closest("tr.fila-proyectos");
      const id = fila.getAttribute("data-id");

      fetch(URL_SERVER + `/lgacProyectos/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar el documento");
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);

        const siguienteFila = fila.nextElementSibling;
        if (siguienteFila && siguienteFila.classList.contains("espacio")) {
          siguienteFila.remove();
        }
        fila.remove();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El proyecto fue eliminado correctamente.',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar el proyecto.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// Producción LGAC:  Instrumentación y Bioelectrónica (ARTICULOS) 
fetch(URL_SERVER + '/lgacArticulos2')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaArticulos2').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloArticulo = documento.titulo || '';
      const descripcionArticulo = documento.descripcion || '';
      const urlArticulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-articulo" data-id="${id}">
            <td onclick="window.open('${urlArticulo}', '_blank')">
                <strong class="titulo-articulo">${tituloArticulo}</strong><br>
                <span class="descripcion-articulo">${descripcionArticulo}</span>
                <br><small style="color:gray">${urlArticulo}</small>
            </td>
            <td>
                <button onclick="editarArticulo2(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarArticulo2(this)" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirArticulo2(boton) {
  const tablaBody = document.getElementById('tablaArticulos2').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.classList.add('fila-nueva');

  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Artículo" id="nuevoTitulo" class="input-titulo" /><br>
      <input placeholder="Descripción del Artículo" id="nuevaDescripcion" class="input-descripcion" /><br>
      <input type="url" placeholder="URL del Artículo" id="nuevaUrl" class="input-url" /><br>
      <button onclick="guardarNuevoArticulo2(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarNuevoArticulo2(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarNuevoArticulo2(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaUrl').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios.'
    });
    return;
  }

  const nuevoArticulo = {
    titulo: titulo,
    descripcion: descripcion,
    url: url
  };

  fetch(URL_SERVER + '/lgacArticulos2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al guardar el artículo.");
    }
    return response.json();
  })
  .then(data => {

  Swal.fire({
    icon: 'success',
    title: '¡Artículo añadido!',
    text: 'El artículo se agregó correctamente.',
    confirmButtonText: 'OK'
  });

  fila.remove();

  return fetch(URL_SERVER + '/lgacArticulos2');
  })
  .then(res => res.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaArticulos2').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloArticulo = documento.titulo || '';
      const descripcionArticulo = documento.descripcion || '';
      const urlArticulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-articulo" data-id="${id}">
          <td onclick="window.open('${urlArticulo}', '_blank')">
              <strong class="titulo-articulo">${tituloArticulo}</strong><br>
              <span class="descripcion-articulo">${descripcionArticulo}</span>
              <br><small style="color:gray">${urlArticulo}</small>
          </td>
          <td>
              <button onclick="editarArticulo2(this)" class="edit-btnArticulos">Editar</button>
              <button onclick="eliminarArticulo2(this)" class="delete-btnArticulos">Eliminar</button>
          </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error("Error al guardar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el artículo.'
    });
  });
}

function cancelarNuevoArticulo2(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}


function editarArticulo2(botonEditar) {
    const fila = botonEditar.closest('tr');
    const id = fila.dataset.id;

    fila.dataset.originalHtml = fila.innerHTML;

    const titulo = fila.querySelector('.titulo-articulo').innerText;
    const descripcion = fila.querySelector('.descripcion-articulo').innerText;
    const url = fila.querySelector('small').innerText;

    fila.innerHTML = `
        <td>
            <input type="text" class="input-titulo" value="${titulo}" placeholder="Título" style="width: 100%"><br>
            <input type="text" class="input-descripcion" value="${descripcion}" placeholder="Descripción" style="width: 100%"><br>
            <input type="text" class="input-url" value="${url}" placeholder="URL" style="width: 100%">
        </td>
        <td>
            <button onclick="guardarEdicionArticulo2(this, '${id}')" class="save-btnArticulos">Guardar</button>
            <button onclick="cancelarEdicionArticulo2(this)" class="cancel-btnArticulos">Cancelar</button>
        </td>
    `;
}

function guardarEdicionArticulo2(botonGuardar, id) {
    const fila = botonGuardar.closest('tr');
    const titulo = fila.querySelector('.input-titulo').value.trim();
    const descripcion = fila.querySelector('.input-descripcion').value.trim();
    const url = fila.querySelector('.input-url').value.trim();

    const datosActualizados = {
        titulo,
        descripcion,
        url
    };

    fetch(URL_SERVER + `/lgacArticulos2/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el artículo');
        }
        return response.json();
    })
    .then(data => {
        console.log('Actualizado:', data);

        fila.innerHTML = `
            <td onclick="window.open('${url}', '_blank')">
                <strong class="titulo-articulo">${titulo}</strong><br>
                <span class="descripcion-articulo">${descripcion}</span>
                <br><small style="color:gray">${url}</small>
            </td>
            <td>
                <button onclick="editarArticulo2(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarArticulo2(this)" class="delete-btnArticulos">Eliminar</button>
            </td>
        `;

        Swal.fire({
            icon: 'success',
            title: '¡Artículo actualizado!',
            text: 'Los cambios se guardaron correctamente.',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error al actualizar el artículo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar el artículo.',
            confirmButtonText: 'OK'
        });
    });
}

function cancelarEdicionArticulo2(botonCancelar) {
    const fila = botonCancelar.closest('tr');
    const originalHtml = fila.dataset.originalHtml;

    if (originalHtml) {
        fila.innerHTML = originalHtml;
    }
}

function eliminarArticulo2(botonEliminar) {
    const fila = botonEliminar.closest('tr');
    const id = fila.dataset.id;

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este artículo se eliminará permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(URL_SERVER + `/lgacArticulos2/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo eliminar el artículo");
                }
                return response.json();
            })
            .then(data => {
                console.log("Artículo eliminado:", data);
                fila.nextElementSibling?.remove(); 
                fila.remove();

                Swal.fire({
                    title: '¡Artículo eliminado!',
                    text: 'El artículo se eliminó correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error("Error al eliminar el artículo:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar el artículo.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        }
    });
}


// Producción LGAC:  Instrumentación y Bioelectrónica (CAPITULOS)
fetch(URL_SERVER + '/lgacCapitulos2')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaCapitulos2').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach((documento, index) => {
      const id = documento.id; 
      const titulo = documento.titulo || '';
      const descripcion = documento.descripcion || '';
      const url = documento.url || '';

      tablaHTML += `
        <tr class="fila-capitulos" data-id="${id}">
          <td onclick="window.open('${url}', '_blank')">
            <strong class="titulo-capitulos">${titulo}</strong><br>
            <span class="descripcion-capitulos">${descripcion}</span>
            <br><small style="color:grey">${url}</small>
          </td>
          <td>
            <button onclick="editarCapitulo2(this)" class="edit-btnCapitulos">Editar</button>
            <button onclick="eliminarCapitulo2(this)" class="delete-btnCapitulos">Eliminar</button>
          </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirCapitulos2(btn) {
  const tablaBody = document.getElementById('tablaCapitulos2').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.classList.add('fila-nueva');

  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Capítulo" class="input-titulo" /><br>
      <input type="text" placeholder="Descripción del Capítulo" class="input-descripcion" /><br>
      <input type="text" placeholder="URL del Capítulo" class="input-url" /><br>
      <button onclick="guardarCapitulo2(this)" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarCapitulo2(this)" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarCapitulo2(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('.input-titulo').value.trim();
  const descripcion = fila.querySelector('.input-descripcion').value.trim();
  const url = fila.querySelector('.input-url').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  const nuevoCapitulo = {
    titulo: titulo,
    descripcion: descripcion,
    url: url
  };

  fetch(URL_SERVER + '/lgacCapitulos2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoCapitulo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al guardar el capítulo");
      }
      return response.json();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo guardado',
        text: 'El nuevo capítulo se ha añadido correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el capítulo.'
      });
    });
}

function cancelarCapitulo2(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarCapitulo2(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");
  const titulo = fila.querySelector("strong").innerText;
  const descripcion = fila.querySelector("span").innerText;
  const url = fila.querySelector("small").innerText;

  fila.innerHTML = `
    <td>
      <input type="text" class="input-titulo" value="${titulo}" style="width:100%;"><br>
      <input type="text" class="input-descripcion" value="${descripcion}" style="width:100%;"><br>
      <input type="text" class="input-url" value="${url}" style="width:100%;">
    </td>
    <td>
      <button onclick="guardarEdicionCapitulo2(this, '${id}')" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarEdicionCapitulo2(this, '${titulo}', '${descripcion}', '${url}', '${id}')" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionCapitulo2(btn, id) {
  const fila = btn.closest("tr");
  const nuevoTitulo = fila.querySelector(".input-titulo").value.trim();
  const nuevaDescripcion = fila.querySelector(".input-descripcion").value.trim();
  const nuevaUrl = fila.querySelector(".input-url").value.trim();

  if (!nuevoTitulo || !nuevaDescripcion || !nuevaUrl) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos antes de guardar.'
    });
    return;
  }

  const datosActualizados = {
    titulo: nuevoTitulo,
    descripcion: nuevaDescripcion,
    url: nuevaUrl
  };

  fetch(URL_SERVER + `/lgacCapitulos2/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la actualización");
      }
      return res.json();
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo actualizado',
        text: 'Los datos del capítulo fueron actualizados correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al actualizar el capítulo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el capítulo.'
      });
    });
}

function cancelarEdicionCapitulo2(btn, titulo, descripcion, url, id) {
  const fila = btn.closest("tr");
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-capitulos">${titulo}</strong><br>
      <span class="descripcion-capitulos">${descripcion}</span>
      <br><small style="color:grey">${url}</small>
    </td>
    <td>
      <button onclick="editarCapitulo(this)">Editar</button>
    </td>
  `;
  fila.setAttribute("data-id", id);
}

function eliminarCapitulo2(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");

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
      fetch(URL_SERVER + `/lgacCapitulos2/${id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al eliminar");
          }
          return response.json();
        })
        .then(data => {
          const siguienteFila = fila.nextElementSibling;
          fila.remove();
          if (siguienteFila && siguienteFila.classList.contains("separator")) {
            siguienteFila.remove();
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El capítulo ha sido eliminado correctamente.',
            confirmButtonText: 'OK'
          });
        })
        .catch(error => {
          console.error("Error al eliminar el capítulo:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el capítulo.'
          });
        });
    }
  });
}


// Tabla LGAC: Instrumentación y Bioelectrónica (PROYECTOS)
fetch(URL_SERVER + '/lgacProyectos2')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaProyectos2').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloProyecto = documento.titulo || '';
      const descripcionProyecto = documento.descripcion || '';
      const urlProyecto = documento.url || '';

      tablaHTML += `
        <tr class="fila-proyectos" data-id="${id}">
            <td onclick="window.open('${urlProyecto}') '_blank'">
                <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                <span class="descripcion-proyectos">${descripcionProyecto}</span>
                <br><small style="color:gray">${urlProyecto}</small>
            </td>
            <td>
                <button onclick="editarProyecto2(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarProyecto2(this)" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirProyecto2(boton) {
  const tablaBody = document.getElementById('tablaProyectos2').getElementsByTagName('tbody')[0];

  if (document.getElementById('fila-edicion')) return;

  const nuevaFila = document.createElement('tr');
  nuevaFila.id = 'fila-edicion';
  nuevaFila.innerHTML = `
    <td>
      <input type="text" id="nuevoTitulo" placeholder="Título del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaDescripcion" placeholder="Descripción del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaURL" placeholder="URL del Proyecto" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarProyecto2()" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarProyecto2()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function cancelarProyecto2() {
  const fila = document.getElementById('fila-edicion');
  if (fila) fila.remove();
}

function guardarProyecto2() {
  const titulo = document.getElementById('nuevoTitulo').value.trim();
  const descripcion = document.getElementById('nuevaDescripcion').value.trim();
  const url = document.getElementById('nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos.'
    });
    return;
  }

  const nuevoProyecto = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + '/lgacProyectos2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoProyecto)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al guardar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto guardado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto guardado',
      text: 'El nuevo proyecto ha sido agregado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      cancelarProyecto();
      recargarProyectos2();
    });

  })
  .catch(error => {
    console.error('Error al guardar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al guardar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function recargarProyectos2() {
  fetch(URL_SERVER + '/lgacProyectos2')
    .then(response => response.json())
    .then(data => {
      const tablaBody = document.getElementById('tablaProyectos2').getElementsByTagName('tbody')[0];
      let tablaHTML = '';

      data.forEach(documento => {
          const id = documento.id;
          const tituloProyecto = documento.titulo || '';
          const descripcionProyecto = documento.descripcion || '';
          const urlProyecto = documento.url || '';

          tablaHTML += `
            <tr class="fila-proyectos" data-id="${id}">
                <td onclick="window.open('${urlProyecto}', '_blank')">
                    <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                    <span class="descripcion-proyectos">${descripcionProyecto}</span>
                    <br><small style="color:gray">${urlProyecto}</small>
                </td>
                <td>
                    <button onclick="editarProyecto2(this)" class="edit-btnArticulos">Editar</button>
                    <button onclick="eliminarProyecto2(this)" class="delete-btnArticulos">Eliminar</button>
                </td>
            </tr>
            <tr class="espacio separator"></tr>
          `;
        });

      tablaBody.innerHTML = tablaHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

recargarProyectos2();


function editarProyecto2(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  if (document.getElementById('fila-edicion')) return;

  const titulo = fila.querySelector('.titulo-proyectos').innerText;
  const descripcion = fila.querySelector('.descripcion-proyectos').innerText;
  const url = fila.querySelector('small').innerText;

  fila.innerHTML = `
    <td>
      <input type="text" id="editarTitulo" value="${titulo}" class="input-tabla"/><br>
      <input type="text" id="editarDescripcion" value="${descripcion}" class="input-tabla"/><br>
      <input type="text" id="editarURL" value="${url}" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarEdicionProyectos2('${id}', this)" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarEdicionProyectos2()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  fila.id = 'fila-edicion';
}

function guardarEdicionProyectos2(id, boton) {
  const fila = boton.closest('tr');

  const titulo = document.getElementById('editarTitulo').value.trim();
  const descripcion = document.getElementById('editarDescripcion').value.trim();
  const url = document.getElementById('editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const datosActualizados = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + `/lgacProyectos2/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al actualizar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto actualizado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto actualizado',
      text: 'El proyecto ha sido editado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      recargarProyectos2(); 
    });
  })
  .catch(error => {
    console.error('Error al actualizar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionProyectos2() {
  recargarProyectos2(); 
}


function eliminarProyecto2(boton) {
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
      const fila = boton.closest("tr.fila-proyectos");
      const id = fila.getAttribute("data-id");

      fetch(URL_SERVER + `/lgacProyectos2/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar el documento");
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);

        const siguienteFila = fila.nextElementSibling;
        if (siguienteFila && siguienteFila.classList.contains("espacio")) {
          siguienteFila.remove();
        }
        fila.remove();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El proyecto fue eliminado correctamente.',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar el proyecto.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// LGAC: Desarrollo y Gestión de Proyectos de Ingeniería para el Desarrollo Regional (ARTICULOS) -->
fetch(URL_SERVER + '/lgacArticulos3')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaArticulos3').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloArticulo = documento.titulo || '';
      const descripcionArticulo = documento.descripcion || '';
      const urlArticulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-articulo" data-id="${id}">
            <td onclick="window.open('${urlArticulo}', '_blank')">
                <strong class="titulo-articulo">${tituloArticulo}</strong><br>
                <span class="descripcion-articulo">${descripcionArticulo}</span>
                <br><small style="color:gray">${urlArticulo}</small>
            </td>
            <td>
                <button onclick="editarArticulo3(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarArticulo3('${id}')" class="delete-btnArticulos">Eliminar</button>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirArticulo3(boton) {
  const tablaBody = document.getElementById('tablaArticulos3').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Artículo" id="nuevoTitulo" class="input-articulo" /><br>
      <input type="text" placeholder="Descripción del Artículo" id="nuevaDescripcion" class="input-articulo" /><br>
      <input type="text" placeholder="URL del Artículo" id="nuevaURL" class="input-articulo" /><br>
      <button onclick="guardarArticulo3(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarArticulo3(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarArticulo3(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.'
    });
    return;
  }

  const nuevoArticulo = { titulo, descripcion, url };

  fetch(URL_SERVER + '/lgacArticulos3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo guardado',
      text: 'El artículo se ha guardado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });
  })
  .catch(error => {
    console.error("Error al guardar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarArticulo3(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarArticulo3(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  const titulo = fila.querySelector('.titulo-articulo').innerText;
  const descripcion = fila.querySelector('.descripcion-articulo').innerText;
  const url = fila.querySelector('small')?.innerText || '';

  fila.innerHTML = `
    <td>
      <input type="text" value="${titulo}" class="input-articulo" id="editarTitulo"><br>
      <input type="text" value="${descripcion}" class="input-articulo" id="editarDescripcion"><br>
      <input type="text" value="${url}" class="input-articulo" id="editarURL"><br>
    </td>
    <td>
      <button onclick="guardarEdicion3(this, '${id}')" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarEdicion3(this, '${titulo}', '${descripcion}', '${url}')" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicion3(boton, id) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editarTitulo').value.trim();
  const descripcion = fila.querySelector('#editarDescripcion').value.trim();
  const url = fila.querySelector('#editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const articuloActualizado = { titulo, descripcion, url };

  fetch(URL_SERVER + `/lgacArticulos3/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articuloActualizado)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo actualizado',
      text: 'El artículo se ha actualizado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error("Error al actualizar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicion3(boton, titulo, descripcion, url) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-articulo">${titulo}</strong><br>
      <span class="descripcion-articulo">${descripcion}</span>
      <br><small style="color:gray">${url}</small>
    </td>
    <td>
      <button onclick="editarArticulo(this)">Editar</button>
    </td>
  `;
}

function eliminarArticulo3(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgacArticulos3/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El artículo ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error("Error al eliminar el artículo:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar el artículo.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// LGAC: Desarrollo y Gestión de Proyectos de Ingeniería para el Desarrollo Regional (CAPITULOS) 
fetch(URL_SERVER + '/lgacCapitulos3')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaCapitulos3').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloCapitulo = documento.titulo || '';
      const descripcionCapitulo = documento.descripcion || '';
      const urlCapitulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-capitulos" data-id="${id}">
            <td onclick="window.open('${urlCapitulo}', '_blank')">
                <strong class="titulo-capitulos">${tituloCapitulo}</strong><br>
                <span class="descripcion-capitulos">${descripcionCapitulo}</span>
                <br><small style="color:gray">${urlCapitulo}</small>
            </td>
            <td>
                <button onclick="editarCapitulo3(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarCapitulo3('${id}')" class="delete-btnArticulos">Eliminar</button>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirCapitulos3(boton) {
  const tablaBody = document.getElementById('tablaCapitulos3').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Capítulo" id="nuevoTitulo" class="input-articulo" /><br>
      <input type="text" placeholder="Descripción del Capítulo" id="nuevaDescripcion" class="input-articulo" /><br>
      <input type="text" placeholder="URL del Capítulo" id="nuevaURL" class="input-articulo" /><br>
      <button onclick="guardarCapitulo3(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarCapitulo3(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarCapitulo3(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.'
    });
    return;
  }

  const nuevoArticulo = { titulo, descripcion, url };

  fetch(URL_SERVER + '/lgacCapitulos3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo guardado',
      text: 'El capítulo se ha guardado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });
  })
  .catch(error => {
    console.error("Error al guardar el capítulo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el capítulo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarCapitulo3(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarCapitulo3(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  const titulo = fila.querySelector('.titulo-capitulos').innerText;
  const descripcion = fila.querySelector('.descripcion-capitulos').innerText;
  const url = fila.querySelector('small')?.innerText || '';

  fila.innerHTML = `
    <td>
      <input type="text" value="${titulo}" class="input-articulo" id="editarTitulo"><br>
      <input type="text" value="${descripcion}" class="input-articulo" id="editarDescripcion"><br>
      <input type="text" value="${url}" class="input-articulo" id="editarURL"><br>
    </td>
    <td>
      <button onclick="guardarEdicionCapitulos3(this, '${id}')" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarEdicionCapitulos3(this, '${titulo}', '${descripcion}', '${url}')" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionCapitulos3(boton, id) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editarTitulo').value.trim();
  const descripcion = fila.querySelector('#editarDescripcion').value.trim();
  const url = fila.querySelector('#editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const articuloActualizado = { titulo, descripcion, url };

  fetch(URL_SERVER + `/lgacCapitulos3/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articuloActualizado)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Capítulo actualizado',
      text: 'El capítulo se ha actualizado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error("Error al actualizar el capítulo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el capítulo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionCapitulos3(boton, titulo, descripcion, url) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-capitulos">${titulo}</strong><br>
      <span class="descripcion-capitulos">${descripcion}</span>
      <br><small style="color:gray">${url}</small>
    </td>
    <td>
      <button onclick="editarCapitulo3(this)" class="edit-btnArticulos">Editar</button>
      <button onclick="eliminarCapitulo3('${fila.getAttribute('data-id')}')" class="delete-btnArticulos">Eliminar</button>
    </td>
  `;
}

function eliminarCapitulo3(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgacCapitulos3/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El capítulo ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error("Error al eliminar el capítulo:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar el capítulo.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// LGAC: Desarrollo y Gestión de Proyectos de Ingeniería para el Desarrollo Regional (PROYECTOS) -->
fetch(URL_SERVER + '/lgacProyectos3')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaProyectos3').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloProyecto = documento.titulo || '';
      const descripcionProyecto = documento.descripcion || '';
      const urlProyecto = documento.url || '';

      tablaHTML += `
        <tr class="fila-proyectos" data-id="${id}">
            <td onclick="window.open('${urlProyecto}') '_blank'">
                <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                <span class="descripcion-proyectos">${descripcionProyecto}</span>
                <br><small style="color:gray">${urlProyecto}</small>
            </td>
            <td>
                <button onclick="editarProyecto3(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarProyecto3('${id}')" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirProyecto3(boton) {
  const tablaBody = document.getElementById('tablaProyectos3').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Proyecto" id="nuevoTitulo" class="input-articulo" /><br>
      <input type="text" placeholder="Descripción del Proyecto" id="nuevaDescripcion" class="input-articulo" /><br>
      <input type="text" placeholder="URL del Proyecto" id="nuevaURL" class="input-articulo" /><br>
      <button onclick="guardarProyecto3(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarProyecto3(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarProyecto3(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.'
    });
    return;
  }

  const nuevoArticulo = { titulo, descripcion, url };

  fetch(URL_SERVER + '/lgacProyectos3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Proyecto guardado',
      text: 'El proyecto se ha guardado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });
  })
  .catch(error => {
    console.error("Error al guardar el proyecto:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el proyecto. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarProyecto3(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarProyecto3(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  const titulo = fila.querySelector('.titulo-proyectos').innerText;
  const descripcion = fila.querySelector('.descripcion-proyectos').innerText;
  const url = fila.querySelector('small')?.innerText || '';

  fila.innerHTML = `
    <td>
      <input type="text" value="${titulo}" class="input-articulo" id="editarTitulo"><br>
      <input type="text" value="${descripcion}" class="input-articulo" id="editarDescripcion"><br>
      <input type="text" value="${url}" class="input-articulo" id="editarURL"><br>
    </td>
    <td>
      <button onclick="guardarEdicionProyectos3(this, '${id}')" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarEdicionProyectos3(this, '${titulo}', '${descripcion}', '${url}')" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionProyectos3(boton, id) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editarTitulo').value.trim();
  const descripcion = fila.querySelector('#editarDescripcion').value.trim();
  const url = fila.querySelector('#editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const articuloActualizado = { titulo, descripcion, url };

  fetch(URL_SERVER + `/lgacProyectos3/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articuloActualizado)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Proyecto actualizado',
      text: 'El proyecto se ha actualizado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error("Error al actualizar el proyecto:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el proyecto. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionProyectos3(boton, titulo, descripcion, url) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-proyectos">${titulo}</strong><br>
      <span class="descripcion-proyectos">${descripcion}</span>
      <br><small style="color:gray">${url}</small>
    </td>
    <td>
      <button onclick="editarProyecto3(this)" class="edit-btnArticulos">Editar</button>
      <button onclick="eliminarProyecto3('${fila.getAttribute('data-id')}')" class="delete-btnArticulos">Eliminar</button>
    </td>
  `;
}

function eliminarProyecto3(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgacProyectos3/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El proyecto ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error("Error al eliminar el proyecto:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar el proyecto.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// Tabla LGAC: Desarrollo de Tecnología e Innovación (ARTICULOS)
fetch(URL_SERVER + '/lgacArticulos4')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaArticulos4').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloArticulo = documento.titulo || '';
      const descripcionArticulo = documento.descripcion || '';
      const urlArticulo = documento.url || '';

      tablaHTML += `
        <tr class="fila-articulo" data-id="${id}">
            <td onclick="window.open('${urlArticulo}', '_blank')">
                <strong class="titulo-articulo">${tituloArticulo}</strong><br>
                <span class="descripcion-articulo">${descripcionArticulo}</span>
                <br><small style="color:gray">${urlArticulo}</small>
            </td>
            <td>
                <button onclick="editarArticulo4(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarArticulo4('${id}')" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

function añadirArticulos4(boton) {
  const tablaBody = document.getElementById('tablaArticulos4').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Artículo" id="nuevoTitulo" class="input-articulo" /><br>
      <input type="text" placeholder="Descripción del Artículo" id="nuevaDescripcion" class="input-articulo" /><br>
      <input type="text" placeholder="URL del Artículo" id="nuevaURL" class="input-articulo" /><br>
      <button onclick="guardarArticulos4(this)" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarArticulo4(this)" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarArticulos4(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#nuevoTitulo').value.trim();
  const descripcion = fila.querySelector('#nuevaDescripcion').value.trim();
  const url = fila.querySelector('#nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.'
    });
    return;
  }

  const nuevoArticulo = { titulo, descripcion, url };

  fetch(URL_SERVER + '/lgacArticulos4', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoArticulo)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo guardado',
      text: 'El artículo se ha guardado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload();
    });
  })
  .catch(error => {
    console.error("Error al guardar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarArticulo4(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarArticulo4(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  const titulo = fila.querySelector('.titulo-articulo').innerText;
  const descripcion = fila.querySelector('.descripcion-articulo').innerText;
  const url = fila.querySelector('small')?.innerText || '';

  fila.innerHTML = `
    <td>
      <input type="text" value="${titulo}" class="input-articulo" id="editarTitulo"><br>
      <input type="text" value="${descripcion}" class="input-articulo" id="editarDescripcion"><br>
      <input type="text" value="${url}" class="input-articulo" id="editarURL"><br>
    </td>
    <td>
      <button onclick="guardarEdicionArticulos4(this, '${id}')" class="save-btnArticulos">Guardar</button>
      <button onclick="cancelarEdicionArticulo4(this, '${titulo}', '${descripcion}', '${url}')" class="cancel-btnArticulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionArticulos4(boton, id) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editarTitulo').value.trim();
  const descripcion = fila.querySelector('#editarDescripcion').value.trim();
  const url = fila.querySelector('#editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos antes de guardar.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const articuloActualizado = { titulo, descripcion, url };

  fetch(URL_SERVER + `/lgacArticulos4/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articuloActualizado)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Artículo actualizado',
      text: 'El artículo se ha actualizado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      location.reload(); 
    });
  })
  .catch(error => {
    console.error("Error al actualizar el artículo:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el artículo. Intenta de nuevo.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionArticulo4(boton, titulo, descripcion, url) {
  const fila = boton.closest('tr');
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-articulo">${titulo}</strong><br>
      <span class="descripcion-articulo">${descripcion}</span>
      <br><small style="color:gray">${url}</small>
    </td>
    <td>
      <button onclick="editarArticulo4(this)" class="edit-btnArticulos">Editar</button>
      <button onclick="eliminarArticulo4('${fila.getAttribute('data-id')}')" class="delete-btnArticulos">Eliminar</button>
    </td>
  `;
}

function eliminarArticulo4(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/lgacArticulos4/${id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El artículo ha sido eliminado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          location.reload(); 
        });
      })
      .catch(error => {
        console.error("Error al eliminar el artículo:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar el artículo.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}


// Tabla LGAC: Desarrollo de Tecnología e Innovación (CAPITULOS) 
fetch(URL_SERVER + '/lgacCapitulos4')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaCapitulos4').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach((documento, index) => {
      const id = documento.id; 
      const titulo = documento.titulo || '';
      const descripcion = documento.descripcion || '';
      const url = documento.url || '';

      tablaHTML += `
        <tr class="fila-capitulos" data-id="${id}">
          <td onclick="window.open('${url}', '_blank')">
            <strong class="titulo-capitulos">${titulo}</strong><br>
            <span class="descripcion-capitulos">${descripcion}</span>
            <br><small style="color:grey">${url}</small>
          </td>
          <td>
            <button onclick="editarCapitulo4(this)" class="edit-btnCapitulos">Editar</button>
            <button onclick="eliminarCapitulo4(this)" class="delete-btnCapitulos">Eliminar</button>
          </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirCapitulos4(btn) {
  const tablaBody = document.getElementById('tablaCapitulos4').getElementsByTagName('tbody')[0];

  const nuevaFila = document.createElement('tr');
  nuevaFila.classList.add('fila-nueva');

  nuevaFila.innerHTML = `
    <td>
      <input type="text" placeholder="Título del Capítulo" class="input-titulo" /><br>
      <input type="text" placeholder="Descripción del Capítulo" class="input-descripcion" /><br>
      <input type="text" placeholder="URL del Capítulo" class="input-url" /><br>
      <button onclick="guardarCapitulo4(this)" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarCapitulo4(this)" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function guardarCapitulo4(boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('.input-titulo').value.trim();
  const descripcion = fila.querySelector('.input-descripcion').value.trim();
  const url = fila.querySelector('.input-url').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  const nuevoCapitulo = {
    titulo: titulo,
    descripcion: descripcion,
    url: url
  };

  fetch(URL_SERVER + '/lgacCapitulos4', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoCapitulo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al guardar el capítulo");
      }
      return response.json();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo guardado',
        text: 'El nuevo capítulo se ha añadido correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el capítulo.'
      });
    });
}

function cancelarCapitulo4(boton) {
  const fila = boton.closest('tr');
  fila.remove();
}

function editarCapitulo4(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");
  const titulo = fila.querySelector("strong").innerText;
  const descripcion = fila.querySelector("span").innerText;
  const url = fila.querySelector("small").innerText;

  fila.innerHTML = `
    <td>
      <input type="text" class="input-titulo" value="${titulo}" style="width:100%;"><br>
      <input type="text" class="input-descripcion" value="${descripcion}" style="width:100%;"><br>
      <input type="text" class="input-url" value="${url}" style="width:100%;">
    </td>
    <td>
      <button onclick="guardarEdicionCapitulo4(this, '${id}')" class="save-btnCapitulos">Guardar</button>
      <button onclick="cancelarEdicionCapitulo4(this, '${titulo}', '${descripcion}', '${url}', '${id}')" class="cancel-btnCapitulos">Cancelar</button>
    </td>
  `;
}

function guardarEdicionCapitulo4(btn, id) {
  const fila = btn.closest("tr");
  const nuevoTitulo = fila.querySelector(".input-titulo").value.trim();
  const nuevaDescripcion = fila.querySelector(".input-descripcion").value.trim();
  const nuevaUrl = fila.querySelector(".input-url").value.trim();

  if (!nuevoTitulo || !nuevaDescripcion || !nuevaUrl) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos antes de guardar.'
    });
    return;
  }

  const datosActualizados = {
    titulo: nuevoTitulo,
    descripcion: nuevaDescripcion,
    url: nuevaUrl
  };

  fetch(URL_SERVER + `/lgacCapitulos4/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosActualizados)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la actualización");
      }
      return res.json();
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Capítulo actualizado',
        text: 'Los datos del capítulo fueron actualizados correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error("Error al actualizar el capítulo:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el capítulo.'
      });
    });
}

function cancelarEdicionCapitulo4(btn, titulo, descripcion, url, id) {
  const fila = btn.closest("tr");
  fila.innerHTML = `
    <td onclick="window.open('${url}', '_blank')">
      <strong class="titulo-capitulos">${titulo}</strong><br>
      <span class="descripcion-capitulos">${descripcion}</span>
      <br><small style="color:grey">${url}</small>
    </td>
    <td>
      <button onclick="editarCapitulo(this)">Editar</button>
    </td>
  `;
  fila.setAttribute("data-id", id);
}

function eliminarCapitulo4(btn) {
  const fila = btn.closest("tr");
  const id = fila.getAttribute("data-id");

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
      fetch(URL_SERVER + `/lgacCapitulos4/${id}`, {
        method: "DELETE"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al eliminar");
          }
          return response.json();
        })
        .then(data => {
          const siguienteFila = fila.nextElementSibling;
          fila.remove();
          if (siguienteFila && siguienteFila.classList.contains("separator")) {
            siguienteFila.remove();
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El capítulo ha sido eliminado correctamente.',
            confirmButtonText: 'OK'
          });
        })
        .catch(error => {
          console.error("Error al eliminar el capítulo:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el capítulo.'
          });
        });
    }
  });
}


// Tabla LGAC: Desarrollo de Tecnología e Innovación (PROYECTOS)
fetch(URL_SERVER + '/lgacProyectos4')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaProyectos4').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloProyecto = documento.titulo || '';
      const descripcionProyecto = documento.descripcion || '';
      const urlProyecto = documento.url || '';

      tablaHTML += `
        <tr class="fila-proyectos" data-id="${id}">
            <td onclick="window.open('${urlProyecto}', '_blank')">
                <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                <span class="descripcion-proyectos">${descripcionProyecto}</span>
                <br><small style="color:gray">${urlProyecto}</small>
            </td>
            <td>
                <button onclick="editarProyecto4(this)" class="edit-btnArticulos">Editar</button>
                <button onclick="eliminarProyecto4(this)" class="delete-btnArticulos">Eliminar</button>
            </td>
        </tr>
        <tr class="espacio separator"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


function añadirProyecto4(boton) {
  const tablaBody = document.getElementById('tablaProyectos4').getElementsByTagName('tbody')[0];

  if (document.getElementById('fila-edicion')) return;

  const nuevaFila = document.createElement('tr');
  nuevaFila.id = 'fila-edicion';
  nuevaFila.innerHTML = `
    <td>
      <input type="text" id="nuevoTitulo" placeholder="Título del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaDescripcion" placeholder="Descripción del Proyecto" class="input-tabla"/><br>
      <input type="text" id="nuevaURL" placeholder="URL del Proyecto" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarProyecto4()" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarProyecto4()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function cancelarProyecto4() {
  const fila = document.getElementById('fila-edicion');
  if (fila) fila.remove();
}

function guardarProyecto4() {
  const titulo = document.getElementById('nuevoTitulo').value.trim();
  const descripcion = document.getElementById('nuevaDescripcion').value.trim();
  const url = document.getElementById('nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos.'
    });
    return;
  }

  const nuevoProyecto = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + '/lgacProyectos4', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoProyecto)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al guardar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto guardado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto guardado',
      text: 'El nuevo proyecto ha sido agregado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      cancelarProyecto();
      recargarProyectos();
    });

  })
  .catch(error => {
    console.error('Error al guardar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al guardar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function recargarProyectos4() {
  fetch(URL_SERVER + '/lgacProyectos4')
    .then(response => response.json())
    .then(data => {
      const tablaBody = document.getElementById('tablaProyectos4').getElementsByTagName('tbody')[0];
      let tablaHTML = '';

      data.forEach(documento => {
          const id = documento.id;
          const tituloProyecto = documento.titulo || '';
          const descripcionProyecto = documento.descripcion || '';
          const urlProyecto = documento.url || '';

          tablaHTML += `
            <tr class="fila-proyectos" data-id="${id}">
                <td onclick="window.open('${urlProyecto}', '_blank')">
                    <strong class="titulo-proyectos">${tituloProyecto}</strong><br>
                    <span class="descripcion-proyectos">${descripcionProyecto}</span>
                    <br><small style="color:gray">${urlProyecto}</small>
                </td>
                <td>
                    <button onclick="editarProyecto4(this)" class="edit-btnArticulos">Editar</button>
                    <button onclick="eliminarProyecto4(this)" class="delete-btnArticulos">Eliminar</button>
                </td>
            </tr>
            <tr class="espacio separator"></tr>
          `;
        });

      tablaBody.innerHTML = tablaHTML;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

recargarProyectos4();


function editarProyecto4(boton) {
  const fila = boton.closest('tr');
  const id = fila.getAttribute('data-id');

  if (document.getElementById('fila-edicion')) return;

  const titulo = fila.querySelector('.titulo-proyectos').innerText;
  const descripcion = fila.querySelector('.descripcion-proyectos').innerText;
  const url = fila.querySelector('small').innerText;

  fila.innerHTML = `
    <td>
      <input type="text" id="editarTitulo" value="${titulo}" class="input-tabla"/><br>
      <input type="text" id="editarDescripcion" value="${descripcion}" class="input-tabla"/><br>
      <input type="text" id="editarURL" value="${url}" class="input-tabla"/>
      <div style="margin-top: 5px;">
        <button onclick="guardarEdicionProyectos4('${id}', this)" class="save-btnArticulos">Guardar</button>
        <button onclick="cancelarEdicionProyectos4()" class="cancel-btnArticulos">Cancelar</button>
      </div>
    </td>
  `;

  fila.id = 'fila-edicion';
}

function guardarEdicionProyectos4(id, boton) {
  const fila = boton.closest('tr');

  const titulo = document.getElementById('editarTitulo').value.trim();
  const descripcion = document.getElementById('editarDescripcion').value.trim();
  const url = document.getElementById('editarURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const datosActualizados = {
    titulo,
    descripcion,
    url
  };

  fetch(URL_SERVER + `/lgacProyectos4/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datosActualizados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al actualizar el proyecto');
    }
    return response.json();
  })
  .then(data => {
    console.log('Proyecto actualizado:', data);

    Swal.fire({
      icon: 'success',
      title: 'Proyecto actualizado',
      text: 'El proyecto ha sido editado correctamente.',
      confirmButtonText: 'OK'
    }).then(() => {
      recargarProyectos4(); 
    });
  })
  .catch(error => {
    console.error('Error al actualizar el proyecto:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al actualizar el proyecto.',
      confirmButtonText: 'OK'
    });
  });
}

function cancelarEdicionProyectos4() {
  recargarProyectos4(); 
}

function eliminarProyecto4(boton) {
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
      const fila = boton.closest("tr.fila-proyectos");
      const id = fila.getAttribute("data-id");

      fetch(URL_SERVER + `/lgacProyectos4/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar el documento");
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);

        const siguienteFila = fila.nextElementSibling;
        if (siguienteFila && siguienteFila.classList.contains("espacio")) {
          siguienteFila.remove();
        }
        fila.remove();

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El proyecto fue eliminado correctamente.',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar el proyecto.',
          confirmButtonText: 'OK'
        });
      });
    }
  });
}

window.añadirArticulos = añadirArticulos
window.guardarArticulo = guardarArticulo
window.cancelarArticulo = cancelarArticulo
window.editarArticulo = editarArticulo
window.guardarEdicion = guardarEdicion
window.cancelarEdicion = cancelarEdicion
window.eliminarArticulo = eliminarArticulo

window.añadirCapitulos = añadirCapitulos
window.guardarCapitulo = guardarCapitulo
window.cancelarCapitulo = cancelarCapitulo
window.editarCapitulo = editarCapitulo
window.guardarEdicionCapitulo = guardarEdicionCapitulo
window.cancelarEdicionCapitulo = cancelarEdicionCapitulo
window.eliminarCapitulo  = eliminarCapitulo

window.añadirProyecto = añadirProyecto
window.cancelarProyecto = cancelarProyecto
window.guardarProyecto = guardarProyecto
window.recargarProyectos = recargarProyectos
window.editarProyecto = editarProyecto
window.guardarEdicionProyectos = guardarEdicionProyectos
window.cancelarEdicionProyectos = cancelarEdicionProyectos
window.eliminarProyecto = eliminarProyecto

window.añadirArticulo2 = añadirArticulo2
window.guardarNuevoArticulo2 = guardarNuevoArticulo2
window.cancelarNuevoArticulo2 = cancelarNuevoArticulo2
window.editarArticulo2 = editarArticulo2
window.guardarEdicionArticulo2 = guardarEdicionArticulo2
window.cancelarEdicionArticulo2 = cancelarEdicionArticulo2
window.eliminarArticulo2 = eliminarArticulo2

window.añadirCapitulos2 = añadirCapitulos2
window.guardarCapitulo2 = guardarCapitulo2
window.cancelarCapitulo2 = cancelarCapitulo2
window.editarCapitulo2 = editarCapitulo2
window.guardarEdicionCapitulo2 = guardarEdicionCapitulo2
window.cancelarEdicionCapitulo2 = cancelarEdicionCapitulo2
window.eliminarCapitulo2 = eliminarCapitulo2

window.añadirProyecto2 = añadirProyecto2
window.cancelarProyecto2 = cancelarProyecto2
window.guardarProyecto2 = guardarProyecto2
window.recargarProyectos2 = recargarProyectos2
window.editarProyecto2 = editarProyecto2
window.guardarEdicionProyectos2 = guardarEdicionProyectos2
window.cancelarEdicionProyectos2 = cancelarEdicionProyectos2
window.eliminarProyecto2 = eliminarProyecto2

window.añadirArticulo3 = añadirArticulo3
window.guardarArticulo3 = guardarArticulo3
window.cancelarArticulo3 = cancelarArticulo3
window.editarArticulo3 = editarArticulo3
window.guardarEdicion3 = guardarEdicion3
window.cancelarEdicion3 = cancelarEdicion3
window.eliminarArticulo3 = eliminarArticulo3

window.añadirCapitulos3 = añadirCapitulos3
window.guardarCapitulo3 = guardarCapitulo3
window.cancelarCapitulo3 = cancelarCapitulo3
window.editarCapitulo3 = editarCapitulo3
window.guardarEdicionCapitulos3 = guardarEdicionCapitulos3
window.cancelarEdicionCapitulos3 = cancelarEdicionCapitulos3
window.eliminarCapitulo3  = eliminarCapitulo3

window.añadirProyecto3 = añadirProyecto3
window.cancelarProyecto3 = cancelarProyecto3
window.guardarProyecto3 = guardarProyecto3
window.editarProyecto3 = editarProyecto3
window.guardarEdicionProyectos3 = guardarEdicionProyectos3
window.cancelarEdicionProyectos3 = cancelarEdicionProyectos3
window.eliminarProyecto3 = eliminarProyecto3

window.añadirArticulos4 = añadirArticulos4
window.guardarArticulos4 = guardarArticulos4
window.cancelarArticulo4 = cancelarArticulo4
window.editarArticulo4 = editarArticulo4
window.guardarEdicionArticulos4 = guardarEdicionArticulos4
window.cancelarEdicionArticulo4 = cancelarEdicionArticulo4
window.eliminarArticulo4 = eliminarArticulo4

window.añadirCapitulos4 = añadirCapitulos4
window.guardarCapitulo4 = guardarCapitulo4
window.cancelarCapitulo4 = cancelarCapitulo4
window.editarCapitulo4 = editarCapitulo4
window.guardarEdicionCapitulo4 = guardarEdicionCapitulo4
window.cancelarEdicionCapitulo4 = cancelarEdicionCapitulo4
window.eliminarCapitulo4  = eliminarCapitulo4

window.añadirProyecto4 = añadirProyecto4
window.cancelarProyecto4 = cancelarProyecto4
window.guardarProyecto4 = guardarProyecto4
window.editarProyecto4 = editarProyecto4
window.guardarEdicionProyectos4 = guardarEdicionProyectos4
window.cancelarEdicionProyectos4 = cancelarEdicionProyectos4
window.eliminarProyecto4 = eliminarProyecto4
