

const socket = io();
const form = document.getElementById('form');
const delProductForm = document.getElementById('delProductForm');
const productList = document.getElementById('product-list');

// Inicializa el cartId desde el localStorage al cargar la página
let cart = localStorage.getItem('cart') || null;
let token = localStorage.getItem('jwtToken') || null;


const viewProductsDetails = (productId) => {
    window.location.href = `/products/${productId}`;
}
const delProductFromCart = async(productId) => {
    try {
        const response = await fetch(`/api/carts/${cart}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const responseData = await response.json();
            console.log(responseData);
            alert('Producto eliminado del carrito correctamente!');
            window.location.reload();

        } else {
            throw new Error('Error al eliminar el producto del carrito');
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto del carrito');
    }
}
const deleteCart = async() => {
    try {
        const response = await fetch(`/api/carts/${cart}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const responseData = await response.json();
            console.log(responseData);
            alert('Carrito eliminado correctamente!');
            localStorage.removeItem('cart');
            cart = null; 
            window.location.reload();
        } else {
            throw new Error('Error al eliminar el carrito');
        }
    } catch(error) {
        console.error('Error:', error);
        alert('Error al eliminar el carrito');
    }
}
const addToCart = async (productId) => {
    try {
        let data = {
            productId: productId,
            cartId: cart, // Enviar solo el ID del carrito
        };
        const response = await fetch('/api/carts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        if (response.status === 201 || response.status === 200) {
            const responseData = await response.json();
            console.log(responseData); // Agrega este registro para verificar si el ID del carrito se obtiene correctamente
            alert('Producto añadido al carrito correctamente');
            cart = responseData.data.cart; // Obtener solo el ID del carrito
            localStorage.setItem('cart', cart); // Guardar solo el ID del carrito en el localStorage
            console.log('Cart ID:', cart); // Agrega este registro para verificar si el valor de cart se actualiza correctamente
            window.location.reload();

        } else {
            throw new Error('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el producto al carrito');
    }
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
    console.log(products)
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