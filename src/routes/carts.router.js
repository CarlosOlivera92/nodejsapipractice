import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import CartsController from "../controllers/carts.controller.js";
export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartsController = new CartsController();
    }
    init() {
        this.get("/",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.getAll(req, res, next));
        this.get("/:cid",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.getOne(req, res, next));
        this.post("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.create(req, res, next));
        this.put("/:cid/products/:pid",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.updateProducts(req, res, next));
        this.delete("/:cid/products/:pid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING,(req, res, next) => this.cartsController.deleteProduct(req, res, next));
        this.put("/:cid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.update(req, res, next));
        this.delete("/:cid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.deleteAll(req, res, next));
    }
}
