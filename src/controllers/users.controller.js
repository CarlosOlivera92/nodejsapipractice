import multer from 'multer';
import UsersRepository from '../repositories/users.repository.js';
import { Users } from '../dao/factory.js';
import fs from 'fs';
import path from 'path';

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
        console.log(req)
        if ('profile' in req.files || 'documents' in req.files || 'products' in req.files) {
            cb(null, true);
            console.log(req.files)
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
                // Actualizar el usuario en la base de datos
                const updatedUser = await this.usersRepository.update(uid, { documents: files });
                console.log(updatedUser)
                return res.status(200).json({ message: 'Archivos cargados exitosamente.' });
            }.bind(this)); // Enlazar la función de callback con el contexto de UsersController
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }
}
