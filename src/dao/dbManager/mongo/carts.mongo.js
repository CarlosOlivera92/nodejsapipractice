import { CartsModel } from "./models/carts.model.js";
export default class Carts {
    constructor() {}
    //READ
    get = async() => {
        return await CartsModel.find();
    }

    //CREATE
    create = async(cart) => {
        return await CartsModel.create(cart);
    }

    //UPDATE
    modify = async(id, cart) => {
        return await CartsModel.findByIdAndUpdate(id, cart);
    }

    //DELETE
    delete = async(id) => {
        return await CartsModel.findByIdAndDelete(id);
    }
    //GET ONE
    getOne = async(options) => {
        return await CartsModel.findOne(options).populate('products.productId');
    }
}