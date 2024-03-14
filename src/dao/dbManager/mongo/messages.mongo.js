import { MessagesModel } from './models/messages.model.js';
import mongoosePaginate from 'mongoose-paginate-v2';

export default class Messages {
    constructor() {
        mongoosePaginate.paginate.options = {
            limit: 10,
            page: 1, 
        }
    };
    //READ
    get = async() => {
        return await MessagesModel.find().lean();
    }

    //CREATE
    create = async(product) => {
        return await MessagesModel.create(product);
    }

    //UPDATE
    modify = async(id, product) => {
        return await MessagesModel.findByIdAndUpdate(id, product);
    }

    //DELETE
    delete = async(id) => {
        return await MessagesModel.findByIdAndDelete(id);
    }
    //GET ONE
    getOne = async(options) => {
        return await MessagesModel.findOne(options);
    }
    getPaginated = async(query, options) => {
        try {
            const result = await MessagesModel.paginate(query, options);
            return result;
        } catch (error) {
            throw new Error('Error al obtener mensajes paginados: ' + error);
        }
    }
    findOneAndRemove = async (query) => {
        try {
            const removedMessage = await MessagesModel.findOneAndRemove(query);
            return removedMessage;
        } catch (error) {
            throw new Error('Error al eliminar el mensaje: ' + error);
        }
    }
}