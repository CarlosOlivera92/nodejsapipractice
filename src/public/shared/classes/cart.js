import { promises as fs } from 'fs'; // Importa el módulo fs de la forma adecuada

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.cartCounter = 1;
        this.carts = [];
        this.loadCart();
    }
    async loadCart() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (data) {
                this.carts = JSON.parse(data);
                this.cartCounter = Math.max(...this.carts.map(cart => cart.id), 0) + 1;
            }
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
    }

    async saveToCart() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }
    async addProductsToCart(id, productsToAdd) {
        const cartIndex = this.carts.findIndex(cart => cart.id === id);
        if (cartIndex !== -1) {
            // Si el carrito existe, agrega los productos a la matriz existente de productos del carrito.
            this.carts[cartIndex].products.push(productsToAdd);
            await this.saveToCart();
        } else {
            console.error('El carrito no existe, no se pueden agregar productos.');
        }
    }
    
    async addCart(id, product) {
        const cartExists = this.carts.find(cart => cart.id === id);
        if (!product) {
            console.error('Todos los campos son obligatorios.');
            return;
        }
        let { id: productId, code } = product;
        const cartProduct = {
            productId,
            code,
            quantity: 1
        }
        const cart = {
            id: this.cartCounter++,
            products: [cartProduct]
        };
        const existingProductIndex = cartExists ? cartExists.products.findIndex(p => p.productId === productId || p.code === code) : -1;
        if (existingProductIndex !== -1) {
            cartExists.products[existingProductIndex].quantity++;
        } else {
            if (cartExists) {
                await this.addProductsToCart(id, cartProduct)
            } else {
                this.carts.push(cart);
            }
        }
        await this.saveToCart();
    }
    
    async getCart() {
        return this.carts;
    }

    async getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);
        return cart || 'Carrito no encontrado';
    }
    async getProductsByCart(id) {
        const cart = await this.getCartById(id);
    
        if (cart) {
            const products = cart.products;
            return products || null; // Devuelve una matriz vacía si no hay productos.
        } else {
            return null; // Devuelve null para indicar que el carrito no se encontró.
        }
    }
    
    async updateCart(id, updatedCart) {
        const index = this.carts.findIndex(cart => cart.id === id);
        if (index !== -1) {
            // Se excluye el campo 'id' del objeto actualizado para mantenerlo estático.
            const { id: updatedId, ...restOfUpdatedProduct } = updatedCart;
            this.carts[index] = { id, ...restOfUpdatedProduct };
            await this.saveToCart();
        }
    }
    

    async deleteCart(id) {  //Borrar un producto segun su id
        const index = this.carts.findIndex(cart => cart.id === id);
        if (index !== -1) {
            this.carts.splice(index, 1);
            await this.saveToCart();
        }
    }
}
export {CartManager};