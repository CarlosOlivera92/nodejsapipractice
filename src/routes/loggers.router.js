import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import LoggerController from "../controllers/logger.controller.js";
import Router from "./router.js";

export default class LoggerRouter extends Router {
    constructor() {
        super();
        this.loggerController = new LoggerController();
    }
    init() {
        this.get("/loggerTest", [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.loggerController.loggerTest(req, res, next));
    }
}