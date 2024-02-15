import ProductsController from "../controllers/Products.controller.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
    this.productsController = new ProductsController();
  } 
  init() {
    this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.productsController.getByQueries(req, res, next));
    this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, this.authorize(["ADMIN", "PREMIUM"]), (req, res, next) => this.productsController.create(req, res, next));
    this.put('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, this.authorize(["ADMIN", "PREMIUM"]), (req, res, next) => this.productsController.updateOne(req,res,next));
    this.delete('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, this.authorize(["ADMIN", "PREMIUM"]), (req, res, next) => this.productsController.deleteOne(req, res, next));
  }
}
