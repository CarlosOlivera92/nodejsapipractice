
class MessagesManager {
    constructor() {}

    async getAll() {
        try {
            const messages = await MessagesModel.find().lean();
            return messages;
        } catch (error) {
            throw new Error('Error al obtener los mensajes: ' + error.message);
        }
    }

    async save(newMessage) {
        try {
            const message = new MessagesModel({
                user: newMessage.user,
                message: newMessage.message,
                timestamp: new Date(),
            });
            await MessagesModel.create(message);
            return message;
        } catch (error) {
            throw new Error('Error al guardar el mensaje: ' + error.message);
        }
    }
}

