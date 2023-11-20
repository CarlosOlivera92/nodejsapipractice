import passport from "passport";
import local from 'passport-local';
import { hashPassword, comparePasswords } from "../bcryptUtils.js"; 
import { UsersManager } from '../dao/dbManager/users.manager.js';

const LocalStrategy = local.Strategy;
const usersManager = new UsersManager();

const initializePassport = () => {
    passport.use('register', new LocalStrategy( {
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        try {
            const {firstName, lastName, age} = req.body;
            const options = {
                email: username
            };
            const userExists = await usersManager.getOne(options);
            if (userExists) {
                return res.status(400).send( {status: "error", message: `El usuario con el email ${email} ya existe en el sistema.`} )
            }
            const userToSave = {
                firstName,
                lastName,
                age,
                email: username,
                role: "USER",
                password: await hashPassword(password)
            }
            if (username === "adminCoder@coder.com") {
                newUser.role = "ADMIN"
            }
            const result = await usersManager.saveOne(userToSave);
            return done(null, result);
        } catch ( error ) {
            return done(error);
        }
    }));
    passport.use('login', new LocalStrategy( {
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const options = {
                email: username
            };
            const user = await usersManager.getOne( options )
            const match = await comparePasswords(password, user.password);

            if (!user || !match) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    } ))
    passport.serializeUser( (user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser( async(id, done) => {
        const user = await usersManager.findById(id);
        done(null, user);
    })

}
export {initializePassport};