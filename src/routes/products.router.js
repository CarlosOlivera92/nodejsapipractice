import ProductsController from "../controllers/Products.controller.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import Router from "./router.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
    this.productsController = new ProductsController();
  } 
  init() {
    this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, (req, res, next) => this.productsController.getByQueries(req, res, next));
    this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, this.authorize(["ADMIN", "PREMIUM"]), (req, res, next) => this.productsController.create(req, res, next));
    this.delete('/:pid', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, this.authorize(["ADMIN", "PREMIUM"]), (req, res, next) => this.productsController.deleteOne(req, res, next));
  }
}
/*
router.get('/', async (req, res) => {
    try {
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
        }
        if (sort === 'asc') {
            options.sort = { price: 1 }; 
            options.sort = { price: -1 }; 
        }

        const products = await manager.getByQueries(filter, options, req);
  
        res.send(products);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});
  

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

*/