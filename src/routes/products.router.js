import { Router } from "express";
// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { ObjectId } from "mongodb";
// import { productsFilePath } from "../utils.js";

const router = Router();
const manager = new ProductsManager();


router.get('/', async(req, res) => {
    try {
        const { limit } = req.query;
        const products = await manager.getAll();

        if (limit && !isNaN(parseInt(limit))) {
            const limitNumber = parseInt(limit);
            const limitedProducts = products.slice(0, limitNumber);
            res.send({status: "success", payload: limitedProducts});
        } else {
            res.send({status: "success", payload: products});
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
})
/*
router.get('/:pid', async (req, res) => {
    try {
        await manager.loadProducts();
        const productId = parseInt(req.params.pid);
        const selectedProduct = await manager.getProductById(productId);

        if (selectedProduct === 'Producto no encontrado') {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            res.json(selectedProduct);
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}); 
*/
router.post('/', async(req, res) => {
    try {
        const { title, description, price, thumbnail, category, code, status, stock } = req.body;
        if (title && description && price && thumbnail && code && status && stock) {
            // Convierte los valores necesarios a los tipos adecuados (por ejemplo, price a número)
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);
            const product = new ProductsManager(title, description, numericPrice, thumbnail, category, code, status ,numericStock)
            await manager.save(product);
            res.status(201).send("Producto agregado exitosamente!")
        } else {
            res.status(400).send('Los parámetros de consulta son requeridos.');
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});
router.put('/:pid', async (req, res) => {
    try {
        const paramId = req.params.pid;
        const productId = parseInt(paramId);
        const { title, description, price, thumbnail, category, code, status, stock } = req.body;
        if (title && description && price && thumbnail && category && code && status && stock) {
            // Convierte los valores necesarios a los tipos adecuados (por ejemplo, price a número)
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);
            console.log(numericStock)

            const updatedProduct = {
                title,
                description,
                price: numericPrice,
                thumbnail,
                category,
                code,
                status,
                stock: numericStock, 
            };
            const existingProduct = await manager.getOne(productId);

            if (existingProduct !== 'Producto no encontrado') {
                await manager.updateOne(productId, updatedProduct);
                res.status(201).send("Producto modificado exitosamente!");
            } else {
                res.status(404).send('El producto no se encontró. No se pudo actualizar.');
            }
        } else {
            res.status(400).send('Los parámetros de consulta son requeridos o están incompletos.');
        }
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async(req, res) => {
    try {
        const productId = new ObjectId(req.params.pid);
        console.log(productId);
        await manager.deleteOne(productId);
        res.status(200).send("Producto eliminado exitosamente!");
    } catch(error) {
        res.status(500).send( {message: "Error en el servidor", payload: error.message});
    }
})

export default router;