const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/chat-app';

// const DB_URL = 'mongodb+srv://Moustafamahdy:Mo371997@chatapp.0ttvv.mongodb.net/?retryWrites=true&w=majority';


const messageShcema = mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chat'},
    content: String,
    sender: String,
    timestamp: String
});

const Message = mongoose.model('message', messageShcema);

exports.getMessages = async chatId => {
    try {
        await mongoose.connect(DB_URL)
        let messages = await Message.find({ chat: chatId }, null, {
            sort: {
                timestamp: 1
            }
        }).populate({
            path: 'chat',  // field
            model: 'chat',  // model
            populate: {
                path: 'users',
                model: 'user',
                select: 'username image'
            }
        });
        mongoose.disconnect();
        return messages;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error)
    }
}

exports.newMessage = async msg => {
    try {
        await mongoose.connect(DB_URL);
        // let date = (new Date()).toLocaleTimeString()
        // msg.timestamp = date.slice(0, 4) + date.slice(7, 11);
        let newMsg = new Message(msg)
        await newMsg.save();
        mongoose.disconnect();
        return
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
}