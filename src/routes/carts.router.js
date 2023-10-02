import { Router } from "express";
import { cartsFilePath, productsFilePath } from "../public/shared/utils/utils.js";
import { CartManager } from '../public/shared/classes/cart.js';
import { ProductManager } from "../public/shared/classes/product-manager.js";

const router = Router();

const cartManager = new CartManager(cartsFilePath);
const productManager = new ProductManager(productsFilePath);

router.get('/', async(req, res) => {
    const cart = await cartManager.getCart();
    res.status(200).send( cart );
});
router.get('/:cid', async(req,res) => {
    const cartId = parseInt(req.params.cid);
    const cartProducts = await cartManager.getProductsByCart(cartId);
    if (cartProducts) {
        res.status(200).send( {message: `Se han encontrado los productos del carrito ${cartId}`, data: cartProducts});
    } else {
        res.status(404).send( {message: `No se han encontrado productos en el carrito ${cartId}`, data: cartProducts});
    }
})
router.post('/:cid/product/:pid', async(req,res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        await cartManager.addCart(cartId, product);
        res.status(200).send({message: `Se ha agregado el producto al carrito ${cartId}`, data: `${cartId} ${productId}`});
    } catch (error) {
        res.status(500).send({message: `Ha habido un error en el servidor`, error: error});
    }
})
router.post('/add-to-cart', async(req, res) => {
    try {
        const {cartId, productId} = req.body;

        const cartExists = await cartManager.getCartById(cartId);

        const product = await productManager.getProductById(productId);

        if (cartExists !== "Carrito no encontrado") {
            if (product !== "Producto no encontrado") {
                await cartManager.addCart(cartId, product);
                res.status(201).send("El producto ha sido agregado al carrito seleccionado");
            } else {
                res.status(404).send("No se ha podido encontrar el producto especificado");
            }
        } else {
            await cartManager.addCart(cartId, product);
            res.status(201).send('El carrito ha sido creado y los productos han sido agregados.');
        }

    } catch (error) {
        res.status(500).send("Ha habido un error en el servidor " + error);
    }
})

export default router;