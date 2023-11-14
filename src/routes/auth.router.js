import { Router } from 'express';
import { UsersManager } from '../dao/dbManager/users.manager.js';
import { hashPassword, comparePasswords } from '../bcryptUtils.js'; // Ajusta la ruta según tu estructura de carpetas

const usersManager = new UsersManager();

const router = Router();
router.get("/", async() => {
    try {
        return await usersManager.getAll();
    } catch (error) {
        throw new Error( error );
    }
})
router.post("/register", async(req,res) => {
    try {
        const {firstName, lastName, age, email, password} = req.body;
        console.log(req.body)

        if (!firstName || !lastName || !age || !email || !password) {
            throw new Error({error: "error", error})
        }
        const hashedPassword = await hashPassword(password);
        const options = {
            email: email
        };
        const userExists = await usersManager.getOne(options);
        if (userExists) {
            return res.status(400).send( {status: "error", message: `El usuario con el email ${email} ya existe en el sistema.`} )
        }

        const newUser = {
            first_name: firstName,
            last_name: lastName,
            email,
            age,
            role: "USER",
            password: hashedPassword
        }
        if (email === "adminCoder@coder.com") {
            newUser.role = "ADMIN"
        }
        const saveUser = await usersManager.saveOne(newUser);
        return res.status(201).send({status: "success", message: saveUser});
    } catch (error) {
        return res.status(500).send({ status: 'error', message: error.message })
    }
})
router.post("/login", async(req, res) => {
    console.log("Valor de req.session.user:", req.session);

    try {
        const {email, password} = req.body;
        const options = {
            email: email
        };

        const user = await usersManager.getOne(options)
        if (!user) {
            return res.status(400).json({ status: "error", message: "El usuario no existe" });
        }
        const match = await comparePasswords(password, user.password);
        if (!match) {
            return res.status(400).json({ status: "error", message: "Error, contraseña incorrecta" });
        }

        console.log(req.session.user)
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,

        };
        res.json({ status: 'success', message: 'Login Exitoso!' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
})
export default router;