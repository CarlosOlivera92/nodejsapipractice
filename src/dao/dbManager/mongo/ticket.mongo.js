import { TicketModel } from "./models/ticket.model.js";
export default class Tickets {
    constructor() {}
    //READ
    get = async() => {
        return await TicketModel.find();
    }

    //CREATE
    create = async(ticket) => {
        return await TicketModel.create(ticket);
    }

    //UPDATE
    modify = async(id, ticket) => {
        return await TicketModel.findByIdAndUpdate(id, ticket);
    }

    //DELETE
    delete = async(id) => {
        return await TicketModel.findByIdAndDelete(id);
    }
    //GET ONE
    getOne = async(options) => {
        return await TicketModel.findOne(options);
    }
}