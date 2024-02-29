import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import AuthController from '../controllers/auth.controller.js';
import Router from './router.js';

export default class UsersRouter extends Router{
    constructor() {
        super();
        this.authController = new AuthController();
    }
    init() {
        this.post('/premium/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.getPremium(req, res, next));
    }
    
}
