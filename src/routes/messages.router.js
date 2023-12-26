import { Router } from "express";
const router = Router();

// Ruta para obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await messageManager.getAll();
        res.status(200).json({ status: "success", payload: messages });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para agregar un nuevo mensaje
router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        if (user && message) {
            const newMessage = {
                user: user,
                message: message,
            };
            await messageManager.save(newMessage);
            res.status(201).json({ status: "success", message: "Mensaje agregado exitosamente" });
        } else {
            res.status(400).json({ status: "error", message: "Los campos 'user' y 'message' son requeridos." });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error en el servidor: " + error.message });
    }
});

export default router;
