import passport from 'passport';
import { generateToken } from '../utils.js';
import UsersRepository from '../repositories/users.repository.js';
import { Users } from '../dao/factory.js';
import CustomError from '../middlewares/errors/CustomError.js';
import EErrors from '../middlewares/errors/enums.js';
import { readFileSync } from 'fs';
import { __dirname } from '../utils.js';
import { transporter } from '../utils.js';
const emailContent = readFileSync(`${__dirname}/public/static/mail.html`);
const cssContent = readFileSync(`${__dirname}/public/css/email.css`);

const usersDao = new Users();
class AuthController {
    constructor() {
        this.usersRepository = new UsersRepository(usersDao);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.usersRepository.getAll();
            return res.status(200).send({status: "success", data: users})
        } catch (error) {
            throw new Error( error );
        }
    }
    async login(req, res) {
        passport.authenticate('login', (err, user, info) => {
            if (!user) {
                req.logger.error("error occoured during log in")
                throw CustomError.createError({
                    name: 'UserError',
                    cause: 'User not in database',
                    message: 'Error trying to log in, invalid credentials',
                    code: EErrors.USER_NOT_FOUND
                })
            }
            if (err) {
                req.logger.fatal("fatal error during login")
                throw CustomError.createError({
                    name: 'Fatal error',
                    cause: err,
                    message: err.message,
                    code: EErrors.INTERNAL_SERVER_ERROR
                })
            }
            
            const generatedToken = generateToken(user);
            res.cookie('jwtToken', generatedToken, { httpOnly: true }); // Aquí configuras las opciones de la cookie según tu necesidad
            req.session.user = {
                name: user.name,
                email: user.email,
                age: user.age,
                role: user.role,
                jwtToken: generatedToken
            };
            req.logger.info("test info logger");
            return res.status(200).send({ status: 'success', token: generatedToken });
        })(req, res);
    }

    async register(req, res) {
        passport.authenticate('register', (err, user, info) => {
            console.log(err)
            if (err) {
                console.log(err.message)
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
            res.clearCookie('jwtToken');
            res.redirect('/login');
        })
    }
    async forgotPassword (req, res) {
        try {
            const user = await this.usersRepository.getOne(req.body.email);
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }
            transporter.sendMail({
                from: 'Coderhouse 55575',
                to: req.body.email,
                subject: 'Recuperacion de contrasenia',
                html: `${emailContent}?token=aaaaa-aaaaaa`
            });
            res.send("Correo Enviado");
        }
        catch (error) {
            throw new Error( error );
        }
    }
}

export default AuthController;