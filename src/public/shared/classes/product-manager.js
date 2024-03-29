import { promises as fs } from 'fs'; // Importa el módulo fs de la forma adecuada

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.productCounter = 1;
        this.products = [];
        this.loadProducts();
    }
    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
                this.productCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    async addProduct(title, description, price, thumbnail, category, code, status, stock) {
        if (!title || !description || !price || !thumbnail || !category || !code || status === "undefined" || !stock) {
            console.error('Todos los campos son obligatorios.');
            return;
        }
    
        const productExists = this.products.some(product => product.code === code);
        if (productExists) {
            console.error('El producto con el código indicado ya existe.');
            return;
        }
        if (!Array.isArray(thumbnail) || thumbnail.some(item => typeof item !== 'string')) {
            console.error('El campo "thumbnail" debe ser un array de strings.');
            return;
        }
        const product = {
            id: this.productCounter++,
            title,
            description,
            price,
            thumbnail,
            category,
            code,
            status,
            stock,
        };
    
        this.products.push(product);
        await this.saveProducts();
    }
    

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const parsedId = parseInt(id);
        const product = this.products.find(product => product.id === parsedId);
        return product || 'Producto no encontrado';
    }

    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            // Se excluye el campo 'id' del objeto actualizado para mantenerlo estático.
            const { id: updatedId, ...restOfUpdatedProduct } = updatedProduct;
            this.products[index] = { id, ...restOfUpdatedProduct };
            await this.saveProducts();
        }
    }
    async deleteProduct(id) {  //Borrar un producto segun su id
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
        }
    }
}
export { ProductManager };