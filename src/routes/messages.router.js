import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import MessagesController from "../controllers/messages.controller.js";
import Router from "./router.js";

export default class MessagesRouter extends Router {
    constructor() {
        super();
        this.messagesController = new MessagesController();
    }
    init() {
        this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, (req, res, next) => this.messagesController.get(req, res, next));
        this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, (req, res, next) => this.messagesController.save(req, res, next));
    }
}

