
import {URL_SERVER} from "../config1.js"

// Portada
fetch(URL_SERVER + '/portada')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaCohorte').getElementsByTagName('tbody')[0];
    let tablaHTML = '';
    
    data.forEach(documento => {
      const id = documento.id;
      const imagenCohorte = documento.imagen || '';
      const tituloImg = documento.titulo || '';

      tablaHTML += `
        <tr>
            <td><img src="${imagenCohorte}" class="imagen" /></td>
        </tr>
        <tr>
            <th class="titulo-cohorte">${tituloImg}</th>
        </tr>
        <tr>
          <td>
              <button onclick="editarImagenPortada('${id}', '${tituloImg}', '${imagenCohorte}')" class="edit-btnImagen">Editar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function editarImagenPortada(id, tituloActual, imagenActual) {
  const tablaBody = document.getElementById('tablaCohorte').getElementsByTagName('tbody')[0];

  fetch(URL_SERVER + '/portada')
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
            <tr data-id="${docId}" data-imagen-original="${imagen}">
              <td>
                <img src="${imagen}" class="imagen imagen-edit" id="imagen-prev-${docId}" />
                <input type="file" id="input-file-${docId}" style="display: none;" accept="image/*">
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" value="${titulo}" id="input-titulo-${docId}" class="input-titulo">
                <button onclick="document.getElementById('input-file-${docId}').click()" class="edit-btnImagen">Seleccionar imagen</button>
              </td>
            </tr>            
            <tr>
              <td>
                <button onclick="guardarEdicionCohorte('${docId}')" class="btn-guardar">Guardar</button>
                <button onclick="cancelarEdicionCohorte()" class="btn-cancelar">Cancelar</button>
              </td>
            </tr>
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

function cancelarEdicionCohorte() {
  location.reload();
}

function guardarEdicionCohorte(id) {
  const tituloNuevo = document.getElementById(`input-titulo-${id}`).value;
  const inputFile = document.getElementById(`input-file-${id}`);
  const file = inputFile.files[0];
  const formData = new FormData();

  formData.append('titulo', tituloNuevo);
  if (file) formData.append('imagenPortada', file);

  fetch(URL_SERVER + `/portada/${id}`, {
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


// Carrusel
fetch(URL_SERVER + '/carrusel')
  .then(response => response.json())
  .then(data => {
    const carouselSlide = document.getElementById('carousel-slide');
    let imagenesHTML = '';

    data.forEach(documento => {
      const imagenCarrusel = documento.imagen || '';
      imagenesHTML += `<img src="${imagenCarrusel}" alt="ImagenCarrusel">`;
    });

    carouselSlide.innerHTML = imagenesHTML;

    const botonEditar = document.createElement('button');
    botonEditar.textContent = 'Editar';
    botonEditar.className = 'btn-editarCarrusel';
    botonEditar.onclick = () => mostrarFormularioEdicion(data);
    carouselSlide.parentElement.appendChild(botonEditar);

    inicializarCarrusel();
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

let carrussel = 0;
let slides;
let images;
let totalSlides;

function inicializarCarrusel() {
  slides = document.querySelector('.carousel-slide');
  images = document.querySelectorAll('.carousel-slide img');
  totalSlides = images.length;

  slides.style.display = 'flex';
  slides.style.transition = 'transform 0.5s ease-in-out';
  slides.style.width = `${totalSlides * 100}vw`;

  images.forEach(img => {
    img.style.width = '100vw';
    img.style.flexShrink = '0';
  });

  setInterval(() => moveSlide(1), 3000);
}

function moveSlide(step) {
  carrussel += step;
  if (carrussel >= totalSlides) carrussel = 0;
  else if (carrussel < 0) carrussel = totalSlides - 1;
  slides.style.transform = `translateX(-${carrussel * 100}vw)`;
}

function mostrarFormularioEdicion(data) {
  document.getElementById('formulario-editar-carrusel').style.display = 'block';
  document.getElementById('modal-fondo').style.display = 'block';

  document.getElementById('preview1').src = data[0]?.imagen || '';
  document.getElementById('preview2').src = data[1]?.imagen || '';

  document.getElementById('inputImagen1').onchange = e => {
    const file = e.target.files[0];
    if (file) document.getElementById('preview1').src = URL.createObjectURL(file);
  };

  document.getElementById('inputImagen2').onchange = e => {
    const file = e.target.files[0];
    if (file) document.getElementById('preview2').src = URL.createObjectURL(file);
  };

  document.getElementById('cancelarEdicion').onclick = () => {
    document.getElementById('formulario-editar-carrusel').style.display = 'none';
    document.getElementById('modal-fondo').style.display = 'none';
  };

  document.getElementById('guardarCarrusel').onclick = () => {
    actualizarImagen('inputImagen1', data[0]?.id);
    actualizarImagen('inputImagen2', data[1]?.id);
    alert('Imágenes actualizadas correctamente');
    setTimeout(() => location.reload(), 1000);
  };
}

function actualizarImagen(inputId, docId) {
  const input = document.getElementById(inputId);
  const file = input.files[0];
  if (!file || !docId) return;

  const formData = new FormData();
  formData.append('imagen', file);

  fetch(URL_SERVER + `/carrusel/${docId}`, {
    method: 'PUT',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: '¡Imagen actualizada!',
        text: 'La imagen del carrusel se actualizó correctamente.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        backdrop: true 
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Hubo un problema al subir la imagen. Intenta de nuevo.',
        confirmButtonColor: '#d33',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true
      });
    });
}


// Galería
fetch(URL_SERVER + '/galeria')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tablaGaleria').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      tablaHTML += '<tr class="fila-galeria">';

      for (let j = i; j < i + 3; j++) {
        if (data[j]) {
          const imagenGaleria = data[j].imagen || '';
          const tituloGaleria = data[j].titulo || '';
          const urlGaleria = data[j].web || '';

          tablaHTML += `
            <td class="celda-galeria">
              <div class="contenedor-galeria" data-id="${data[j].id}">
                <h2 class="titulo-galeria">${tituloGaleria}</h2>
                <img src="${imagenGaleria}" alt="Imagen" class="imagen-galeria">
                <a href="${urlGaleria}" target="_blank" class="ver-mas-galeria">Ver más ↗</a>
                <button class="btn-editar">Editar</button>
                <button class="btn-eliminarGaleria">Eliminar</button>
              </div>
            </td>
          `;
        } else {
          tablaHTML += '<td class="celda-galeria"></td>';
        }
      }

      tablaHTML += '</tr>';
    }

    tablaBody.innerHTML = tablaHTML;

    document.querySelectorAll('.btn-eliminarGaleria').forEach(boton => {
      boton.addEventListener('click', async () => {
        const contenedor = boton.closest('.contenedor-galeria');
        const id = contenedor.getAttribute('data-id');

        if (!id) {
          console.error('ID no encontrado');
          return;
        }

        const { isConfirmed } = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará la imagen permanentemente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6'
        });

        if (!isConfirmed) return;

        try {
          const response = await fetch(URL_SERVER + `/galeria/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: 'La imagen fue eliminada correctamente.',
              confirmButtonText: 'Ok'
            }).then(() => {
              contenedor.remove();
            });
          } else {
            const error = await response.json();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message || 'No se pudo eliminar la imagen.'
            });
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Ocurrió un error al intentar eliminar la imagen.'
          });
        }
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const contenedor = btn.parentElement;
        const id = contenedor.getAttribute('data-id');

        const titulo = contenedor.querySelector('.titulo-galeria').innerText;
        const imagenSrc = contenedor.querySelector('.imagen-galeria').src;
        const url = contenedor.querySelector('.ver-mas-galeria').href;

        contenedor.innerHTML = `
          <input type="text" class="input-titulo" value="${titulo}">
          <input type="text" class="input-web" value="${url}">
          <img src="${imagenSrc}" class="imagen-preview" style="max-width:100px; display:block; margin:5px 0;">
          <input type="file" class="input-imagen">
          <button class="btn-guardar">Guardar</button>
          <button class="btn-cancelar">Cancelar</button>
        `;

        const inputImagen = contenedor.querySelector('.input-imagen');
        const imagenPreview = contenedor.querySelector('.imagen-preview');

        inputImagen.addEventListener('change', () => {
          const file = inputImagen.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imagenPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });

        contenedor.querySelector('.btn-cancelar').addEventListener('click', () => location.reload());

        contenedor.querySelector('.btn-guardar').addEventListener('click', async () => {
          const nuevoTitulo = contenedor.querySelector('.input-titulo').value;
          const nuevaWeb = contenedor.querySelector('.input-web').value;
          const nuevaImagen = inputImagen.files[0];

          const formData = new FormData();
          formData.append('titulo', nuevoTitulo);
          formData.append('web', nuevaWeb);
          if (nuevaImagen) {
            formData.append('imagenGaleria', nuevaImagen);
          }

          try {
            const respuesta = await fetch(URL_SERVER + `/galeria/${id}`, {
              method: 'PUT',
              body: formData
            });

            if (respuesta.ok) {
              Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'La imagen fue actualizada correctamente.',
                confirmButtonText: 'Ok'
              }).then(() => {
                location.reload();
              });
            } else {
              const error = await respuesta.json();
              Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: error.message || 'Ocurrió un error al actualizar la imagen.',
              });
            }
          } catch (err) {
            console.error('Error al actualizar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar al servidor.',
            });
          }
        });
      });
    });

  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function añadirGaleria() {
  document.getElementById('formularioGaleria').style.display = 'block';
}

function cancelarFormulario() {
  document.getElementById('formularioGaleria').style.display = 'none';
  document.getElementById('tituloInput').value = '';
  document.getElementById('urlInput').value = '';
  document.getElementById('imagenInput').value = '';
  document.getElementById('vistaPrevia').src = '';
  document.getElementById('vistaPrevia').style.display = 'none';
}

function mostrarVistaPrevia(event) {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const vista = document.getElementById('vistaPrevia');
      vista.src = e.target.result;
      vista.style.display = 'block';
    };
    reader.readAsDataURL(archivo);
  }
}

function guardarImagen() {
  const titulo = document.getElementById('tituloInput').value.trim();
  const web = document.getElementById('urlInput').value.trim();
  const imagen = document.getElementById('imagenInput').files[0];

  if (!titulo || !web || !imagen) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.',
    });
    return;
  }

  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('web', web);
  formData.append('imagenGaleria', imagen);

  fetch(URL_SERVER + '/galeria', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Imagen agregada!',
          text: 'La imagen se ha subido correctamente.',
          confirmButtonText: 'Ok'
        }).then(() => {
          cancelarFormulario();
          location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al subir',
          text: 'Hubo un problema al subir la imagen.',
        });
      }
    })
    .catch(error => {
      console.error('Error al subir la imagen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo subir la imagen. Verifica tu conexión o el servidor.',
      });
    });
}


// Eventos
fetch(URL_SERVER + '/eventos')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    tablaBody.innerHTML = '';

    data.forEach(documento => {
      const { id, fecha, lugar, titulo, descripcion } = documento;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="fecha">${fecha}</td>
        <td class="titulo">${titulo}</td>
        <td class="lugar">${lugar}</td>
        <td>
          <button onclick="editarEvento('${id}', this)" class="edit-btnEventos">Editar</button>
          <button onclick="eliminarEvento('${id}', this)" class="delete-btnEventos">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(row);

      const descRow = document.createElement('tr');
      descRow.innerHTML = `
        <td colspan="4" class="descripcion">${descripcion}</td>
      `;
      tablaBody.appendChild(descRow);

      const separador = document.createElement('tr');
      separador.classList.add('espacio-en-blanco');
      separador.innerHTML = `
        <td colspan="4"><div class="linea-separadora"></div></td>
      `;
      tablaBody.appendChild(separador);
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function añadirEvento(button) {
  const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];

  if (document.getElementById('fila-edicion')) return;

  const filaEditable = document.createElement('tr');
  filaEditable.id = 'fila-edicion';
  filaEditable.innerHTML = `
    <td><input type="text" id="nuevaFecha" placeholder="Fecha" /></td>
    <td><input type="text" id="nuevoTitulo" placeholder="Título" /></td>
    <td><input type="text" id="nuevoLugar" placeholder="Lugar" /></td>
  `;

  const filaDescripcion = document.createElement('tr');
  filaDescripcion.id = 'fila-descripcion';
  filaDescripcion.innerHTML = `
    <td colspan="4">
    <textarea id="nuevaDescripcion" placeholder="Descripción" style="height: 150px; width: 100%;"></textarea>
    </td>
  `;

  const filaBotones = document.createElement('tr');
  filaBotones.id = 'fila-botones';
  filaBotones.innerHTML = `
    <td colspan="3" style="text-align:right;">
      <button onclick="guardarEvento()" class="save-btnEventos">Guardar</button>
      <button onclick="cancelarEvento()" class="cancel-btnEventos">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(filaEditable);
  tablaBody.appendChild(filaDescripcion);
  tablaBody.appendChild(filaBotones);
}

function cancelarEvento() {
  ['fila-edicion', 'fila-descripcion', 'fila-botones'].forEach(id => {
    const fila = document.getElementById(id);
    if (fila) fila.remove();
  });
}

function guardarEvento() {
  const fecha = document.getElementById('nuevaFecha').value;
  const titulo = document.getElementById('nuevoTitulo').value;
  const lugar = document.getElementById('nuevoLugar').value;
  const descripcion = document.getElementById('nuevaDescripcion').value;

  if (!fecha || !titulo || !lugar || !descripcion) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos.'
    });
    return;
  }

  const nuevoEvento = { fecha, titulo, lugar, descripcion };

  fetch(URL_SERVER + '/eventos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoEvento)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }
      return response.json();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: '¡Evento guardado!',
        text: 'El evento ha sido guardado correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        cancelarEvento();
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el evento.'
      });
    });
}

function editarEvento(id, botonEditar) {
  const fila = botonEditar.closest('tr');
  const filaDescripcion = fila.nextElementSibling;
  const fecha = fila.querySelector('.fecha').textContent;
  const titulo = fila.querySelector('.titulo').textContent;
  const lugar = fila.querySelector('.lugar').textContent;
  const descripcion = filaDescripcion.querySelector('.descripcion').textContent;

  fila.innerHTML = `
    <td><input type="text" value="${fecha}"></td>
    <td><input type="text" value="${titulo}"></td>
    <td><input type="text" value="${lugar}"></td>
    <td>
      <button onclick="guardarEdicion('${id}', this)" class="save-btnEventos">Guardar</button>
      <button onclick="cancelarEdicion('${id}', this)" class="cancel-btnEventos">Cancelar</button>
    </td>
  `;

  filaDescripcion.innerHTML = `
    <td colspan="4">
      <textarea style="height: 150px; width: 100%;">${descripcion}</textarea>
    </td>
  `;
}

function guardarEdicion(id, botonGuardar) {
  const fila = botonGuardar.closest('tr');
  const filaDescripcion = fila.nextElementSibling;

  const inputs = fila.querySelectorAll('input');
  const fecha = inputs[0].value;
  const titulo = inputs[1].value;
  const lugar = inputs[2].value;
  const descripcion = filaDescripcion.querySelector('textarea').value;

  fetch(URL_SERVER + `/eventos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fecha, titulo, lugar, descripcion })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar');
      return response.json();
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: '¡Evento actualizado!',
        text: 'Los cambios se han guardado correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Ocurrió un problema al guardar los cambios.'
      });
    });
}

function cancelarEdicion(id, botonCancelar) {
  location.reload();
}

function eliminarEvento(id, botonEliminar) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este evento se eliminará permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/eventos/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el evento');
          }
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El evento ha sido eliminado correctamente.'
          });

          const fila = botonEliminar.closest('tr');
          const filaDescripcion = fila.nextElementSibling;
          const filaSeparador = filaDescripcion.nextElementSibling;

          fila.remove();
          filaDescripcion.remove();
          filaSeparador.remove();
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al eliminar el evento.'
          });
        });
    }
  });
}


// Podcasts
fetch(URL_SERVER + '/podcast')
  .then(response => {
    return response.json();
  })
  .then(data => {
    const tablaBody = document.getElementById('tablaP').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const id = documento.id;
      const tituloPod = documento.titulo || '';
      const descripcionPod = documento.descripcion || '';
      const urlPod = documento.url || '';

      tablaHTML += `
        <tr data-id="${id}">
          <td class="podcast">
            <iframe style="border-radius:12px"
              src="${urlPod}"
              width="100%" height="152" frameborder="0" allowfullscreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"></iframe>
            <p class="titulo-podcast">${tituloPod}</p>
            <p>${descripcionPod}</p>
          </td>
          <td class="espacio">
            <button onclick="editarPodcast('${id}', this)" class="edit-btnPodcast">Editar</button>
            <button onclick="eliminarPodcast('${id}', this)" class="delete-btnPodcast">Eliminar</button>
          </td>
        </tr>
        <tr class="fila-espaciadora"></tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function añadirPodcast(boton) {
  const tablaBody = document.getElementById('tablaP').getElementsByTagName('tbody')[0];

  if (document.getElementById('filaNueva')) return;

  const nuevaFila = document.createElement('tr');
  nuevaFila.id = 'filaNueva';
  nuevaFila.innerHTML = `
    <td class="podcast" colspan="3">
      <input type="text" id="nuevoTitulo" placeholder="Título" class="input-podcast"><br>
      <input type="text" id="nuevaDescripcion" placeholder="Descripción" class="input-podcast"><br>
      <input type="text" id="nuevaURL" placeholder="URL del podcast" class="input-podcast"><br><br>
      <button onclick="guardarNuevoPodcast()" class="save-btnPodcast">Guardar</button>
      <button onclick="cancelarNuevoPodcast()" class="cancel-btnPodcast">Cancelar</button>
    </td>
  `;

  tablaBody.appendChild(nuevaFila);
}

function cancelarNuevoPodcast() {
  const fila = document.getElementById('filaNueva');
  if (fila) fila.remove();
}

function guardarNuevoPodcast() {
  const titulo = document.getElementById('nuevoTitulo').value.trim();
  const descripcion = document.getElementById('nuevaDescripcion').value.trim();
  const url = document.getElementById('nuevaURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios',
      confirmButtonColor: '#6f42c1'
    });
    return;
  }

  fetch(URL_SERVER + '/podcast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ titulo, descripcion, url })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al crear el podcast');
      return response.json();
    })
    .then(data => {
      console.log('Podcast creado:', data);
      cancelarNuevoPodcast();
      Swal.fire({
        icon: 'success',
        title: 'Podcast agregado',
        text: 'El podcast se ha guardado correctamente',
        confirmButtonColor: '#6f42c1',
        confirmButtonText: 'OK'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar el podcast',
        confirmButtonColor: '#6f42c1'
      });
    });
}

function editarPodcast(id, boton) {
  const fila = boton.closest('tr');
  const tdPodcast = fila.querySelector('.podcast');
  const titulo = tdPodcast.querySelector('.titulo-podcast').innerText;
  const descripcion = tdPodcast.querySelectorAll('p')[1].innerText;
  const url = tdPodcast.querySelector('iframe').src;

  tdPodcast.innerHTML = `
    <input type="text" id="editTitulo" value="${titulo}" placeholder="Título" class="input-podcast"><br>
    <input type="text" id="editDescripcion" value="${descripcion}" placeholder="Descripción" class="input-podcast"><br>
    <input type="text" id="editURL" value="${url}" placeholder="URL del podcast" class="input-podcast"><br>
  `;

  const espacio = fila.querySelector('.espacio');
  espacio.innerHTML = `
    <button onclick="guardarCambiosPodcast('${id}', this)" class="save-btnPodcast">Guardar</button>
    <button onclick="cancelarEdicionPodcast('${id}', this)" class="cancel-btnPodcast">Cancelar</button>
  `;
}

function guardarCambiosPodcast(id, boton) {
  const fila = boton.closest('tr');
  const titulo = fila.querySelector('#editTitulo').value.trim();
  const descripcion = fila.querySelector('#editDescripcion').value.trim();
  const url = fila.querySelector('#editURL').value.trim();

  if (!titulo || !descripcion || !url) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios',
      confirmButtonColor: '#6f42c1'
    });
    return;
  }

  fetch(URL_SERVER + `/podcast/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ titulo, descripcion, url })
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar el podcast');
      return response.json();
    })
    .then(data => {
      console.log('Actualizado:', data);
      Swal.fire({
        icon: 'success',
        title: 'Podcast actualizado',
        text: 'Los cambios se han guardado correctamente',
        confirmButtonColor: '#6f42c1',
        confirmButtonText: 'OK'
      }).then(() => {
        location.reload();
      });
    })
    .catch(error => {
      console.error('Error al actualizar el podcast:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar los cambios',
        confirmButtonColor: '#6f42c1'
      });
    });
}

function cancelarEdicionPodcast(id, boton) {
  location.reload();
}

function eliminarPodcast(id, boton) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este podcast se eliminará permanentemente',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL_SERVER + `/podcast/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el podcast');
          }
          return response.json();
        })
        .then(data => {
          console.log('Podcast eliminado:', data);

          const fila = boton.closest('tr');
          const siguienteFila = fila.nextElementSibling;
          fila.remove();
          if (siguienteFila && siguienteFila.classList.contains('fila-espaciadora')) {
            siguienteFila.remove();
          }

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El podcast ha sido eliminado correctamente',
            confirmButtonColor: '#6f42c1',
            confirmButtonText: 'OK'
          });
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al eliminar el podcast',
            confirmButtonColor: '#6f42c1'
          });
        });
    }
  });
}

window.editarImagenPortada = editarImagenPortada;
window.cancelarEdicionCohorte = cancelarEdicionCohorte;
window.guardarEdicionCohorte = guardarEdicionCohorte;
window.añadirGaleria = añadirGaleria;
window.mostrarVistaPrevia = mostrarVistaPrevia;
window.cancelarFormulario = cancelarFormulario;
window.guardarImagen = guardarImagen;
window.añadirEvento = añadirEvento;
window.editarEvento = editarEvento;
window.guardarEvento = guardarEvento;
window.cancelarEvento = cancelarEvento;
window.guardarEdicion = guardarEdicion;
window.cancelarEdicion = cancelarEdicion;
window.eliminarEvento = eliminarEvento;
window.añadirPodcast = añadirPodcast;
window.guardarNuevoPodcast = guardarNuevoPodcast;
window.cancelarNuevoPodcast = cancelarNuevoPodcast;
window.editarPodcast = editarPodcast;
window.guardarCambiosPodcast = guardarCambiosPodcast;
window.cancelarEdicionPodcast = cancelarEdicionPodcast;
window.eliminarPodcast = eliminarPodcast;
