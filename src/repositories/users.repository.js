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
            console.log(userId)
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
}