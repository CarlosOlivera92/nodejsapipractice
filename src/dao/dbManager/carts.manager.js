import {CartsModel} from '../dbManager/models/carts.model.js';

class CartsManager {
    constructor() {
        console.log("carts running");
    }
    getAll = async() => {
        const carts = await CartsModel.find().lean()
        return carts;
    }
    save = async(cart) => {
        const result = await CartsModel.create(cart);
        return result
    }
    update = async(id, cart) => {
        const result = await CartsModel.updateOne({_id: id}, cart);
        return result;
    }
    getOne = async(cartId) => {
        try {
            const cart = await CartsModel.findById(cartId);
            return cart ? cart.toObject() : null;
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    deleteOne = async(cartId) => {
        try {
            const result = await CartsModel.findByIdAndDelete(cartId);
            return result;
        } catch (error) {
            throw new Error("Error al eliminar el carrito");
        }
    }
}
export {CartsManager}