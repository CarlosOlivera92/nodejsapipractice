import { ProductsModel } from "./models/products.model.js";
import mongoosePaginate from 'mongoose-paginate-v2';

export default class Products {
    constructor() {
        mongoosePaginate.paginate.options = {
            limit: 10,
            page: 1, 
        }
    };
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
    getPaginated = async(query, options) => {
        try {
            console.log(query);
            console.log(options);
            const result = await ProductsModel.paginate(query, options);
            return result;
        } catch (error) {
            throw new Error('Error al obtener productos paginados: ' + error);
        }
    }
    findOneAndUpdate = async (query, updateData, options) => {
        try {
            const updatedProduct = await ProductsModel.findOneAndUpdate(query, updateData, options);
            return updatedProduct;
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error);
        }
    }
    findOneAndRemove = async (query) => {
        try {
            const removedProduct = await ProductsModel.findOneAndRemove(query);
            return removedProduct;
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error);
        }
    }
}