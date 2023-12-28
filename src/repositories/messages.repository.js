import { MessagesModel } from "../dao/dbManager/mongo/models/messages.model.js";

export default class MessagesRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async get() {
        try {
            const messages = await this.dao.get();
            return messages;
        } catch (error) {
            throw new Error('Error al obtener los mensajes: ' + error.message);
        }
    }

    async save(newMessage) {
        try {
            console.log(newMessage)
            const message = new MessagesModel({
                user: newMessage.user,
                message: newMessage.message,
                timestamp: new Date(),
            });
            await this.dao.create(message);
            return message;
        } catch (error) {
            throw new Error('Error al guardar el mensaje: ' + error.message);
        }
    }

}
