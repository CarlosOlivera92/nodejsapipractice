import { Tickets } from "../dao/factory.js";
import TicketRepository from "../repositories/ticket.repository.js";
import { Carts } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import { Products } from "../dao/factory.js";
import { calculateTotalAmount, generateUniqueCode } from "../utils.js";
const cartsDao = new Carts();
const ticketsDao = new Tickets()
const productsDao = new Products();

export default class TicketController {
    constructor() {
        this.ticketsRepository = new TicketRepository(ticketsDao);
        this.cartsRepository = new CartsRepository(cartsDao);
        this.productsRepository = new ProductsRepository(productsDao);
        this.purchase = this.purchase.bind(this);
    }
    async purchase(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.cartsRepository.getCartById(cartId);
            const productsToPurchase = cart.products;
            const productsNotPurchased = [];
    
            for (const item of productsToPurchase) {
                const product = item.productId;
                const quantityInCart = item.quantity;
    
                if (product.stock >= quantityInCart) {
                    // Suficiente stock para comprar
                    product.stock -= quantityInCart;
                    await this.productsRepository.updateProductStock(product._id, product.stock);
                } else {
                    // No hay suficiente stock para comprar
                    productsNotPurchased.push(product._id);
                }
            }
    
            if (productsNotPurchased.length === 0) {
                // Todos los productos se compraron con éxito, eliminamos el carrito
                await this.cartsRepository.deleteCart(cartId);
    
                // Crear el ticket con los datos de la compra
                const ticketData = {
                    code: generateUniqueCode(), // Generar un código único para el ticket
                    purchase_datetime: new Date(),
                    amount: calculateTotalAmount(productsToPurchase),
                    purchaser: req.user.email, 
                };
    
                const newTicket = await this.ticketsRepository.createTicket(ticketData);
    
                res.status(200).json({
                    message: 'Compra finalizada con éxito',
                    ticket: newTicket,
                });
            } else {
                // Al menos un producto no se pudo comprar, actualizamos el carrito
                cart.products = cart.products.filter(item => !productsNotPurchased.includes(item.productId));
                await this.cartsRepository.updateCart(cartId, cart);
    
                res.status(200).json({
                    message: 'Algunos productos no se pudieron comprar, el carrito se ha actualizado',
                    productsNotPurchased,
                });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
}