let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio, imagen, categoria) {
    const producto = { id, nombre, precio, imagen, categoria };
    carrito.push(producto);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

// Función para mostrar los productos
function mostrarProductos(data) {
    const productosContainer = document.getElementById('productos-container');
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    data.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h2>${producto.nombre}</h2>
                <p>Precio: $${producto.precio.toFixed(2)}</p>
                <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}', '${producto.categoria}')">Agregar al carrito</button>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });
}

// Función para filtrar los productos por búsqueda
function filtrarProductos() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    fetch('tienda.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const productosFiltrados = data.filter(producto => 
                producto.nombre.toLowerCase().includes(busqueda)
            );
            mostrarProductos(productosFiltrados);
        })
        .catch(error => console.error('Error:', error));
}

// Función para actualizar el contenido del carrito en la página
function actualizarCarrito() {
    const productosCarrito = document.getElementById('productos-carrito-lista');
    const totalCarrito = document.getElementById('total-carrito');
    
    // Limpiar el contenido actual del carrito, manteniendo el botón de vaciar
    productosCarrito.innerHTML = '<button id="vaciar-carrito" onclick="vaciarCarrito()">Vaciar Carrito</button>';
    
    // Calcular el total del carrito
    let total = 0;
    
    carrito.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto-carrito';
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;">
            <div>${producto.nombre} - $${producto.precio.toFixed(2)}</div>
        `;
        productosCarrito.appendChild(productoDiv);
        total += producto.precio;
    });
    
    // Agregar el total al final del contenido del carrito
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

// Función para guardar el carrito en el almacenamiento local
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para realizar la compra
function comprarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // Vaciar el carrito y actualizar la vista
    vaciarCarrito();
    
    // Mostrar mensaje de confirmación
    const mensajeDiv = document.getElementById('mensaje-confirmacion');
    mensajeDiv.textContent = '¡Gracias por su compra!';
    setTimeout(() => mensajeDiv.textContent = '', 3000); // Ocultar el mensaje después de 3 segundos
}

// Mostrar/ocultar el carrito al hacer clic en la imagen del carrito
document.getElementById('carrito-toggle').addEventListener('click', () => {
    const carritoDiv = document.getElementById('productos-carrito');
    carritoDiv.style.display = carritoDiv.style.display === 'none' || carritoDiv.style.display === '' ? 'block' : 'none';
});

// Evento para la búsqueda de productos
document.getElementById('busqueda').addEventListener('input', filtrarProductos);

// Evento para la compra
document.getElementById('comprar-carrito').addEventListener('click', comprarCarrito);

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetch('tienda.json')
        .then(response => response.json())
        .then(data => mostrarProductos(data))
        .catch(error => console.error('Error:', error));
});
