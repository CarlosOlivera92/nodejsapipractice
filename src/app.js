import express from "express";
import sessionsRouter from './routes/sessions.router.js';
import handlebars from 'express-handlebars';
import {__dirname} from "./utils.js"; // Importa __dirname desde utils.js
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
import { transporter } from "./utils.js";
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
// Configuración de nodemailer

// Cookie Parser 
app.use(cookieParser());

//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Logger

app.use(addLogger);
app.get('/mail', async(req, res) => {
    await transporter.sendMail({
        from: 'Coderhouse 55575',
        to: 'thestuntman92@gmail.com',
        subject: 'Correo de prueba 55575',
        html: `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Orden de Compra</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 20px;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
        
                h1 {
                    color: #2c3e50;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: #fff;
                }
        
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
        
                th {
                    background-color: #3498db;
                    color: #fff;
                }
        
                tr:nth-child(even) {
                    background-color: #ecf0f1;
                }
        
                .total {
                    font-weight: bold;
                    font-size: 18px;
                    color: #e74c3c;
                }
            </style>
        </head>
        <body>
            <h1>Orden de Compra</h1>
        
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Producto 1</td>
                        <td>2</td>
                        <td>$10.00</td>
                        <td>$20.00</td>
                    </tr>
                    <tr>
                        <td>Producto 2</td>
                        <td>1</td>
                        <td>$15.00</td>
                        <td>$15.00</td>
                    </tr>
                    <!-- Puedes agregar más filas según sea necesario -->
                </tbody>
            </table>
        
            <p class="total">Total: $35.00</p>
        </body>
        </html>`,
        // attachments: [{
        //     filename: 'dog.jpeg',
        //     path: './dog.jpeg',
        //     cid: 'dog'
        // }]
    })

    res.send('Correo enviado');
});
//Routes
app.use('/api/chat', messagesRouter.getRouter());
app.use('/api/auth', authRouter.getRouter());

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
})