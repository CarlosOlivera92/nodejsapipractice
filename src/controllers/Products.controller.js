import ProductsRepository from "../repositories/products.repository.js";
import { Products } from "../dao/factory.js";
import { toPascalCase } from "../utils.js";
const productsDao = new Products();
export default class ProductsController {
    constructor() {
        this.productsRepository = new ProductsRepository(productsDao);
        this.getByQueries = this.getByQueries.bind(this);
        this.create = this.create.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.getAll = this.getAll.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }
    /*
    async getByQueries(req, res, next) {
        try {
            const { query, options } = req.params;
            console.log(req.query) 
            console.log("hola")
            const result = await this.productsRepository.getByQueries(query, options, req);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }*/
    async getByQueries(req, res, next) {
        try {

            const products = await this.productsRepository.getByQueries(req);
      
            res.status(200).send(products);
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
    async getAll(req, res, next) {
        try {
            const products = await this.productsRepository.getAll();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const productData = req.body; 

            const result = await this.productsRepository.save(productData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateOne(req, res, next) {
        try {
            const productId = req.params.id;
            const updatedProductData = req.body; 

            const updatedProduct = await this.productsRepository.updateOne(productId, updatedProductData);
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }
    async deleteOne(req, res) {
        try {
            const productId = req.params.id; // Obtiene el ID del producto de los parámetros de la solicitud
            const result = await this.productsRepository.deleteOne(productId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}