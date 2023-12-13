import passport from "passport";
import local from 'passport-local';
import { hashPassword, comparePasswords } from "../bcryptUtils.js"; 
import GithubStrategy from 'passport-github';

import jwt from 'passport-jwt';
import { passportStrategiesEnum } from "./enums.js";
import config from "./config.js";
import UsersRepository from "../repositories/users.repository.js";
import { Users } from "../dao/factory.js";

const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const LocalStrategy = local.Strategy;

const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);

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

            // Verificar si el usuario ya existe en la base de datos
            const userExists = await usersRepository.getOne(options);

            // Si el usuario ya existe, devolver un error
            if (userExists) {
                return done(null, false, { message: 'User already exists' });
            }
            const userToSave = {
                first_name: firstName,
                last_name: lastName,
                age,
                email: username,
                role: "USER",
                password: await hashPassword(password)
            }
            if (username === "adminCoder@coder.com") {
                userToSave.role = "ADMIN"
            }
            const result = await usersRepository.create(userToSave);
            return done(null, result);
        } catch ( error ) {
            return done(error);
        }
    }));
    passport.use('login', new LocalStrategy( {
        usernameField: 'email'
    }, async(username, password, done) => {
        console.log("runing")
        try {
            const options = {
                email: username
            };
            const user = await usersRepository.getOne( options )
            const match = await comparePasswords(password, user.password);

            if (!user || !match) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    passport.use('github', new GithubStrategy( {
        clientID:'Iv1.533d45cc3cdf1377',
        clientSecret: 'ca405ba7b5462f2e314de5cd6d4317c8c1547a15',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback'
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const options = {
                email: profile._json.email
            };
            const user = await usersManager.getOne( options );
            if (!user) {
                console.log(profile._json)
                let newUser = {
                    first_name:profile._json.name,
                    lastName: '',
                    age: 18,
                    email: profile._json.email,
                    role: "USER",
                    password: ''
                };
                let result = await usersManager.saveOne(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
    passport.use(passportStrategiesEnum.JWT, new JWTSrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.privateKey
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)//req.user
        } catch (error) {
            return done(error);
        }
    }));
    passport.use('current', new JWTSrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([
            ExtractJWT.fromAuthHeaderAsBearerToken(),
            (req) => {
                let token = null;

                if (req && req.cookies) {
                    token = req.cookies.jwtToken;
                }
                return token;
            }
        ]),
        secretOrKey: config.privateKey
    }, async (jwt_payload, done) => {
        try {

            // Aquí puedes obtener el usuario asociado al token JWT en la cookie
            const user = await usersManager.getOne(jwt_payload.user_id); 
            if (!user) {
                return done(null, false);
            }
            return done(null, user); 
        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser( (user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser( async(id, done) => {
        const user = await usersManager.findById(id);
        done(null, user);
    })

}
export {initializePassport};