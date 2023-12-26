import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        unique: false
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const MessagesModel = mongoose.model(messagesCollection, messageSchema);
export {MessagesModel};
