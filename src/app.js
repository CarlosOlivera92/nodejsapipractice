import express from "express";
import productsRouter from './routes/products.router.js';

const port = 8080;

const server = express();

server.use(express.json());
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

server.use('/api/products', productsRouter);


server.listen(port, () => {
    console.log('Server listening on port: 8080');
});