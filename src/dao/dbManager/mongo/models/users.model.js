import mongoose from 'mongoose';

const rolesEnum = ['ADMIN', 'USER', 'PREMIUM'];

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
        default: 'USER', 
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date // Nueva propiedad para almacenar la última conexión
});

const UsersModel = mongoose.model(usersCollection, usersSchema);

export {UsersModel};
