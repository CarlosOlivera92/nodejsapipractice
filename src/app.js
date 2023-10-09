import express from "express";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import {__dirname} from "./utils.js"; // Importa __dirname desde utils.js
import { Server } from "socket.io";
import viewsRouter from './routes/views.router.js';

const port = 8080;
const app = express();

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
})