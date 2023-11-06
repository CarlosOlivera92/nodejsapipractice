import { Router } from "express";
import { cartsFilePath, productsFilePath } from "../utils.js";
import { CartsManager } from "../dao/dbManager/carts.manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { ObjectId } from "mongodb";
const router = Router();

const cartManager = new CartsManager();
const productManager = new ProductsManager();

router.get('/', async(req, res) => {
    const cart = await cartManager.getAll();
    res.status(200).send( cart );
});
router.get('/:cid', async(req,res) => {
    const cartId = new ObjectId(req.params.cid);
    const cartProducts = await cartManager.getOne(cartId);
    if (cartProducts) {
        res.status(200).send( {message: `Se han encontrado los productos del carrito ${cartId}`, data: cartProducts});
    } else {
        res.status(404).send( {message: `No se han encontrado productos en el carrito ${cartId}`, data: cartProducts});
    }
})

router.post('/', async (req, res) => {
    try {
        const { productId } = req.body;
        const id = new ObjectId(productId)
        const product = await productManager.getOne(id);
        if (product !== "Producto no encontrado") {
            const productInCart = {
                productId: product._id,
                quantity: 1,
            };
    
            const newCart = {
                products: [productInCart],
            };
            await cartManager.save(newCart)
            res.status(201).send('Se ha creado un nuevo carrito y se ha agregado el producto.');
        } else {
            res.status(404).send("No se ha podido encontrar el producto especificado");
        }
    } catch (error) {
      res.status(500).send("Ha habido un error en el servidor " + error);
    }
});
  
// Endpoint para actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {

    try {
        const cartId = new ObjectId(req.params.cid);
        const productId = new ObjectId(req.params.pid);
        const newQuantity = req.body.quantity;
        const cart = await cartManager.getOne(cartId);
        console.log(cart.products)
        const product = cart.products.find((item) => {
            if (item.productId.equals(productId)) {
                return true;
            }
        });
        if (product) {
            product.quantity = newQuantity;
        }

        await cartManager.update(cartId, cart);
        res.status(200).send({ message: `Se ha actualizado la cantidad del producto ${productId} en el carrito ${cartId}` });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Ha habido un error en el servidor`, error: error });
    }
});

//Endpoint para eliminar un producto del carrito seleccionado
router.delete("/:cid/products/:pid", async(req,res) => {
    try {
        const cartId = new ObjectId(req.params.cid);
        const productId = new ObjectId(req.params.pid);

        const result = await cartManager.findAndDeleteProduct(cartId, productId);

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: `Ha habido un error en el servidor`, error: error });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const cartId = new ObjectId(req.params.cid);
        const updatedCart = req.body;

        const result = await cartManager.findAndUpdateProducts(cartId, updatedCart);

        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Ha habido un error en el servidor`, error: error });
    }
});
router.delete("/:cid", async(req, res) => {
    try {
        const cartId = new ObjectId(req.params.cid);
        const result = await cartManager.deleteAllProducts(cartId);
        if (result) {
            res.status(200).send({ message: `Se han eliminado todos los productos del carrito ${cartId}` });
        } else {
            res.status(404).send({ message: `Ya no hay productos por eliminar ${cartId}` });
        }
    } catch (error) {
        res.status(500).send({ message: 'Ha habido un error en el servidor', error: error });
    }
})
export default router;