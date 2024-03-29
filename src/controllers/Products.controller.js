import ProductsRepository from "../repositories/products.repository.js";
import { transporter } from '../utils.js';
import { Products, Users } from "../dao/factory.js";
import MockedProducts from "../mocks/products.mocks.js";
import CustomError from "../middlewares/errors/CustomError.js";
import EErrors from "../middlewares/errors/enums.js";
import { accessRolesEnum } from "../config/enums.js";
import { ObjectId } from "mongodb";
import UsersRepository from "../repositories/users.repository.js";
const productsDao = new Products();
const usersDao = new Users()
export default class ProductsController {
    constructor() {
        this.productsRepository = new ProductsRepository(productsDao);
        this.usersRepository = new UsersRepository(usersDao);
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
            const result = await this.productsRepository.save(productData);
            res.status(201).json(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateOne(req, res, next) {
        try {
            const {pid} = req.params;
            const productId = new ObjectId(pid);
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
            if (!updatedProductData) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'One or more properties are empty',
                    message: 'Cannot update the selected product',
                    code: EErrors.UPDATING_PRODUCT_ERROR
                })
            }
            // Verificar si el usuario es premium y el producto le pertenece
            if (req.user.role === accessRolesEnum.PREMIUM && product.owner !== req.user.email) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'Permission denied',
                    message: 'Premium users can only update their own products',
                    code: EErrors.PERMISSION_DENIED
                });
            }
            const updatedProduct = await this.productsRepository.updateOne(productId, updatedProductData);
            console.log(updatedProduct)
            res.status(204).send("Product updated successfuly")
        } catch (error) {
            next(error);
        }
    }
    async deleteOne(req, res) {
        try {
            const {pid} = req.params;
            const productId = new ObjectId(pid);
            const product = await this.productsRepository.getOne(productId);
            console.log(product)
            if (!product) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'Product doesnt exist',
                    message: 'Cannot remove the product, make sure the product exist before deleting',
                    code: EErrors.CREATE_PRODUCT_ERROR
                })
            }
             // Verificar si el usuario es premium y el producto le pertenece
            if (req.user.role === accessRolesEnum.PREMIUM && product.owner !== req.user.email) {
                throw CustomError.createError({
                    name: 'error',
                    cause: 'Permission denied',
                    message: 'Premium users can only delete their own products',
                    code: EErrors.PERMISSION_DENIED
                });
            }
            const productOwnerEmail = product.owner;
            const productOwner = await this.usersRepository.getOne( {email: productOwnerEmail});
            console.log(productOwner);
            await this.productsRepository.deleteOne(productId);
            // Envía un correo electrónico si el usuario es premium
            if (productOwner.role === 'PREMIUM') {
                transporter.sendMail({
                    from: 'GoodGame Workshop',
                    to: productOwner.email,
                    subject: 'Producto eliminado',
                    html: `
                        <!DOCTYPE html>
                        <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Recuperacion de contraseña</title>
                            </head>
                            <body>
                                <p>¡Hola ${productOwner.name}!</p>
                                <p>Recibiste este correo porque se ha eliminado un producto que te pertenecía</p>
                                <p>Nombre: ${product.title}</p>
                            </body>
                        </html>
                    `
                });
            }

            res.status(204).send({ status: 'success', message: "Product deleted successfully!" })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async mockingProducts(req, res) {
        const mockedProducts = MockedProducts.generateMockProducts();
        res.status(200).json(mockedProducts);
    }
}