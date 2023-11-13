import mongoose from 'mongoose';

const rolesEnum = ['ADMIN', 'USER'];

const usersCollection = 'users';


const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    role: {
        type: String,
        enum: rolesEnum,
        default: 'users', 
    },
    password: String
});

const UsersModel = mongoose.model(usersCollection, usersSchema);

export {UsersModel};