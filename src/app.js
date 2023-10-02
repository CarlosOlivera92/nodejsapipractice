import express from "express";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
const port = 8080;

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/products', productsRouter);
server.use('/api/carts', cartsRouter);

server.listen(port, () => {
    console.log('Server listening on port: 8080');
});