import multer from 'multer';
import UsersRepository from '../repositories/users.repository.js';
import { Users } from '../dao/factory.js';
import fs from 'fs';
import path from 'path';
import { transporter } from '../utils.js';

const uploadsFolder = 'uploads/';

// Verificar si la carpeta "uploads" existe, y si no, crearla
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadsFolder;
        let fieldName = 'files'; // Campo predeterminado

        // Verificar si hay archivos de perfil
        if ('profile' in req.files) {
            uploadPath = path.join(uploadPath, 'profiles');
            fieldName = 'profile';
        } 
        // Verificar si hay archivos de documentos
        else if ('documents' in req.files) {
            uploadPath = path.join(uploadPath, 'documents');
            fieldName = 'documents';
        }
        else if ('products' in req.files) {
            uploadPath = path.join(uploadPath, 'products');
            fieldName = 'products';
        }
        // Verificar si la carpeta de destino existe, y si no, crearla
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
    }
});


const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if ('profile' in req.files || 'documents' in req.files || 'products' in req.files) {
            cb(null, true);
        } else {
            cb(new Error('Unexpected field'), false);
        }
    }
}).fields([
    { name: 'profile', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
    { name: 'products', maxCount: 10}
]);

const usersDao = new Users();

export default class UsersController {
    constructor() {
        this.usersRepository = new UsersRepository(usersDao);
        this.uploadDocuments = this.uploadDocuments.bind(this);
    }

    async uploadDocuments(req, res, next) {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: err });
                } else if (err) {
                    return res.status(500).json({ message: err });
                }

                // Actualizar el estado del usuario con los archivos subidos
                const { uid } = req.params;
                const { files } = req;
                const documents = [];
                files.documents.forEach(file => {
                    let name;
                    // Dividir el nombre del archivo y la extensión
                    const [fileName, fileExtension] = file.originalname.split('.');
                    // Usar solo el nombre del archivo sin la extensión
                    if (fileName === 'documentacion') {
                        name = 'Identificación';
                    } else if (fileName === 'constanciaDomicilio') {
                        name = 'Comprobante de domicilio';
                    } else if (fileName === 'docEstadoCuenta') {
                        name = 'Comprobante de estado de cuenta';
                    }
                    documents.push({ name: name, reference: file.filename });
                });
                // Actualizar el usuario en la base de datos
                const updatedUser = await this.usersRepository.update(uid, { documents });
                return res.status(200).json({ message: 'Archivos cargados exitosamente.' });
            }.bind(this)); // Enlazar la función de callback con el contexto de UsersController
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }
    deleteUser = async (req, res, next) => {
        try {
            const {userId} = req.body;
            await this.usersRepository.delete(userId)
            return res.status(200).json({ message: `Usuario eliminado exitosamente` });
        } catch (error) {
            return res.status(400).json({ message: `Error al eliminar el usuario: ${error.message}` });
        }
    }
    deleteInactive = async (req, res, next) => {
        try {
            const deletedUsers = await this.usersRepository.deleteInactiveUsers();
    
            // Recorremos los usuarios eliminados y enviamos un correo electrónico a cada uno
            for (const user of deletedUsers) {
                transporter.sendMail({
                    from: 'GoodGame Workshop',
                    to: user.email, // Usamos el email del usuario inactivo
                    subject: 'Eliminación por inactividad',
                    html: `
                        <!DOCTYPE html>
                        <html lang="es">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Eliminación por inactividad</title>
                            </head>
                            <body>
                                <p>¡Hola ${user.name}!</p>
                                <p>Recibiste este correo porque tu cuenta ha sido eliminada por inactividad.</p>
                            </body>
                        </html>
                    `
                });
            }
    
            return res.status(200).json({ message: 'Usuarios inactivos eliminados exitosamente.' });
        } catch (error) {
            return res.status(500).json({ message: `Error al eliminar usuarios inactivos: ${error.message}` });
        }
    }    
}
