import UsersDto from "../DTO/users.dto.js";
import { ObjectId } from "mongodb";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = async() => {
        return await this.dao.get();
    }
    create = async(user) => {
        const userDao = await this.dao.create(user);
        const userDto = new UsersDto(userDao);
        return userDto;
    }
    getOne = async(options) => {
        const user = await this.dao.getOne(options);
        if(user) {
            const userDto = new UsersDto(user);
            return userDto;
        }
        return user;
    }
    update = async (userId, updatedUser) => {
        try {
            const objectId = new ObjectId(userId);
            const user = await this.dao.getOne(objectId);
    
            if (user) {
                const modifiedUser = await this.dao.modify(userId, updatedUser);
                return modifiedUser; // Devuelve el usuario modificado
            } else {
                throw new Error('El usuario no fue encontrado');
            }
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    }
    delete = async (userId) => {
        const objectId = new ObjectId(userId);
        const user = await this.dao.getOne(objectId);
        if (user) {
            const deletedUser = await this.dao.delete(userId);
            return deletedUser; // Devuelve el usuario modificado
        } else {
            throw new Error('El usuario no fue encontrado');
        }
    }
    deleteInactiveUsers = async () => {
        try {
            const now = new Date(); // Fecha y hora actual
            const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // Fecha hace dos días
    
            const inactiveUsers = []; // Aquí almacenaremos los usuarios inactivos
    
            // Obtenemos la lista de usuarios inactivos de la base de datos
            const userList = await this.dao.get();
    
            // Iteramos sobre cada usuario para determinar si han estado inactivos durante al menos dos días
            for (const user of userList) {
                const lastConnection = new Date(user.last_connection);
                if (lastConnection < twoDaysAgo) {
                    inactiveUsers.push(user);
                    await this.dao.delete(user._id);
                }
            }
            
            console.log("Usuarios inactivos eliminados:", inactiveUsers);

            return inactiveUsers;
        } catch (error) {
            throw new Error(`Error al eliminar usuarios inactivos: ${error.message}`);
        }
    }    
}