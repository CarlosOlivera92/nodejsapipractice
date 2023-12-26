import config from "../config/config.js";

const persistence = config.persistence;

let Users;
let Carts;
let Products;

switch(persistence) {
    case 'MONGO':
        console.log('Working with MongoDB');
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongoUrl);

        const { default: UsersMongo } = await import('../dao/dbManager/mongo/users.mongo.js');
        Users = UsersMongo;

        const { default: CartsMongo } = await import('../dao/dbManager/mongo/carts.mongo.js');
        Carts = CartsMongo;

        const { default: ProductsMongo } = await import('../dao/dbManager/mongo/products.mongo.js');
        Products = ProductsMongo;

        break;
    case 'MEMORY':
        console.log('Working with file system');
        break;
}

export { Users, Carts, Products };
