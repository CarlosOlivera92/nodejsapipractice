// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { productsFilePath } from "../utils.js";
import { toPascalCase } from "../utils.js";
import { ObjectId } from "mongodb";
import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class ViewsRouter extends Router {
    constructor() {
        super();
        
    }
    init() {
        this.get('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.get('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register);
        this.get('/', [accessRolesEnum.ADMIN, accessRolesEnum.USER], passportStrategiesEnum.NOTHING, this.getAllProducts);
        this.get('/carts/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.USER], passportStrategiesEnum.NOTHING, this.cart);
        this.get('/chat', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.chat);
        this.get('/realtimeproducts', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.realtimeProducts);
        this.get("/products", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.products);
        this.get("/products/:productId", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.getProductDetails);

    }
    async login(req, res) {
        res.render('login');
    }
    async register(req, res) {
        res.render('register');
    }
    async getAllProducts(req, res) {
        console.log(req.session.user)
        const products = await this.productsManager.getAll();
        res.render('home', { layout:'main', products: products, user: req.session.user });
    }
    async cart(req, res) {
        const cartId = new ObjectId(req.params.cid);
        const cart = await this.cartsManager.getOne(cartId);
        let products = []
        for (let i of cart.products) {
            products.push(i)
        }
        res.render('cart', {cart: products, user:req.session.user});
    }
    async chat(req, res) {
        const messages = await this.messagesManager.getAll();
        res.render('chat', {messages: messages, user:req.session.user});
    }
    async realtimeProducts(req, res) {
        const products = await this.productsManager.getAll();
        res.render('realtimeproducts', {products: products, user:req.session.user});
    }
    async products(req, res) {
        let { limit, page, sort, query } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: " "
        };
        const filter = {};
    
        if (query) {
            query = toPascalCase(query)
            filter.$or = [];
        
            if (query.toLowerCase() !== 'true' && query.toLowerCase() !== 'false') {
                filter.$or.push({ category: query });
            }
        
            if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
                filter.$or.push({ status: query.toLowerCase() === 'true' });
            }
        } else {
            query = ' ';
        }
        if (sort === 'asc') {
            options.sort = { price: 1 }; 
            options.sort = { price: -1 }; 
        }
    
        const products = await this.productsManager.getByQueries(filter, options, req);
        console.log(req.session.user)
        res.render("products", {products: products, user: req.session.user})
    }
    async getProductDetails(req, res) {
        const productId = new ObjectId( req.params.productId );
        const productDetails = await this.productsManager.getOne(productId);
        res.render("productdetails", { product: productDetails, user: req.session.user });
    }
}