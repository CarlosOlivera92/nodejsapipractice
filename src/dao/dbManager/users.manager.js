import { UsersModel } from "./models/users.model.js";
class UsersManager {
    constructor(firstName, lastName, email, age, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.age = age;
        this.password = password;
    }
    getAll = async() => {
        try {
            return await UsersModel.find().lean();
        } catch ( error ) {
            throw new Error(error);
        }
    }
    getOne = async(field) => {
        try {
            return await UsersModel.findOne(field);
        } catch (error) {
            throw new Error( error )
        }
    }
    findById = async(id) => {
        try {
            return await UsersModel.findById(id);
        } catch (error) {
            return error;
        }
    }
    saveOne = async(user) => {
        try {
            return await UsersModel.create(user);
        } catch ( error ) {
            throw new Error( error );
        }
    }

}
export { UsersManager };