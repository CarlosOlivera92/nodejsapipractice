import ProductsRepository from "../repositories/products.repository.js";
import { Products } from "../dao/factory.js";
import { Messages } from "../dao/factory.js";
import MessagesRepository from "../repositories/messages.repository.js";
import { Carts } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";

const cartsDao = new Carts;
const productsDao = new Products();
const messagesDao = new Messages()
export default class ViewsController {
    constructor() {
        this.productsRepository = new ProductsRepository(productsDao);
        this.nessagesRepository = new MessagesRepository(messagesDao);
        this.cartsRepository = new CartsRepository(cartsDao);
    }

    async login(req, res) {
        res.render('login');
    }

    async register(req, res) {
        res.render('register');
    }

    async getAllProducts(req, res) {
        const products = await this.productsRepository.getByQueries(req, res);
        console.log(products)
        res.render('products', { layout:'main', products: products, user: req.session.user });
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
        res.render('chat', {messages: messages, user:req.session.user});
    }

    async realtimeProducts(req, res) {
        const products = await this.productsRepository.getByQueries(req, res);
        res.render('realtimeproducts', {products: products.payload, user:req.session.user});
    }


    async getProductDetails(req, res) {
        // Lógica para obtener y renderizar los detalles del producto
        const productId = new ObjectId( req.params.productId );
        const productDetails = await this.productsRepository.getOne(productId);
        res.render("productdetails", { product: productDetails, user: req.session.user });
    }
}
