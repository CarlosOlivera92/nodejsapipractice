import { ProductsModel } from "./models/products.model.js";
export default class Products {
    constructor() {}
    //READ
    get = async() => {
        return await ProductsModel.find();
    }

    //CREATE
    create = async(product) => {
        return await ProductsModel.create(product);
    }

    //UPDATE
    modify = async(id, product) => {
        return await ProductsModel.findByIdAndUpdate(id, product);
    }

    //DELETE
    delete = async(id) => {
        return await ProductsModel.findByIdAndDelete(id);
    }
    //GET ONE
    getOne = async(options) => {
        return await ProductsModel.findOne(options);
    }
}