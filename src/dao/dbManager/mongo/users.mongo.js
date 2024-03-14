import { UsersModel } from "./models/users.model.js"; 
export default class Users {
    constructor() {}
    //READ
    get = async() => {
        return await UsersModel.find();
    }

    //CREATE
    create = async(user) => {
        return await UsersModel.create(user);
    }

    //UPDATE
    modify = async(id, user) => {
        return await UsersModel.findByIdAndUpdate(id, user);
    }

    //DELETE
    delete = async(id) => {
        return await UsersModel.findByIdAndDelete(id);
    }
    //GET ONE
    getOne = async(options) => {
        const filter = typeof options === 'string' ? { _id: options } : options;
        return await UsersModel.findOne(filter);
    }
}