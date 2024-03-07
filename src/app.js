import express from "express";
import sessionsRouter from './routes/sessions.router.js';
import handlebars from 'express-handlebars';
import {__dirname, __mainDirname} from "./utils.js"; // Importa __dirname desde utils.js
import { Server } from "socket.io";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import errorHandler from './middlewares/errors/index.js';
import AuthRouter from './routes/auth.router.js';
import ViewsRouter from "./routes/views.router.js";
import CartsRouter from "./routes/carts.router.js";
import ProductsRouter from "./routes/products.router.js";
import MessagesRouter from "./routes/messages.router.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";
import cookieParser from 'cookie-parser';
import MessagesRepository from "./repositories/messages.repository.js";
import { Messages } from "./dao/factory.js";
import { Products } from "./dao/factory.js";
import ProductsRepository from "./repositories/products.repository.js";
import { MocksRouter } from "./routes/mocks.js";
import { addLogger } from "./logger.js";
import LoggerRouter from "./routes/loggers.router.js";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import UsersRouter from "./routes/users.router.js";

const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);
const port = 8080;
const app = express();

const loggerRouter = new LoggerRouter();
const authRouter = new AuthRouter();
const viewsRouter = new ViewsRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();
const messagesRouter = new MessagesRouter();
const mocksRouter = new MocksRouter();
const messagesDao = new Messages();
const usersRouter = new UsersRouter();

const messagesRepository = new MessagesRepository(messagesDao);
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
// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto de adopción de mascotas clase 39',
            description: 'API pensada en resolver el proceso de adopción de mascotas.'
        }
    },
    apis: [`${__mainDirname}/nodejsapipractice/docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// Cookie Parser 
app.use(cookieParser());

//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Logger
app.use(addLogger);

//Routes
app.use('/api/chat', messagesRouter.getRouter());
app.use('/api/auth', authRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter.getRouter());
app.use('/api/logger', loggerRouter.getRouter());
app.use('/', viewsRouter.getRouter());
app.use(errorHandler);

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
            productsRepository.save(productData);
            const addedProducts = await productsRepository.getAll();
            socketServer.emit('newProducts', { products: addedProducts }); // Envia la actualización al cliente que la solicitó
        } catch (error) {
                console.error('Error al agregar el producto:', error);
            }
        });
    socket.on('delProduct', async(productId) => {
        try {
            const id = new ObjectId(productId);
            productsRepository.deleteOne(id);
            const updatedProducts = await productsRepository.getAll();
            console.log(updatedProducts)
            socketServer.emit('newProducts', { products: updatedProducts }); // Envia la actualización al cliente que la solicitó
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    })
    socket.on('message', async(newMessage) => {
        console.log(newMessage)
        await messagesRepository.save(newMessage);
        const messages = await messagesRepository.get();
        socketServer.emit('messages', messages);
    })
    // Evento para actualizar el rol de usuario
    socket.on('updateUserRole', async ({ userId, newRole }) => {
        try {
            // Lógica para actualizar el rol de usuario en la base de datos
            const updatedUser = await usersRepository.updateRole(userId, newRole);
            socketServer.emit('userRoleUpdated', updatedUser); // Envia la actualización a todos los clientes conectados
        } catch (error) {
            console.error('Error al actualizar el rol de usuario:', error);
        }
    });

    // Evento para eliminar un usuario
    socket.on('deleteUser', async (userId) => {
        try {
            // Lógica para eliminar un usuario de la base de datos
            await usersRepository.delete(userId);
            socketServer.emit('userDeleted', userId); // Envia la actualización a todos los clientes conectados
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    });

})