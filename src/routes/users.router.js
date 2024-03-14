import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import AuthController from '../controllers/auth.controller.js';
import UsersController from '../controllers/users.controller.js';
import Router from './router.js';

export default class UsersRouter extends Router{
    constructor() {
        super();
        this.authController = new AuthController();
        this.usersController = new UsersController();
    }
    init() {
        this.get('/',[accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.getAllUsers(req, res, next));
        this.post('/:uid/documents', [accessRolesEnum.USER], passportStrategiesEnum.JWT, (req, res, next) => this.usersController.uploadDocuments(req, res, next));
        this.post('/premium/:uid', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.authController.getPremium(req, res, next));
        this.delete('/deleteInactive', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.usersController.deleteInactive(req, res, next))
        this.delete('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, this.authorize("ADMIN"), (req, res, next) => this.usersController.deleteUser(req, res, next));
    }
    
}
