import { Router } from "express";
import { cartsFilePath, productsFilePath } from "../utils.js";
import { CartsManager } from "../dao/dbManager/carts.manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { ObjectId } from "mongodb"

const router = Router();

const cartManager = new CartsManager();
const productManager = new ProductsManager();

router.get('/', async(req, res) => {
    const cart = await cartManager.getAll();
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
router.post('/', async (req, res) => {
    try {
        const { productId } = req.body;
        const id = new ObjectId(productId)
      
        // Busca el producto que deseas agregar
        const product = await productManager.getOne(id);
        
        if (product !== "Producto no encontrado") {
            const productInCart = {
                productId: product.id,
                code: product.code,
                quantity: 1,
            };
    
            const newCart = {
                products: [productInCart],
            };
    
            await cartManager.save(newCart);
            res.status(201).send('Se ha creado un nuevo carrito y se ha agregado el producto.');
        } else {
            res.status(404).send("No se ha podido encontrar el producto especificado");
        }
    } catch (error) {
      res.status(500).send("Ha habido un error en el servidor " + error);
    }
});
  

export default router;