document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.querySelector(".search-bar");

    const rutasInternas = {
        "inicio":"index.html",
        "quienes somos": "presentacion.html",
        "presentacion": "presentacion.html",
        "objetivos": "objetivos.html",
        "mision y vision": "misionVision.html",
        "estado del arte": "estadoArte.html",
        "infraestructura cientifica": "infraestructura.html",
        "nucleo academico basico": "nucleoAcademico.html",
        "lgyac": "lgac.html",
        "plan de estudios": "localizacion.html",
        "localizacion del programa": "localizacion.html",
        "sintesis del plan de estudios": "sintesisPlan.html",
        "perfil de ingreso y egreso": "ingresoEgreso.html",
        "procesos administrativos": "requisitosIngreso.html",
        "requisitos de ingreso": "requisitosIngreso.html",
        "requisitos de permanencia": "requisitosPermanencia.html",
        "requisitos de grado academico": "requisitosAcademico.html",
        "productividad": "productividad.html",
        "egresados": "egresados.html",
        "cohorte generacional": "cohorte.html",
        "contacto": "contacto.html"
    };

    searchBar.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            let query = this.value.trim().toLowerCase();

            if (query !== "") {
                if (rutasInternas.hasOwnProperty(query)) {
                    window.location.href = rutasInternas[query];
                } else {
                    window.open(`https://www.itdurango.edu.mx/?q=${encodeURIComponent(query)}`, "_blank");
                }
            }
        }
    });
});

