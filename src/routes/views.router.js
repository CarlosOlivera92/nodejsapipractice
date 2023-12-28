import { ObjectId } from "mongodb";
import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import ViewsController from "../controllers/views.controller.js";
import ProductsController from "../controllers/Products.controller.js";
import passport from "passport";
export default class ViewsRouter extends Router {
    constructor() {
        super();
        this.viewsController = new ViewsController();
        this.productsController = new ProductsController();
    }
    init() {
        this.get('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.viewsController.login(req, res, next));
        this.get('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.viewsController.register(req, res, next));
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.productsController.getByQueries(req, res, next));
        this.get('/carts/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.USER], passportStrategiesEnum.NOTHING, this.cart);
        this.get(
            '/chat',
            [accessRolesEnum.USER],
            passportStrategiesEnum.JWT, 
            this.authorize("USER"),
            (req, res, next) => this.viewsController.chat(req, res, next) 
        );
        this.get('/realtimeproducts', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.authorize("ADMIN") , (req, res, next) => this.viewsController.realtimeProducts(req, res, next));
        this.get("/products", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.viewsController.getAllProducts(req, res, next));
        this.get("/products/:productId", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.getProductDetails);

    }
    async getAllProducts(req, res) {
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

    async getProductDetails(req, res) {
        const productId = new ObjectId( req.params.productId );
        const productDetails = await this.productsManager.getOne(productId);
        res.render("productdetails", { product: productDetails, user: req.session.user });
    }
}