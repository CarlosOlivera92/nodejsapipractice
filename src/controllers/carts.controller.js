import { Carts, Users } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";

import ProductsRepository from "../repositories/products.repository.js";
import { Products } from "../dao/factory.js";
import { ObjectId } from "mongodb";
import UsersRepository from "../repositories/users.repository.js";

const usersDao = new Users()
const cartsDao = new Carts;
const productsDao = new Products();

export default class CartsController {
    constructor() {
        this.cartsRepository = new CartsRepository(cartsDao);
        this.productsRepository = new ProductsRepository(productsDao);
        this.usersRepository = new UsersRepository(usersDao);
        this.getAll = this.getAll.bind(this);
        this.getCartById = this.getCartById.bind(this);
        this.deleteCart = this.deleteCart.bind(this);
    }
    async getAll(req, res) {
        try {
            const carts = await this.cartsRepository.getCarts();
            res.status(200).send(carts);
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
        }
    }
    async createCart(req, res) {
        try {
            const { productId, cartId } = req.body;
            const userId = req.user.id;
            const id = new ObjectId(productId)
            const product = await this.productsRepository.getOne(id);
            if (product === "Producto no encontrado") {
                return res.status(404).send("No se ha podido encontrar el producto especificado.");
            }
    
            if (!cartId) {
                const productInCart = {
                    productId: product._id,
                    quantity: 1,
                };
                const newCart = {
                    products: [productInCart],
                };
    
                const createdCart = await this.cartsRepository.createCart(newCart);
                const createdCartId = createdCart._id;
    
                // Actualizar el usuario con el nuevo carrito
                const updatedUser = await this.usersRepository.update(userId, { cart: createdCartId });
    
                return res.status(201).send({
                    message: `Se ha creado un nuevo carrito con ID: ${createdCartId} y se ha agregado el producto.`,
                    data: { cart: createdCart, user: updatedUser },
                });
            }
    
            // El cartId no es null, procedemos con el resto del código original...
            const existingCart = await this.cartsRepository.getCartById(new ObjectId(cartId));
    
            if (!existingCart) {
                return res.status(404).send('El carrito especificado no se encontró.');
            }
    
            existingCart.products.push({
                productId: product._id,
                quantity: 1,
            });
    
            const updatedUser = await this.usersRepository.update(userId, { cart: existingCart._id });
    
            await this.cartsRepository.updateCart(cartId, existingCart);
    
            return res.status(200).send({
                message: 'Se ha agregado el producto al carrito existente y se ha asociado al usuario.',
                data: { cart: existingCart, user: updatedUser }
            });
    
        } catch (error) {
            return res.status(500).send("Ha habido un error en el servidor " + error);
        }
    }
    
    async getCartById(req, res) {
        try {
            const cartId = new ObjectId(req.params.cid);
            const cartProducts = await this.cartsRepository.getCartById(cartId);
            if (cartProducts) {
                res.status(200).send({ message: `Se han encontrado los productos del carrito ${cartId}`, data: cartProducts });
            } else {
                res.status(404).send({ message: `No se han encontrado productos en el carrito ${cartId}`, data: cartProducts });
            }
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = new ObjectId(req.params.cid);
            const result = await this.cartsRepository.deleteCart(cartId);
            if (result) {
                res.status(200).send({ message: `Se han eliminado todos los productos del carrito ${cartId}` });
            } else {
                res.status(404).send({ message: `Ya no hay productos por eliminar ${cartId}` });
            }
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
        }
    }
}