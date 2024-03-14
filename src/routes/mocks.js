import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import ProductsController from "../controllers/Products.controller.js";
import Router from "./router.js";

export class MocksRouter extends Router {
    constructor() {
        super();
        this.productsController = new ProductsController();
    }
    init() {
        this.get('/mockingproducts', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.productsController.mockingProducts(req, res, next));
    }
}