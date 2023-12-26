import express from "express";
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import handlebars from 'express-handlebars';
import {__dirname} from "./utils.js"; // Importa __dirname desde utils.js
import { Server } from "socket.io";
import mongoose from "mongoose";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import messagesRouter from './routes/messages.router.js';
import AuthRouter from './routes/auth.router.js';
import ViewsRouter from "./routes/views.router.js";
import CartsRouter from "./routes/carts.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from 'cookie-parser';


const port = 8080;
const app = express();


const authRouter = new AuthRouter();
const viewsRouter = new ViewsRouter();
const cartsRouter = new CartsRouter();
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


//Configuración de sesión
app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3000
    }),
    secret: "Coder256SecretKey",
    resave: false,
    saveUninitialized: false,
}));
// Cookie Parser 
app.use(cookieParser());

//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/chat', messagesRouter);
app.use('/api/auth', authRouter.getRouter());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter.getRouter());

//Levantar servidor
const server = app.listen(8080, () => {
    console.log(` listening on port: ${port}`);
})
//Socket IO
const socketServer = new Server(server);

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    socket.on('addProduct', async(productData) => {
        try {
            await manager.save(productData);
            const addedProducts = await manager.getAll();
            socketServer.emit('newProducts', { products: addedProducts }); // Envia la actualización al cliente que la solicitó
        } catch (error) {
                console.error('Error al agregar el producto:', error);
            }
        });
    socket.on('delProduct', async(productId) => {
        try {
            const id = new ObjectId(productId);
            await manager.deleteOne(id);
            const updatedProducts = await manager.getAll();
            socketServer.emit('newProducts', { products: updatedProducts }); // Envia la actualización al cliente que la solicitó
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    })
    socket.on('message', async(newMessage) => {
        console.log(newMessage)
        await messagesManager.save(newMessage);
        const messages = await messagesManager.getAll();
        socketServer.emit('messages', messages);
    })
})