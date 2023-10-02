import path from "path";
import { fileURLToPath } from "url"; // Importa fileURLToPath desde el módulo url
// Convierte la URL actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el directorio base
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json').replace(/\\/g, '/');
const cartsFilePath = path.join(__dirname, '..', 'data', 'carts.json').replace(/\\/g, '/');

export {
    productsFilePath,
    cartsFilePath,
}