import Messages from "../dao/dbManager/mongo/messages.mongo.js";
import MessagesRepository from "../repositories/messages.repository.js";
const messagesDao = new Messages();
export default class MessagesController {
    constructor() {
        this.messagesRepository = new MessagesRepository(messagesDao);
        this.get = this.get.bind(this);
        this.save = this.save.bind(this);
    }
    async get(req, res) {
        const messages = this.messagesRepository.get();
        res.status(200).send({status: 'success',message: messages });
    }
    async save(req, res) {
        try {
            const { message } = req.body;
            const user = req;
            if (user && message) {
                const newMessage = {
                    user: user.first_name,
                    message: message,
                };
                await messagesRepository.save(newMessage);
                res.status(201).json({ status: "success", message: "Mensaje agregado exitosamente" });
            } else {
                res.status(400).json({ status: "error", message: "Los campos 'user' y 'message' son requeridos." });
            }
        } catch (error) {
            res.status(500).json({ status: "error", message: "Error en el servidor: " + error.message });
        }
    }
}