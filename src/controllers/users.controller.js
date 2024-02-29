import multer from 'multer';
import UsersRepository from '../repositories/users.repository.js';
import { Users } from '../dao/factory.js';
import fs from 'fs';

// Verificar si la carpeta "uploads" existe, y si no, crearla
const uploadsFolder = 'uploads/';
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsFolder); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
    }
});

// Inicialización de multer
const upload = multer({ storage: storage }).array('documents', 10);
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
                    return res.status(400).json({ message: 'Error al cargar los archivos.' });
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
