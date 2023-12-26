import CartsDto from "../DTO/carts.dto.js";

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
            throw new Error('Error al crear un carrito');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.dao.getOne(cartId);
            if (cart) {
                const cartDto = new CartsDto(cart);
                return cartDto;
            }
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito');
        }
    }

    async updateCart(cartId, updatedCartData) {
        try {
            const updatedCart = await this.dao.update(cartId, updatedCartData);
            return updatedCart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito');
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
