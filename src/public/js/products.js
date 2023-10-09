const socket = io();
socket.emit('message', "este es un mensaje para el servidor, chupala hdmp sapeeeee")

const form = document.getElementById('form');
const productList = document.getElementById('product-list');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    // Verifica el estado del checkbox y actualiza el campo oculto
    const statusCheckbox = document.getElementById('status');
    if (!statusCheckbox.checked) {
        formData.set('status', 'false');
    }

    const productData = {};

    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            // Convierte 'price' y 'stock' a enteros
            productData[key] = parseFloat(value);
        } else if (key === 'thumbnail') {
            // Convierte 'thumbnail' en un array de cadenas
            productData[key] = value.split(',').map((thumbnail) => thumbnail.trim());
        } else if (key === 'status') {
            // Convierte 'status' en un booleano basado en si está marcado o no
            productData[key] = value === 'true' ? true : false;
        } else {
            productData[key] = value;
        }
    });

    // Envía los datos del producto al servidor a través de WebSocket.
    socket.emit('addProduct', productData);

    // Limpia el formulario después de enviarlo.
    form.reset();
});


socket.on('updateProducts', (updatedProducts) => {
    console.log(updatedProducts);
    // Actualiza la vista con la lista de productos actualizada
    productList.innerHTML = ''; // Corrige el nombre aquí

    updatedProducts.forEach((product) => {
        // Crea elementos HTML para mostrar los productos
        const li = document.createElement('li');
        li.innerHTML = `
            <h1>${product.title}</h1>
            <p>Descripción: ${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Categoría: ${product.category}</p>
            <p>Código: ${product.code}</p>
            <p>Estado: ${product.status ? 'Disponible' : 'No disponible'}</p>
            <p>Stock: ${product.stock}</p>
            <h2>Miniaturas:</h2>
            <ul>
                ${product.thumbnail.map((thumb) => `<li><img src="${thumb}" alt="Miniatura"></li>`).join('')}
            </ul>
        `;
        productList.appendChild(li);
    });
});