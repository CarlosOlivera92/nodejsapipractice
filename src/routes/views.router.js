import { Router } from "express";
// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { productsFilePath } from "../utils.js";
import { MessagesManager } from "../dao/dbManager/messages.manager.js";
const router = Router();
const manager = new ProductsManager();
const messagesManager = new MessagesManager()
router.get('/', async(req,res) => {
    const products = await manager.getAll();
    res.render('home', {products: products});
})
router.get('/chat', async(req,res) => {
    const messages = await messagesManager.getAll();
    res.render('chat', {messages: messages});
})
router.get('/realtimeproducts', async(req,res) => {
    const products = await manager.getAll();
    res.render('realtimeproducts', {products: products});
})

export default router;