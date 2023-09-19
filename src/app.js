import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath desde el módulo url

import { ProductManager } from "./shared/classes/product-manager.js"; // Importa la clase ProductManager directamente


// Convierte la URL actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el directorio base
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'shared/data', 'products.json').replace(/\\/g, '/');
const manager = new ProductManager(filePath);



const server = express();

server.use(express.urlencoded({ extended: true }));

server.listen(8080, () => {
    console.log('Server listening on port: 8080');
});

//Metodo comentado porque ya hay productos en el archivo Products.Json
/*
server.get('/add-product', (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.query;
    if (title && description && price && thumbnail && code && stock) {
        // Convierte los valores necesarios a los tipos adecuados (por ejemplo, price a número)
        const numericPrice = parseFloat(price);
        const numericStock = parseInt(stock);

        manager.addProduct(title, description, numericPrice, thumbnail, code, numericStock);
        res.redirect('/'); // Redirigir a la página principal después de agregar el producto
    } else {
        res.status(400).send('Los parámetros de consulta son requeridos.');
    }
});
*/

server.get('/products', async (req, res) => {
    const { limit } = req.query; // Destructuring
    const products = await manager.getProducts();

    // Verificar si `limit` está presente y es un número válido
    if (limit && !isNaN(parseInt(limit))) {
        const limitNumber = parseInt(limit);

        // Limitar la lista de productos utilizando el número especificado en `limit`
        const limitedProducts = products.slice(0, limitNumber); //El primer argumento de Slice es el indice donde empezará

        // Generar la lista de elementos HTML para los productos limitados
        const productListHTML = limitedProducts.map(product => {
            return `
                <li>
                    <strong>ID:</strong> ${product.id}<br>
                    <strong>Título:</strong> ${product.title}<br>
                    <strong>Descripción:</strong> ${product.description}<br>
                    <strong>Precio:</strong> $${product.price}<br>
                    <strong>Código:</strong> ${product.code}<br>
                    <strong>Stock:</strong> ${product.stock}<br>
                </li>
            `;
        });
        const html = `
            <html>
                <head>
                    <title>Lista de Productos</title>
                </head>
                <body>
                    <h1>Lista de Productos</h1>
                    <ul>
                        ${productListHTML}
                    </ul>
                </body>
            </html>
        `;

        res.send(html);
    } else {
        const productListHTML = products.map(product => {
            return `
                <li>
                    <strong>ID:</strong> ${product.id}<br>
                    <strong>Título:</strong> ${product.title}<br>
                    <strong>Descripción:</strong> ${product.description}<br>
                    <strong>Precio:</strong> $${product.price}<br>
                    <strong>Código:</strong> ${product.code}<br>
                    <strong>Stock:</strong> ${product.stock}<br>
                </li>
            `;
        });

        const html = `
            <html>
                <head>
                    <title>Lista de Productos</title>
                </head>
                <body>
                    <h1>Lista de Productos</h1>
                    <ul>
                        ${productListHTML}
                    </ul>
                </body>
            </html>
        `;
        res.send(html);
    }
});
server.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const selectedProduct = await manager.getProductById(productId);
    console.log(selectedProduct);
    const html = `
        <html>
            <head>
                <title>Lista de Productos</title>
            </head>
            <body>
                <h1>Lista de Productos</h1>
                <ul>
                    <li>
                        <strong>ID:</strong> ${selectedProduct.id}<br>
                        <strong>Título:</strong> ${selectedProduct.title}<br>
                        <strong>Descripción:</strong> ${selectedProduct.description}<br>
                        <strong>Precio:</strong> $${selectedProduct.price}<br>
                        <strong>Código:</strong> ${selectedProduct.code}<br>
                        <strong>Stock:</strong> ${selectedProduct.stock}<br>
                    </li>
                </ul>
            </body>
        </html>
    `;
    res.send(html);

})