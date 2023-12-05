import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath desde el módulo url
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY_JWT } from './config/constants.js';
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
    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' });
    return token;
}
export {
    productsFilePath,
    cartsFilePath,
    __dirname,
    toPascalCase,
    generateToken
}