import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import AuthController from '../controllers/auth.controller.js';
import Router from './router.js';

export default class AuthRouter extends Router{
    constructor() {
        super();
        this.authController = new AuthController();
    }
    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.login(req, res, next));
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.register(req, res, next));
        this.get('/logout', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING,  (req, res, next) => this.authController.logout(req, res, next) )
        this.get('/mail', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.forgotPassword(req, res, next));
        this.post('/reset-password', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.resetPassword(req, res, next));
    }
    
}
