import { Router } from "express";
// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { productsFilePath } from "../utils.js";
import { MessagesManager } from "../dao/dbManager/messages.manager.js";
import { toPascalCase } from "../utils.js";
import { ObjectId } from "mongodb";
import { CartsManager } from "../dao/dbManager/carts.manager.js";

const router = Router();
const cartManager = new CartsManager();
const manager = new ProductsManager();
const messagesManager = new MessagesManager()

const publicAccess = (req, res, next) => {
    if(req.session?.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session?.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
});

router.get('/', privateAccess, async (req, res) => {
    console.log(req.session.user)
    const products = await manager.getAll();
    res.render('home', { layout:'main', products: products, user: req.session.user });
});
router.get('/carts/:cid', async(req,res) => {
    const cartId = new ObjectId(req.params.cid);
    const cart = await cartManager.getOne(cartId);
    let products = []
    for (let i of cart.products) {
        products.push(i)
    }
    res.render('cart', {cart: products, user:req.session.user});
})
router.get('/chat', async(req,res) => {
    const messages = await messagesManager.getAll();
    res.render('chat', {messages: messages, user:req.session.user});
})
router.get('/realtimeproducts', async(req,res) => {
    const products = await manager.getAll();
    res.render('realtimeproducts', {products: products, user:req.session.user});
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
    console.log(req.session.user)
    res.render("products", {products: products, user: req.session.user})
})
router.get("/products/:productId", async (req, res) => {
    const productId = new ObjectId( req.params.productId );
    const productDetails = await manager.getOne(productId);
    res.render("productdetails", { product: productDetails, user: req.session.user });
});
export default router;