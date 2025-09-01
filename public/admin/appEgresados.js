
import {URL_SERVER} from "../config1.js"

// Tabla de Egresados
fetch(URL_SERVER + '/egresados')
  .then(response => response.json())
  .then(data => {
    const tablaBody = document.getElementById('tabla1').getElementsByTagName('tbody')[0];
    let tablaHTML = '';

    data.forEach(documento => {
      const imagenEgresados = documento.image || '';
      const idDoc = documento.id; 

      tablaHTML += `
        <tr data-id="${idDoc}">
          <td>
            <img src="${imagenEgresados}" class="imagen-egresado" width="150"><br>
            <input type="file" class="input-editar" accept="image/*" style="display: none;">
            <button class="btn-editar">Editar imagen</button>
            <button class="btn-guardar" style="display: none;">Guardar</button>
            <button class="btn-cancelar" style="display: none;">Cancelar</button>
          </td>
        </tr>
      `;
    });

    tablaBody.innerHTML = tablaHTML;

    // Añadir eventos a los botones
    document.querySelectorAll('.btn-editar').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const img = row.querySelector('.imagen-egresado');
        const input = row.querySelector('.input-editar');

        row.dataset.imagenOriginal = img.src;

        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target.result;
              row.querySelector('.btn-guardar').style.display = 'inline';
              row.querySelector('.btn-cancelar').style.display = 'inline';
            };
            reader.readAsDataURL(file);
          }
        };
      });
    });

    // Botón Cancelar
    document.querySelectorAll('.btn-cancelar').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const img = row.querySelector('.imagen-egresado');

        if (row.dataset.imagenOriginal) {
          img.src = row.dataset.imagenOriginal;
        }

        row.querySelector('.btn-guardar').style.display = 'none';
        row.querySelector('.btn-cancelar').style.display = 'none';
        row.querySelector('.input-editar').value = '';
      });
    });

    document.querySelectorAll('.btn-guardar').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const id = row.dataset.id;
        const fileInput = row.querySelector('.input-editar');
        const file = fileInput.files[0];

        if (!file) {
          Swal.fire({
            icon: 'warning',
            title: 'Ninguna imagen seleccionada',
            text: 'Por favor selecciona una imagen antes de guardar.',
          });
          return;
        }

        const formData = new FormData();
        formData.append('imgEgresados', file);

        fetch(URL_SERVER + `/egresados/${id}`, {
          method: 'PUT',
          body: formData
        })
        .then(res => res.text())
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Imagen actualizada',
            text: 'La imagen se ha actualizado correctamente.',
            confirmButtonText: 'Ok'
          });
          row.querySelector('.btn-guardar').style.display = 'none';
          row.querySelector('.btn-cancelar').style.display = 'none';
        })
        .catch(err => {
          console.error('Error al actualizar la imagen:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'No se pudo subir la imagen. Intenta de nuevo.',
          });
        });
      });
    });
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
});
