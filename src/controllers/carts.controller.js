import { Carts, Users } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";

import ProductsRepository from "../repositories/products.repository.js";
import { Products } from "../dao/factory.js";
import { ObjectId } from "mongodb";
import UsersRepository from "../repositories/users.repository.js";
import CartsDto from "../DTO/carts.dto.js";
const usersDao = new Users()
const cartsDao = new Carts();
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
            const cartsDto = carts.map(cart => new CartsDto(cart)); // Transformar los datos usando el DTO
            res.status(200).send(cartsDto);
        } catch (error) {
            res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
        }
    }
    async createCartWithProduct(userId, product) {
        const newObjUserId = new ObjectId(userId);
        const productInCart = {
            productId: product._id,
            quantity: 1,
        };

        const newCart = {
            products: [productInCart],
            user: userId,
        };
    
        const createdCart = await this.cartsRepository.createCart(newCart);
        const updatedUser = await this.usersRepository.update(userId, { cart: createdCart._id });

        console.log(createdCart)
        // Actualizar el usuario con el nuevo carrito
        await this.usersRepository.update(userId, { cart: createdCart._id });
    
        return createdCart;
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
            // Verificar si el producto ya pertenece al usuario premium
            if (product.owner && product.owner === userId) {
                return res.status(403).send("No puedes agregar tu propio producto a tu carrito.");
            }
            if (!cartId) {
                const createdCart = await this.createCartWithProduct(userId, product);
                return res.status(201).send({
                    message: `Se ha creado un nuevo carrito con ID: ${createdCart.id} y se ha agregado el producto.`,
                    data: { cart: createdCart.id},
                });
            }
            const newObjCartId = new ObjectId(cartId);
            const existingCart = await this.cartsRepository.getCartById(newObjCartId);
    
            if (!existingCart) {
                const createdCart = await this.createCartWithProduct(userId, product);
                return res.status(201).send({
                    message: `Se ha creado un nuevo carrito con ID: ${createdCart.id} y se ha agregado el producto.`,
                    data: { cart: createdCart.id},
                });
            }
            // Verificar si el producto ya está en el carrito
            const existingProductIndex = existingCart.products.findIndex(item => String(item.productId._id) === String(product._id));

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, aumentar la cantidad
                existingCart.products[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                existingCart.products.push({
                    productId: product._id,
                    quantity: 1,
                });
            }
    
            const updatedUser = await this.usersRepository.update(userId, { cart: existingCart._id });
    
            await this.cartsRepository.updateCart(cartId, existingCart);
    
            return res.status(200).send({
                message: 'Se ha agregado el producto al carrito existente y se ha asociado al usuario.',
                data: { cart: existingCart.id }
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
    async deleteProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const objCartId = new ObjectId(cid);
            if (!cid || !objCartId) {
                return res.status(400).json({ message: "El ID proporcionado es incorrecto y no se pudo procesar la solicitud" });
            }
    
            const cart = await this.cartsRepository.getCartById(objCartId);
            
            if (!cart) {
                return res.status(404).json({ message: "No se ha encontrado el carrito" });
            }
            const productsInCart = cart.products;
            // Buscar el producto en el carrito
            const productIndex = productsInCart.findIndex(item => item.productId.id === pid);
            if (productIndex === -1) {
                return res.status(404).json({ message: "Producto no encontrado en el carrito" });
            }
            // Verificar la cantidad del producto en el carrito
            const productQuantity = productsInCart[productIndex].quantity;
            console.log(productQuantity)
            // Si la cantidad es mayor que 1, restar 1 a la cantidad
            if (productQuantity > 1) {
                productsInCart[productIndex].quantity -= 1;
            } else {
                productsInCart.splice(productIndex, 1);
            }
    
            // Guardar los cambios en la base de datos
            const updatedCart = await this.cartsRepository.updateCart(objCartId, cart);
            // Responder con el carrito actualizado
            return res.status(200).json({ message: "Producto actualizado en el carrito", updatedCart });
        } catch (error) {
            return res.status(500).json({ message: 'Ha habido un error en el servidor', error: error });
        }
    }
    
    async deleteCart(req, res) {
        try {
            const cartId = new ObjectId(req.params.cid);
            const result = await this.cartsRepository.deleteCart(cartId);
            if (result) {
                res.status(200).send({ message: `Se ha eliminado el carrito ${cartId}` });
            } else {
                res.status(404).send({ message: `No se pudo encontrar el carrito con ID: ${cartId}` });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
        }
    }
}