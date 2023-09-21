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
const port = 8080;


const server = express();

server.use(express.urlencoded({ extended: true }));



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
    try {
        const { limit } = req.query;
        const products = await manager.getProducts();

        if (limit && !isNaN(parseInt(limit))) {
            const limitNumber = parseInt(limit);
            const limitedProducts = products.slice(0, limitNumber);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
});

server.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const selectedProduct = await manager.getProductById(productId);

        if (selectedProduct === 'Producto no encontrado') {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(selectedProduct);
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
server.listen(port, () => {
    console.log('Server listening on port: 8080');
});