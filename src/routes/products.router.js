import { Router } from "express";
// import { ProductManager } from "../public/shared/classes/product-manager.js";
import { ProductsManager } from "../dao/dbManager/products.manager.js";
import { ObjectId } from "mongodb";
import { toPascalCase } from "../utils.js";
const router = Router();
const manager = new ProductsManager();
const productsList = [
    {
      "title": "Grand Theft Auto V",
      "description": "Un emocionante juego de acción y aventuras en un mundo abierto donde puedes vivir la vida delictiva en Los Santos.",
      "price": 29.99,
      "thumbnail": "gta_v.jpg",
      "category": "Aventuras",
      "code": "GTAV001",
      "status": true,
      "stock": 100
    },
    {
      "title": "The Last of Us",
      "description": "Una apasionante historia de supervivencia en un mundo postapocalíptico donde un hombre y una niña deben luchar contra los infectados y otros peligros.",
      "price": 19.99,
      "thumbnail": "the_last_of_us.jpg",
      "category": "Acción",
      "code": "TLOU001",
      "status": true,
      "stock": 75
    },
    {
      "title": "The Last of Us Part II",
      "description": "Sigue la emocionante historia de Ellie en un mundo desgarrado por la violencia y la venganza.",
      "price": 39.99,
      "thumbnail": "the_last_of_us_2.jpg",
      "category": "Acción",
      "code": "TLOU002",
      "status": true,
      "stock": 50
    },
    {
      "title": "Borderlands",
      "description": "Únete a un grupo de cazadores de tesoros en un mundo humorístico y lleno de acción con un estilo visual único.",
      "price": 14.99,
      "thumbnail": "borderlands.jpg",
      "category": "Shooter",
      "code": "BL001",
      "status": true,
      "stock": 80
    },
    {
      "title": "The Elder Scrolls V: Skyrim",
      "description": "Explora el vasto mundo de Skyrim y sumérgete en una aventura épica de dragones, magia y exploración.",
      "price": 24.99,
      "thumbnail": "skyrim.jpg",
      "category": "RPG",
      "code": "SKY001",
      "status": true,
      "stock": 90
    },
    {
      "title": "The Legend of Zelda: Breath of the Wild",
      "description": "Únete a Link en su viaje a través del vasto y misterioso reino de Hyrule en busca de la princesa Zelda.",
      "price": 49.99,
      "thumbnail": "zelda.jpg",
      "category": "Aventuras",
      "code": "ZEL001",
      "status": true,
      "stock": 60
    },
    {
      "title": "FIFA 23",
      "description": "Disfruta de emocionantes partidos de fútbol con los equipos y jugadores más destacados del mundo.",
      "price": 39.99,
      "thumbnail": "fifa_23.jpg",
      "category": "Deportes",
      "code": "FIFA23",
      "status": true,
      "stock": 70
    },
    {
      "title": "Call of Duty: Modern Warfare",
      "description": "Participa en intensas operaciones militares en todo el mundo en este juego de disparos en primera persona.",
      "price": 29.99,
      "thumbnail": "cod_modern_warfare.jpg",
      "category": "Shooter",
      "code": "COD001",
      "status": true,
      "stock": 85
    },
    {
      "title": "Minecraft",
      "description": "Construye y explora un mundo infinito hecho de bloques en este juego de creatividad y aventuras.",
      "price": 19.99,
      "thumbnail": "minecraft.jpg",
      "category": "Aventuras",
      "code": "MC001",
      "status": true,
      "stock": 95
    },
    {
      "title": "Assassin's Creed Valhalla",
      "description": "Embárcate en una épica aventura vikinga en la Edad Media en este juego de acción y sigilo.",
      "price": 34.99,
      "thumbnail": "assassins_creed_valhalla.jpg",
      "category": "Aventuras",
      "code": "ACV001",
      "status": true,
      "stock": 65
    },
    {
      "title": "Red Dead Redemption",
      "description": "Explora el Salvaje Oeste como un forajido en busca de redención en este juego de acción en mundo abierto.",
      "price": 39.99,
      "thumbnail": "red_dead_redemption.jpg",
      "category": "Aventuras",
      "code": "RDR001",
      "status": true,
      "stock": 70
    },
    {
      "title": "Halo Infinite",
      "description": "Enfréntate a alienígenas en una galaxia en guerra en el último episodio de la saga Halo.",
      "price": 49.99,
      "thumbnail": "halo_infinite.jpg",
      "category": "Shooter",
      "code": "HI001",
      "status": true,
      "stock": 55
    },
    {
      "title": "The Witcher 3: Wild Hunt",
      "description": "Embárcate en una cacería de monstruos y aventuras en un mundo de fantasía en este juego de rol épico.",
      "price": 27.99,
      "thumbnail": "witcher_3.jpg",
      "category": "RPG",
      "code": "WITCHER3",
      "status": true,
      "stock": 75
    },
    {
      "title": "Dark Souls III",
      "description": "Supera desafíos mortales en un oscuro mundo de fantasía en este juego de acción y rol.",
      "price": 29.99,
      "thumbnail": "dark_souls_3.jpg",
      "category": "RPG",
      "code": "DS3",
      "status": true,
      "stock": 45
    },
    {
      "title": "Super Mario Odyssey",
      "description": "Acompaña a Mario en una nueva aventura para rescatar a la princesa Peach en este juego de plataformas.",
      "price": 44.99,
      "thumbnail": "super_mario_odyssey.jpg",
      "category": "Aventuras",
      "code": "SMO001",
      "status": true,
      "stock": 65
    }
  ]
  

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