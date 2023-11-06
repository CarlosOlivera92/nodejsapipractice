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
    async getByQueries(query, options, req) {
        try {
            if (!query) {
                query = '';
            }
            console.log(query)
            let result = {};
            result = await ProductsModel.paginate(query, options);
            const products = result.docs.map((product) => product.toObject());
            
            const response = {
                status: 'success',
                payload: products,
                totalPages: result.totalPages,
                prevPage: result.hasPrevPage ? result.page - 1 : null,
                nextPage: result.hasNextPage ? result.page + 1 : null,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${req.baseUrl}?query=${query}&page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `${req.baseUrl}?query=${query}&page=${result.page + 1}&limit=${options.limit}` : null
            };
    
            return response;
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error);
        }
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
    async saveMany(products) {
        try {
            return await ProductsModel.insertMany(products);
        } catch ( error ) {
            throw error;
        }
    }
}

export { ProductsManager };
