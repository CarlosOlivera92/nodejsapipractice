import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath desde el módulo url
import jwt from 'jsonwebtoken';
import config from "./config/config.js";
// Convierte la URL actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el directorio base
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, 'public/shared/data', 'products.json').replace(/\\/g, '/');
const cartsFilePath = path.join(__dirname, 'public/shared/data', 'carts.json').replace(/\\/g, '/');

const toPascalCase = (string) => {
    return string
        .replace(/\w\S*/g, (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
}
const generateToken = (user) => {
    const token = jwt.sign({ user }, config.privateKey, { expiresIn: '24h' });
    return token;
}
const generateUniqueCode = () => {
    const uniqueID = Math.random().toString(36).substr(2, 9); // Genera una cadena alfanumérica aleatoria
    const timestamp = Date.now().toString(36).substr(2, 6); // Agrega parte de la marca de tiempo actual

    return uniqueID + timestamp; // Combina las dos cadenas para obtener un código único
}

const calculateTotalAmount = (productsToPurchase, purchasedProductsIds) => {
    let totalAmount = 0;

    for (const item of productsToPurchase) {
        if (purchasedProductsIds.includes(item._id)) {
        totalAmount += item.quantity * item.product.price;
        }
    };

    return totalAmount;
}

export {
    productsFilePath,
    cartsFilePath,
    __dirname,
    toPascalCase,
    generateToken,
    generateUniqueCode,
    calculateTotalAmount
}