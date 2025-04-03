let tareaAgregada = document.getElementById("tareaAgregada");
let btnTareaAgregada = document.getElementById("agregar-tarea-boton");
let listaTareas = document.getElementById("listaTareas");
let btnEliminarCompletadas = document.getElementById("eliminarCompletadas");
let btnMostrarTodas = document.getElementById("mostrarTodas");
let btnMostrarCompletadas = document.getElementById("mostrarCompletadas");
let btnMostrarPendientes = document.getElementById("mostrarPendientes");
let btnTareaMasRapida = document.getElementById("tareaMasRapida");
let resultadoRapida = document.getElementById("resultadoRapida");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let filtroActual = "todas";

function mostrarTareas() {
    listaTareas.innerHTML = "";
    tareas.filter(tarea => 
        filtroActual === "completadas" ? tarea.completada :
        filtroActual === "pendientes" ? !tarea.completada : true
    ).forEach((tarea, i) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.addEventListener("change", () => {
            tarea.completada = checkbox.checked;
            tarea.fechaCompletada = tarea.completada ? new Date().toString() : null;
            actualizarTareas();
        });

        const fechaCreacion = ` (Creada: ${new Date(tarea.fechaCreacion).toLocaleString()})`;
        const fechaCompletada = tarea.completada && tarea.fechaCompletada 
            ? `<span style="color:green;"> (Completada: ${new Date(tarea.fechaCompletada).toLocaleString()})</span>` 
            : "";

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarTarea(i));

        li.innerHTML = `${tarea.texto}${fechaCreacion}${fechaCompletada}`;
        li.prepend(checkbox);
        li.appendChild(btnEliminar);
        listaTareas.appendChild(li);
    });
}

function agregarTarea() {
    const texto = tareaAgregada.value;
    if (texto) {
        tareas.push({
            texto,
            completada: false,
            fechaCreacion: new Date().toString(),
            fechaCompletada: null
        });
        tareaAgregada.value = "";
        actualizarTareas();
    }
}

function eliminarTarea(i) {
    tareas.splice(i, 1);
    actualizarTareas();
}

function eliminarCompletadas() {
    tareas = tareas.filter(tarea => !tarea.completada);
    actualizarTareas();
}

function actualizarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareas();
}

function actualizarFiltro(boton) {
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
}

btnMostrarTodas.addEventListener("click", () => {
    filtroActual = "todas";
    actualizarFiltro(btnMostrarTodas);
    mostrarTareas();
});

btnMostrarCompletadas.addEventListener("click", () => {
    filtroActual = "completadas";
    actualizarFiltro(btnMostrarCompletadas);
    mostrarTareas();
});

btnMostrarPendientes.addEventListener("click", () => {
    filtroActual = "pendientes";
    actualizarFiltro(btnMostrarPendientes);
    mostrarTareas();
});

btnTareaAgregada.addEventListener("click", agregarTarea);
btnEliminarCompletadas.addEventListener("click", eliminarCompletadas);

document.getElementById("mostrarTodas").classList.add("activo");

function tareaMasRapida() {
    let tareaRapida = tareas.reduce((rapida, tarea) => {
        if (tarea.completada && tarea.fechaCreacion && tarea.fechaCompletada) {
            let tiempoTotal = new Date(tarea.fechaCompletada) - new Date(tarea.fechaCreacion);
            return tiempoTotal < rapida.tiempo ? { tarea, tiempo: tiempoTotal } : rapida;
        }
        return rapida;
    }, { tarea: null, tiempo: null });

    resultadoRapida.textContent = tareaRapida.tarea 
        ? `La tarea más rápida fue "${tareaRapida.tarea.texto}" en ${Math.round(tareaRapida.tiempo / 1000)} segundos.`
        : "No hay tareas completadas aún.";
}

btnTareaMasRapida.addEventListener("click", tareaMasRapida);

mostrarTareas();
