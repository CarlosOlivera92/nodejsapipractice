import passport from 'passport';
import { generateToken } from '../utils.js';
import UsersRepository from '../repositories/users.repository.js';
import { Users } from '../dao/factory.js';
import CustomError from '../middlewares/errors/CustomError.js';
import EErrors from '../middlewares/errors/enums.js';
import { readFileSync } from 'fs';
import { __dirname } from '../utils.js';
import { transporter } from '../utils.js';

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
            const options = {
                email: req.body.email
            }
            const user = await this.usersRepository.getOne(options);

            if (!user) {
                return res.status(404).send({ status: 'error', message: 'User not found' });
            }

            const resetToken = generateToken(user);
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
            await this.usersRepository.update(user.id, user);

            transporter.sendMail({
                from: 'GoodGame Workshop',
                to: req.body.email,
                subject: 'Recuperacion de contrasenia',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Recuperacion de contraseña</title>
                        </head>
                        <body>
                            <p>¡Hola ${user.name}</p>
                            <p>Recibiste este correo porque solicitaste restablecer tu contraseña en nuestro sitio web.</p>
                            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                            <a href="http://localhost:8080/reset-password?token=${resetToken}">Restablecer Contraseña</a>
                            <p>Si no solicitaste este restablecimiento, puedes ignorar este correo y tu contraseña permanecerá sin cambios.</p>
                        </body>
                    </html>
                `
            });
            res.status(200).send({ status: 'success', message: 'Correo de recuperación enviado' });
        }
        catch (error) {
            throw new Error( error );
        }
    }
    async resetPassword(req, res) {
        try {

        } catch (error) {

        }
    }
}

export default AuthController;