import CartsDto from "../DTO/carts.dto.js";
import { ObjectId } from "mongodb";

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts() {
        try {
            const carts = await this.dao.get();
            return carts;
        } catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }

    async createCart(cartData) {
        try {
            const createdCart = await this.dao.create(cartData);
            return createdCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error}`);
        }
    }

    async getCartById(cartId) {
        try {
            let options = { _id: cartId}
            const cart = await this.dao.getOne(options);
            return cart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCart(cartId, updatedCartData) {
        try {
            const updatedCart = await this.dao.modify(cartId, updatedCartData);
            return updatedCart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteCart(cartId) {
        try {
            const deletedCart = await this.dao.delete(cartId);
            return deletedCart;
        } catch (error) {
            throw new Error('Error al eliminar el carrito');
        }
    }
}
