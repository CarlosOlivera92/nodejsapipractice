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
        this.get('/carts/:cid', [accessRolesEnum.ADMIN, accessRolesEnum.USER], passportStrategiesEnum.NOTHING, (req, res, next) => this.viewsController.cart(req, res, next));
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
        this.get("/reset-password", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.viewsController.resetPassword(req, res, next));

    }
}