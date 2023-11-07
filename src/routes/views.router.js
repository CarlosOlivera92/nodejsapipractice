import { Router } from "express";
// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { productsFilePath } from "../utils.js";
import { MessagesManager } from "../dao/dbManager/messages.manager.js";
import { toPascalCase } from "../utils.js";
import { ObjectId } from "mongodb";

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
router.get("/products", async(req, res) => {
    let { limit, page, sort, query } = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sort: " "
    };
    const filter = {};

    if (query) {
        query = toPascalCase(query)
        filter.$or = [];
    
        if (query.toLowerCase() !== 'true' && query.toLowerCase() !== 'false') {
            filter.$or.push({ category: query });
        }
    
        if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
            filter.$or.push({ status: query.toLowerCase() === 'true' });
        }
    } else {
        query = ' ';
    }
    if (sort === 'asc') {
        options.sort = { price: 1 }; 
        options.sort = { price: -1 }; 
    }

    const products = await manager.getByQueries(filter, options, req);
    console.log(products.payload)
    res.render("products", {products: products})
})
router.get("/products/:productId", async (req, res) => {
    const productId = new ObjectId( req.params.productId );
    const productDetails = await manager.getOne(productId);
    res.render("productdetails", { product: productDetails });
});
export default router;