

const socket = io();
const form = document.getElementById('form');
const delProductForm = document.getElementById('delProductForm');
const productList = document.getElementById('product-list');

// Inicializa el cartId desde el localStorage al cargar la página
let cartId = localStorage.getItem('cartId') || null;

const viewProductsDetails = (productId) => {
    window.location.href = `/products/${productId}`;
}

const addToCart = async (productId) => {
    const data = {
        productId: productId,
        cartId: cartId
    };
    fetch('/api/carts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(async (response) => {
        if (response.status === 201 || response.status === 200) {
            return response.json();
        }
        throw new Error('Error al agregar el producto al carrito');
    })
    .then((data) => {
        alert('Producto añadido al carrito correctamente');
        cartId = data.data; 
        localStorage.setItem('cartId', cartId); 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
        alert(cartId)
    });
}



form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const statusCheckbox = document.getElementById('status');
    if (!statusCheckbox.checked) {
        formData.set('status', 'false');
    }

    const productData = {};

    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            productData[key] = parseFloat(value);
        } else if (key === 'thumbnail') {
            productData[key] = value.split(',').map((thumbnail) => thumbnail.trim());
        } else if (key === 'status') {
            productData[key] = value === 'true' ? true : false;
        } else {
            productData[key] = value;
        }
    });

    socket.emit('addProduct', productData);

    // Limpia el formulario después de enviarlo.
    form.reset();
});

socket.on('newProducts', (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ''; // Borra el contenido actual

    for (let product of products.products) {
        const productItem = `
            <div class="product">
                <h1>${product.title}</h1>
                <p>Descripción: ${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <p>Código: ${product.code}</p>
                <p>Estado: ${product.status ? 'Disponible' : 'No disponible'}</p>
                <p>Stock: ${product.stock}</p>
                <div class="images">
                    <h2>Miniaturas:</h2>
                    ${product.thumbnail.map((thumb) => `<img src="${thumb}" alt="Miniatura">`).join('')}
                </div>
            </div>
        `;
        productList.innerHTML += productItem;
    }
});
delProductForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(delProductForm);
    const productId = formData.get('productId');
    socket.emit('delProduct', productId);
})