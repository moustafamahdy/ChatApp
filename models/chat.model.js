const mongoose = require('mongoose');

// const DB_URL = 'mongodb://localhost:27017/chat-app';

const DB_URL = 'mongodb+srv://Moustafamahdy:Mo371997@chatapp.0ttvv.mongodb.net/?retryWrites=true&w=majority';


const chatSchema = mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

const Chat = mongoose.model('chat', chatSchema);
exports.Chat = Chat;

exports.getChat = async chatId => {
    try {
        await mongoose.connect(DB_URL);
        let chat = await Chat.findById(chatId).populate('users');
        mongoose.disconnect();
        return chat;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error)
    }
}

exports.getAllChats = async () => {
    try {
        await mongoose.connect(DB_URL);
        let chats = await Chat.find({}).populate('users');
        mongoose.disconnect();
        return chats;

    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}