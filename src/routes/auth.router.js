import { UsersManager } from '../dao/dbManager/users.manager.js';
import passport from 'passport';
import { generateToken } from '../utils.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import Router from './router.js';

export default class AuthRouter extends Router{
    constructor() {
        super();
        this.usersManager = new UsersManager();
    }
    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register);
        this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.NOTHING, this.getAllUsers);
        this.get('/logout', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.logout)
    }
    async getAllUsers(req, res) {
        try {
            const users = await usersManager.getAll();
            return res.status(200).send({status: "success", data: users})
        } catch (error) {
            throw new Error( error );
        }
    }
    async login(req, res) {
        passport.authenticate('login', (err, user, info) => {
            if (err) {
                return res.status(500).send({ status: 'error', message: 'Error en el login' });
            }
            if (!user) {
                return res.status(401).send({ status: 'error', message: 'Credenciales inválidas' });
            }
            const generatedToken = generateToken(user);
            console.log(user)
            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role,
                jwtToken: generatedToken
            };
            return res.status(200).send({ status: 'success', token: generatedToken });
        })(req, res);
    }

    async register(req, res) {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                return res.status(500).send({ status: 'error', message: 'Error en el registro' });
            }
            if (!user) {
                return res.status(500).send({ status: 'error', message: 'Registro fallido' });
            }
            return res.status(201).send({ status: 'success', message: 'Usuario registrado' });
        })(req, res);
    }
    async logout(req, res) {
        req.session.destroy(error => {
            if(error) return res.status(500).send({ status: 'error', message: error.message });
            res.clearCookie('connect.sid');
            res.redirect('/login');
        })
    }
}
