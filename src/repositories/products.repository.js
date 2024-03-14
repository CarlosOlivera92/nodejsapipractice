import querystring from 'querystring';
export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    async getByQueries(req) {
        try {
            let { limit, page, sort, status, category } = req.query;
            let query = { };
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: " ",
            };
            if (status) {
                query.status = status;
            }
            if (category) {
                query.category = toPascalCase(category);
            }
            if (sort === 'asc') {
                options.sort = { price: 1 }; 
                options.sort = { price: -1 }; 
            }
            if(Object.keys(query).length === 0) {
                query='';
            }
            const queryString = querystring.stringify(query);
            let result = {};
            result = await this.dao.getPaginated(query, options);
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
                prevLink: result.hasPrevPage ? `${req.baseUrl}?${queryString}&page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `${req.baseUrl}?${queryString}&page=${result.page + 1}&limit=${options.limit}` : null
            };
            return response;
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error);
        }
    }
    async getAll() {
        try {
            const products = await this.dao.get();
            return products.map((product) => product.toObject());
        } catch (error) {
            throw new Error("Error al obtener todos los productos");
        }
    }

    async save(product) {
        try {
            const result = await this.dao.create(product);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateOne(productId, updatedProductData) {
        try {
            const updatedProduct = await this.dao.findOneAndUpdate(
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
            const options = { _id: productId}
            const product = await this.dao.getOne(options);
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error);
        }
    }

    async deleteOne(productId) {
        try {
            const result = await this.dao.findOneAndRemove( {_id: productId});
            return result;
        } catch (error) {
            console.log(error)
            throw new Error("Error al eliminar el producto");
        }
    }
    async updateProductStock(productId, newStock) {
        try {
            const updatedProduct = await this.dao.findOneAndUpdate(
                { _id: productId },
                { $set: { stock: newStock } }, 
                { new: true }
            );
            return updatedProduct;
        } catch (error) {
            throw new Error("Error al actualizar el stock del producto");
        }
    }
}