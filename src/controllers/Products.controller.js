import ProductsRepository from "../repositories/products.repository.js";
import { toPascalCase } from "../utils.js";
import { Products } from "../dao/factory.js";
import MockedProducts from "../mocks/products.mocks.js";
import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";

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
            const {title, description, price, thumbnail, category, code, status} = productData;
            if (!title || !description || !price || !thumbnail || !category || !code || !status) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'One or more properties are missing',
                    message: 'Cannot create the product',
                    code: EErrors.CREATE_PRODUCT_ERROR
                })
            };
            productData.owner = req.user.email;
            console.log(productData)
            const result = await this.productsRepository.save(productData);
            res.status(201).json(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateOne(req, res, next) {
        try {
            const productId = req.params.id;
            const product = await this.productsRepository.getOne(productId);
            const updatedProductData = req.body; 
            if(!product) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'Cannot find the product',
                    message: 'Cannot find the product in the database, make sure the ID its valid',
                    code: EErrors.PRODUCT_NOT_FOUND
                })
            }
            if (!title || !description || !price || !thumbnail || !category || !code || !status) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'One or more properties are empty',
                    message: 'Cannot update the selected product',
                    code: EErrors.UPDATING_PRODUCT_ERROR
                })
            }
            const updatedProduct = await this.productsRepository.updateOne(productId, updatedProductData);
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }
    async deleteOne(req, res) {
        try {
            const productId = req.params.id; 
            const result = await this.productsRepository.deleteOne(productId);
            if (!result) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'Product doesnt exist',
                    message: 'Cannot remove the product, make sure the product exist before deleting',
                    code: EErrors.CREATE_PRODUCT_ERROR
                })
            }
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async mockingProducts(req, res) {
        const mockedProducts = MockedProducts.generateMockProducts();
        res.status(200).json(mockedProducts);
    }
}