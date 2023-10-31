import { ProductsModel } from "./models/products.model.js";

class ProductsManager {
    constructor(title, description, price, thumbnail, category, code, status, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail || [];
        this.category = category;
        this.code = code;
        this.status = status;
        this.stock = stock;
    }

    async getAll() {
        try {
            const products = await ProductsModel.find();
            return products.map((product) => product.toObject());
        } catch (error) {
            throw new Error("Error al obtener todos los productos");
        }
    }

    async save(product) {
        try {
            const result = await ProductsModel.create(product);
            return result;
        } catch (error) {
            throw new Error("Error al guardar el producto");
        }
    }

    async updateOne(productId, updatedProductData) {
        try {
            const updatedProduct = await ProductsModel.findOneAndUpdate(
                { _id: productId },
                updatedProductData,
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el producto");
        }
    }

    async getOne(productId) {
        try {
            const product = await ProductsModel.findById(productId);
            return product ? product.toObject() : null;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error);
        }
    }

    async deleteOne(productId) {
        try {
            const result = await ProductsModel.findOneAndRemove( {_id: productId});
            return result;
        } catch (error) {
            console.log(error)
            throw new Error("Error al eliminar el producto");
        }
    }
}

export { ProductsManager };
