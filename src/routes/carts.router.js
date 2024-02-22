import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import CartsController from "../controllers/carts.controller.js";
import TicketController from '../controllers/tickets.controller.js';
export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartsController = new CartsController();
        this.ticketController = new TicketController();
    }
    init() {
        this.get("/",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.getAll(req, res, next));
        this.get("/:cid",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.getCartById(req, res, next));
        this.post("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.authorize("USER"), (req, res, next) => this.cartsController.createCart(req, res, next));
        this.put("/:cid/products/:pid",[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.updateProducts(req, res, next));
        this.delete("/:cid/products/:pid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING,(req, res, next) => this.cartsController.deleteProduct(req, res, next));
        this.put("/:cid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.update(req, res, next));
        this.delete("/:cid", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.cartsController.deleteCart(req, res, next));
        this.post('/:cid/purchase', [accessRolesEnum.USER], passportStrategiesEnum.JWT,this.authorize("USER") ,(req, res, next) => this.ticketController.purchase(req, res, next));
    }
}
