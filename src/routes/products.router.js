import { Router } from "express";
import { ProductManager } from "../public/shared/classes/product-manager.js";
import { filePath } from "../public/shared/utils/utils.js";

const router = Router();
const products = [];
const manager = new ProductManager(filePath);


router.get('/', async(req, res) => {
    try {
        const { limit } = req.query;
        await manager.loadProducts();
        const products = await manager.getProducts();

        if (limit && !isNaN(parseInt(limit))) {
            const limitNumber = parseInt(limit);
            const limitedProducts = products.slice(0, limitNumber);
            res.send(limitedProducts);
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos.' });
    }
})
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
router.post('/add-product', async(req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (title && description && price && thumbnail && code && stock) {
            // Convierte los valores necesarios a los tipos adecuados (por ejemplo, price a número)
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);

            await manager.addProduct(title, description, numericPrice, thumbnail, code, numericStock);
            res.status(201).send("Producto agregado exitosamente!")
        } else {
            res.status(400).send('Los parámetros de consulta son requeridos.');
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});
router.put('/update-product/:pid', async (req, res) => {
    try {
        const paramId = req.params.pid;
        const productId = parseInt(paramId);
        const { title, description, price, thumbnail, code, stock } = req.body;

        if (title && description && price && thumbnail && code && stock) {
            // Convierte los valores necesarios a los tipos adecuados (por ejemplo, price a número)
            const numericPrice = parseFloat(price);
            const numericStock = parseInt(stock);
            
            const updatedProduct = {
                title,
                description,
                price: numericPrice,
                thumbnail,
                code,
                stock: numericStock, 
            };
            const existingProduct = await manager.getProductById(productId);

            if (existingProduct !== 'Producto no encontrado') {
                await manager.updateProduct(productId, updatedProduct);
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
router.delete('/delete-product/:pid', async(req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productExists = await manager.getProductById(productId);
        if (productExists !== 'Producto no encontrado') {
            await manager.deleteProduct(productId);
            res.status(200).send("Producto eliminado exitosamente!");
        } else {
            res.status(200).send("Producto no encontrado");
        }
    } catch(error) {
        res.status(500).send( {message: "Error en el servidor", payload: error});
    }
})

export default router;  