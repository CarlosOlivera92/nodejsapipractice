import ProductsRepository from "../repositories/products.repository.js";
import { Products, Users } from "../dao/factory.js";
import { Messages } from "../dao/factory.js";
import MessagesRepository from "../repositories/messages.repository.js";
import { Carts } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";
import UsersRepository from '../repositories/users.repository.js';
const cartsDao = new Carts();
const productsDao = new Products();
const messagesDao = new Messages()
const usersDao = new Users();
export default class ViewsController {
    constructor() {
        this.productsRepository = new ProductsRepository(productsDao);
        this.nessagesRepository = new MessagesRepository(messagesDao);
        this.cartsRepository = new CartsRepository(cartsDao);
        this.usersRepository = new UsersRepository(usersDao)
    }

    async login(req, res) {
        res.render('login');
    }

    async register(req, res) {
        res.render('register');
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productsRepository.getByQueries(req, res);
    
            const isAdmin = req.session.user && req.session.user.role === 'ADMIN';
            console.log(isAdmin)
            // Renderizar la vista, pasando los productos y la información sobre si el usuario es un administrador
            res.render('products', { layout: 'main', products, user: req.session.user, isAdmin });
        } catch (error) {
            // Manejar cualquier error que ocurra durante la obtención de los productos
            console.error('Error al obtener los productos:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
    

    async cart(req, res) {
        // Lógica para obtener y renderizar la información del carrito
        const cartId = new ObjectId(req.params.cid);
        const cart = await this.cartsRepository.getCartById(cartId);
        let products = []
        for (let i of cart.products) {
            products.push(i)
        }
        res.render('cart', {cart: products, user:req.session.user});
    }

    async chat(req, res) {
        const messages = await this.nessagesRepository.get();
        const isAdmin = req.session.user && req.session.user.role === 'ADMIN';
        res.render('chat', {messages: messages, user:req.session.user}, isAdmin);
    }

    async realtimeProducts(req, res) {
        const isAdmin = req.session.user && req.session.user.role === 'ADMIN';
        const products = await this.productsRepository.getByQueries(req, res);
        res.render('realtimeproducts', {products: products.payload, user:req.session.user, isAdmin});
    }

    async resetPassword (req, res) {
        const token = req.query.token;
        console.log(token)
        res.render('reset-password');
    }
    async getProductDetails(req, res) {
        // Lógica para obtener y renderizar los detalles del producto
        const productId = new ObjectId( req.params.productId );
        const productDetails = await this.productsRepository.getOne(productId);
        
        res.render("productdetails", { product: productDetails, user: req.session.user });
    }
    async getDashboard(req, res) {
        try {
            const users = await this.usersRepository.getAll();
            const sanitizedUsers = users.map(user => ({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                isChangeableRole: user.role !== 'ADMIN' // Cambiar a true si el rol no es ADMIN
            }));
            const isAdmin = req.session.user && req.session.user.role === 'ADMIN';

            res.render('dashboard', { users: sanitizedUsers, user: req.session.user, isAdmin });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}
