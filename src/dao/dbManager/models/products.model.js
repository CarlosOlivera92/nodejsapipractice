import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = "Products";

// Definir el esquema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: Array,
    default: []
  },
  category:  {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  status:  {
    type: Boolean,
    required: true
  },
  stock:  {
    type: Number,
    required: true
  },
});
productSchema.plugin(mongoosePaginate);
// Crear el modelo usando el esquema
const ProductsModel = mongoose.model(productsCollection, productSchema);

export {ProductsModel};