import { Router as expressRouter } from 'express';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, policies, strategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, strategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }
    put(path, policies, strategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }  
    delete(path, policies, strategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }
    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };

        res.sendSuccessNewResourse = (data) => {
            res.status(201).json({ data });
        };
        res.sendSuccessDeletion = (data) => {
            res.status(204).json( {data} )
        }
        res.sendServerError = (error) => {
            res.status(500).json( { error } )
        };

        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };

        next();
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            //custom passport call
            passport.authenticate(strategy, function (err, user, info) {
                if(err) return next(err);
                if (!user) {
                    return res.status(401).send({
                        error: info && info.messages ? info.messages : info ? info.toString() : 'Unauthorized'
                    });
                }
                req.user = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    }

    handlePolicies = (policies) => (req, res, next) => {
        // ['PUBLIC']
        if (policies[0] === accessRolesEnum.PUBLIC) return next();
        console.log("-------------------------------");
    
        const user = req.user;
        console.log(user.role);
        
        // Verificar si req.user existe y tiene la propiedad 'role'
        if (!user || !user.role || !(user.role === 'USER' || user.role === 'ADMIN' || user.role === 'PREMIUM')) {
            return res.status(403).json({ error: 'not permissions' });
        }
    
        next();
    };
    
    authorize = (roles) => (req, res, next) => {
        const user = req.user;
        console.log("User Role:", user.role);
        console.log("Allowed Roles:", roles);
        if (!user || !user.role || !roles.includes(user.role)) {
            console.log("Access Denied");
            return res.status(403).json({ error: 'Forbidden' });
        }
    
        next();
    };
    applyCallbacks(callbacks) {
        //mapear los callbacks 1 a 1, obteniedo sus parámetros (req, res)
        return callbacks.map((callback) => async (...params) => {
            try {
                // Verificar el tipo de callback aquí
                console.log(typeof callback); // Agregar esta línea para depurar
    
                //apply, va a ejecutar la función callback, a la instancia de nuestra clase que es el router
                await callback.apply(this, params);
            } catch (error) {
                params[1].status(500).json({ status: '500', message: error.message })
            }
        }) //[req, res]
    }
}