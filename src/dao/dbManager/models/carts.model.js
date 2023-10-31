import mongoose from "mongoose";

const cartsCollection = "carts";

// Definir el esquema para los productos dentro del carrito
const productInCartSchema = new mongoose.Schema({
  productId: Number,
  code: String,
  quantity: Number,
});

// Definir el esquema para el carrito
const cartSchema = new mongoose.Schema({
  id: Number,
  products: [productInCartSchema], // Un array de productos en el carrito
});

// Crear el modelo usando el esquema
const CartsModel = mongoose.model(cartsCollection, cartSchema);

export {CartsModel};
