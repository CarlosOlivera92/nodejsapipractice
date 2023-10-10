import express from "express";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import {__dirname} from "./utils.js"; // Importa __dirname desde utils.js
import { Server } from "socket.io";
import viewsRouter from './routes/views.router.js';
import { ProductManager } from "./public/shared/classes/product-manager.js";
import { productsFilePath } from "./utils.js";
const port = 8080;
const app = express();
const manager = new ProductManager(productsFilePath);

console.log(__dirname)
//Servidor archivos estaticos
app.use(express.static(`${__dirname}/public`))

//Motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}\\views`);
app.set('view engine', 'handlebars');

//Configuracion de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

//Levantar servidor
const server = app.listen(8080, () => {
    console.log(` listening on port: ${port}`);
})

//Socket IO
const socketServer = new Server(server);

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    socket.on('message', data => {
        console.log(data);
    })
    socket.on('addProduct', async(productData) => {
    try {
        await manager.addProduct(
            productData.title,
            productData.description,
            productData.price,
            productData.thumbnail,
            productData.category,
            productData.code,
            productData.status,
            productData.stock
        );
    
        const updatedProducts = await manager.getProducts();
        socketServer.emit('updateProducts', updatedProducts); // Envia la actualización al cliente que la solicitó
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
    socket.on('delProduct', async(productId) => {
        try {
            await manager.deleteProduct(productId);
            const updatedProducts = await manager.getProducts();
            socketServer.emit('updateProducts', updatedProducts); // Envia la actualización al cliente que la solicitó
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    })
})