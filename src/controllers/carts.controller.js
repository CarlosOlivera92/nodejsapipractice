import { Carts } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";

const cartsDao = new Carts;

export default class CartsController {
    constructor() {
        this.cartsRepository = new CartsRepository(cartsDao);
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