import { Router } from 'express';
import { UsersManager } from '../dao/dbManager/users.manager.js';
import { hashPassword, comparePasswords } from '../bcryptUtils.js'; // Ajusta la ruta según tu estructura de carpetas
import passport from 'passport';

const usersManager = new UsersManager();

const router = Router();
router.get("/", async() => {
    try {
        return await usersManager.getAll();
    } catch (error) {
        throw new Error( error );
    }
})
router.post("/register", passport.authenticate('register', { failureRedirect: 'fail-register' }), async(req, res) => {
    res.status(201).send( {status: 'success', message: 'Usuario registrado'})
})
router.get('/fail-register', async(req, res) => {
    res.status(500).send( {status: 'error', message: 'registro fallido'} );
})
router.post("/login", passport.authenticate('login', {failureRedirect: 'fail-login'}) , async(req, res) => {
    if (!req.user) {
        return res.status(401).send( {status: 'error', message: 'invalid credentials'} )
    } else {
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        return res.status(200).send( {status: 'success', message: 'login successfuly'} )
    }
});
router.get('/fail-login', async(req, res) => {
    res.status(500).send( {status: 'error', message: 'login fallido'} );
})
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
})
export default router;