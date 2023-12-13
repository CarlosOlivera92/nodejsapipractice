import UsersDto from "../DTO/users.dto.js";
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
}