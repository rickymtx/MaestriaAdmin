
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
        const imagenCohorte = documento.imagen || '';
        const tituloImg = documento.titulo || '';

      tablaHTML += `
        <tr>
            <td><img src="${imagenCohorte}" class="imagen" /></td>
        </tr>
        <tr>
            <th class="titulo-cohorte">${tituloImg}</th>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});

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

    inicializarCarrusel();
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

let carrussel = 0;
let slides;
let images;
let totalSlides;
let carruselInterval; 

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

  if (carruselInterval) clearInterval(carruselInterval);
  carruselInterval = setInterval(() => moveSlide(1), 3000);
}

function moveSlide(step) {
  carrussel += step;

  if (carrussel >= totalSlides) {
    carrussel = 0;
  } else if (carrussel < 0) {
    carrussel = totalSlides - 1;
  }

  slides.style.transform = `translateX(-${carrussel * 100}vw)`;
}

// Tabla de Galería
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
              <div class="contenedor-galeria">
                <h2 class="titulo-galeria">${tituloGaleria}</h2>
                <img src="${imagenGaleria}" alt="Imagen" class="imagen-galeria">
                <a href="${urlGaleria}" target="_blank" class="ver-mas-galeria">Ver más ↗</a>
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
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});


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
        <tr>
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
