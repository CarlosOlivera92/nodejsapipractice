import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import TicketController from "../controllers/tickets.controller.js";
import Router from "./router.js"

export default class TicketsRouter extends Router {
    constructor() {
        super();
        this.ticketsController = new TicketController();
    }
    init() {
        this.post('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.ticketsController.purchase(req, res, next))
    }
}