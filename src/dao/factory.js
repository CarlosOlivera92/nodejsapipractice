import config from "../config/config.js";

const persistence = config.persistence;

let Users;

switch(persistence) {
    case 'MONGO':
        console.log('Working with MongoDB');
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongoUrl);
        const {default: UsersMongo} = await import('../dao/dbManager/mongo/users.mongo.js');
        Users = UsersMongo;
        break;
    case 'MEMORY':
        console.log('Working with files system');
        break;
}
export {
    Users
}