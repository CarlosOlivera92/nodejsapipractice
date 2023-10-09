import { Router } from "express";
import { ProductManager } from "../public/shared/classes/product-manager.js";
import { productsFilePath } from "../utils.js";

const router = Router();
const manager = new ProductManager(productsFilePath);

router.get('/', async(req,res) => {
    const products = await manager.getProducts();
    res.render('home', {products: products});
})
router.get('/realtimeproducts', async(req,res) => {
    const products = await manager.getProducts();
    res.render('realtimeproducts', {products: products});
})

export default router;