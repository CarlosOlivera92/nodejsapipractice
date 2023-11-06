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
    findAndUpdateProducts = async(cartId, cart) => {
        try {
            const newCart = await CartsModel.findByIdAndUpdate(cartId, cart, { new: true });
            if (newCart) {
                return { message: `Se ha actualizado el carrito ${cartId}` };
            } else {
                return { message: `No se ha encontrado el carrito especificado` };
            }
        } catch (error) {
            throw error;
        }
    }
    getOne = async(cartId) => {
        try {
            const cart = await CartsModel.findOne({_id: cartId}).populate('products.productId', '_id title category price');
            return cart;
        } catch (error) {
            console.log(error)
            throw new Error("Error al obtener el carrito");
        }
    }
    deleteAllProducts = async (cartId) => {
        try {
          const result = await CartsModel.updateOne({ _id: cartId }, { $set: { products: [] } });
          if (result.modifiedCount > 0) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          throw new Error('Error al eliminar todos los productos del carrito');
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
    findAndDeleteProduct = async(cartId, productId) => {
        try {
            const cart = await CartsModel.findOneAndUpdate(
                { _id: cartId },
                { $pull: { products: { productId: productId } } },
                { new: true }
            );

            if (cart) {
                return { message: `Se ha eliminado el producto ${productId} del carrito ${cartId}` };
            } else {
                return { message: `No se ha encontrado el carrito o producto especificado` };
            }
        } catch (error) {
            console.log(error);
            throw new Error("Ha habido un error en el servidor");
        }
    }
}
export {CartsManager}