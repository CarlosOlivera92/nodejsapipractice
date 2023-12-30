import mongoose from "mongoose";

const cartsCollection = "carts";

// Definir el esquema para los productos dentro del carrito
const productInCartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products"
  },
  quantity: Number,
});

// Definir el esquema para el carrito
const cartSchema = new mongoose.Schema({
  products: [productInCartSchema], 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users' 
  }
});

// Crear el modelo usando el esquema
const CartsModel = mongoose.model(cartsCollection, cartSchema);

export {CartsModel};
