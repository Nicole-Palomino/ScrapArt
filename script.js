// Datos simulados de productos con categorías
const productos = [
    { id: 1, nombre: "Camiseta", descripcion: "Camiseta de algodón.", imagen: "https://i.pinimg.com/236x/4d/82/44/4d8244377b4746c3270fe51d2786762d.jpg", categoria: "ropa" },
    { id: 2, nombre: "Licuadora", descripcion: "Licuadora de alta potencia.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwwH3_SYdIIL-nbV1X_uuCsD1AcvysA9FXZQ&s", categoria: "electrodomesticos" },
    { id: 3, nombre: "El Principito", descripcion: "Clásico libro infantil.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3UjlFzF4Xz84-FsRQAC1OPWwfi68bJPXSug&s", categoria: "libros" },
    { id: 4, nombre: "Pantalón", descripcion: "Pantalón vaquero ajustado.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm6CLXBnxe-DJMl-crIMgqV8C6vsXwwH-RsQ&s", categoria: "ropa" },
    { id: 5, nombre: "Televisor", descripcion: "Televisor 4K de 55 pulgadas.", imagen: "https://claudiarafaella.com/wp-content/uploads/2016/08/tarjeta-scrapbook-para-el-dia-de-la-madre-12-1.jpg", categoria: "electrodomesticos" },
    { id: 6, nombre: "Cien años de soledad", descripcion: "Obra maestra de Gabriel García Márquez.", imagen: "https://claudiarafaella.com/wp-content/uploads/2016/08/tarjeta-scrapbook-para-el-dia-de-la-madre-14-1.jpg", categoria: "libros" },
    { id: 7, nombre: "Zapatos", descripcion: "Zapatos deportivos cómodos.", imagen: "https://i.pinimg.com/originals/08/27/c3/0827c3fd267b91d22f2ee195029ab1a2.jpg", categoria: "ropa" },
    { id: 8, nombre: "Refrigerador", descripcion: "Refrigerador con congelador.", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPt4xUAR4RzFu6ke59Fi2G36H9hXRAENfRQ&s", categoria: "electrodomesticos" },
];

let carrito = [];

const itemsPerPage = 4; // Cantidad de productos por página
let currentPage = 1;
let productoSeleccionado = null;

// Cargar carrito desde localStorage si existe
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("contadorCarrito");
    const carritoVacio = document.getElementById("carritoVacio");
    const btnWhatsApp = document.getElementById("btnWhatsApp");

    // Limpiar lista
    lista.innerHTML = "";

    if (carrito.length === 0) {
        carritoVacio.style.display = "block";
        btnWhatsApp.href = "#";
        btnWhatsApp.setAttribute("disabled", true);
    } else {
        carritoVacio.style.display = "none";
        btnWhatsApp.removeAttribute("disabled");

        let mensaje = "Hola, estoy interesado en los siguientes productos:\n\n";
        carrito.forEach((producto, index) => {
            lista.innerHTML += `
                <div class="card mb-3">
                    <div class="row g-0 align-items-center">
                        <div class="col-3">
                            <img src="${producto.imagen}" class="img-fluid rounded-start" alt="${producto.nombre}">
                        </div>
                        <div class="col-6">
                            <div class="card-body p-2">
                                <h6 class="card-title mb-1">${producto.nombre}</h6>
                            </div>
                        </div>
                        
                        <div class="col-3 text-end pe-3">
                            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            mensaje += `${index + 1}. ${producto.nombre}\n`;
        });

        const email = "tuemail@example.com"; // 👈 Tu correo aquí
        const asunto = encodeURIComponent("Consulta sobre productos");
        const cuerpo = encodeURIComponent(mensaje);

        btnWhatsApp.href = `mailto:${email}?subject=${asunto}&body=${cuerpo}`;
        btnWhatsApp.textContent = "Enviar por Correo";
        btnWhatsApp.classList.remove("btn-success");
        btnWhatsApp.classList.add("btn-primary");
    }

    contador.textContent = carrito.length;
}

function agregarAlCarritoDesdeModal() {
    if (productoSeleccionado) {
        // Aquí asumimos que tienes definida la función `agregarAlCarrito()`
        // como lo hicimos anteriormente con localStorage
        carrito.push(productoSeleccionado);
        guardarCarrito(); // función que guarda en localStorage
        actualizarCarrito(); // actualiza interfaz del carrito

        alert(`${productoSeleccionado.nombre} agregado al carrito.`);
    }
}

function handleDetalleClick(buttonElement) {
    const id = parseInt(buttonElement.getAttribute("data-id"));
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        abrirModal(producto);
    } else {
        alert("Producto no encontrado");
    }
}

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(); // Mostrar notificación
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

function renderizarProductos() {
    mostrarSpinner(); // Mostrar spinner al iniciar

    setTimeout(() => { // Simular retraso de red o API
        const searchQuery = document.getElementById("searchInput").value.toLowerCase();
        const categoryFilter = document.getElementById("categoryFilter").value;

        let filtrados = productos.filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(searchQuery);
            const coincideCategoria = categoryFilter === "all" || producto.categoria === categoryFilter;
            return coincideNombre && coincideCategoria;
        });

        const totalPages = Math.ceil(filtrados.length / itemsPerPage);
        const inicio = (currentPage - 1) * itemsPerPage;
        const fin = inicio + itemsPerPage;
        const productosPagina = filtrados.slice(inicio, fin);

        const contenedor = document.getElementById("productosContainer");
        contenedor.innerHTML = "";

        productosPagina.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("col");

            card.innerHTML = `
                <div class="card producto-card h-100 shadow-sm">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text text-truncate">${producto.descripcion}</p>
                        <button class="btn btn-outline-primary w-100" data-id="${producto.id}" onclick="handleDetalleClick(this)">
                            Ver detalles
                        </button>
                        <button class="btn btn-outline-primary w-100 agregar-carrito-btn mt-3" data-id="${producto.id}" onclick="agregarConAnimacion(this, ${producto.id})">
                            <i class="bi bi-cart-plus"></i> Agregar al carrito
                        </button>
                    </div>
                </div>
            `;

            contenedor.appendChild(card);
        });

        ocultarSpinner(); // Ocultar spinner al terminar
        renderizarPaginacion(totalPages);
    }, 600); // Duración del efecto de carga
}

// Paginación
function renderizarPaginacion(totalPages) {
    const paginacion = document.getElementById("pagination");
    paginacion.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("li");
        btn.classList.add("page-item");
        if (i === currentPage) btn.classList.add("active");

        btn.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderizarProductos();
        });

        paginacion.appendChild(btn);
    }
}

function mostrarSpinner() {
    document.getElementById("loadingSpinner").classList.remove("d-none");
    document.getElementById("productosContainer").innerHTML = "";
}

function ocultarSpinner() {
    document.getElementById("loadingSpinner").classList.add("d-none");
}

function mostrarNotificacion() {
    const toastEl = document.getElementById('productoAgregadoToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function agregarConAnimacion(btn, id) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;

    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Agregando...';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        agregarAlCarrito(prod);
    }, 700);
}

function abrirModal(producto) {
    productoSeleccionado = producto;

    document.getElementById("modalNombre").textContent = producto.nombre;
    document.getElementById("modalDescripcion").textContent = producto.descripcion;
    document.getElementById("modalCategoria").textContent = producto.categoria;
    document.getElementById("modalImagen").src = producto.imagen;

    const modal = new bootstrap.Modal(document.getElementById("productoModal"));
    modal.show();
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", () => {
    currentPage = 1;
    renderizarProductos();
});

document.getElementById("categoryFilter").addEventListener("change", () => {
    currentPage = 1;
    renderizarProductos();
});

// Iniciar aplicación
window.onload = () => {
    cargarCarrito();
    renderizarProductos();
};