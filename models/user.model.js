const mongoose = require('mongoose');

const Chat = require('./chat.model').Chat

const DB_URL = 'mongodb://localhost:27017/chat-app';

// const DB_URL = 'mongodb+srv://Moustafamahdy:Mo371997@chatapp.0ttvv.mongodb.net/?retryWrites=true&w=majority';


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: { type: String, default: "default-user-image.png" },
    isOnline: { type: Boolean, default: false },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    chatIds: { 
        type: [{ chatId: String }],
        default: []
    },
    friendsRequests: {
        type: [{ name: String, id: String, image: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String, image: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);
exports.User = User;

exports.getUserData = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return User.findById(id);
            })
            .then(data => {
                mongoose.disconnect();
                resolve(data);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.sendFriendRequest = async (data) => {
    // add user1 data to user2 friendRequests
    // add user2 data to user1 sentRequests
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $push: { friendsRequests: { name: data.myName, id: data.myId, image: data.myImage } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $push: { sentRequests: { name: data.friendName, id: data.friendId, image: data.friendImage } } }
        );
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.cancelFriendRequest = async (data) => {
    // remove me from friends requests
    // remove friend from my sent requests
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { friendsRequests: { id: data.myId } } }
        );
        await User.updateOne(
            { _id: data.myId },
            { $pull: { sentRequests: { id: data.friendId } } }
        );
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};
exports.acceptFriendRequest = async (data) => {
    // remove me from friends requests
    // remove friend from my sent requests
    // add me to friend friends
    // add friend to my friends
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne(
            { _id: data.myId },
            { $pull: { friendsRequests: { id: data.friendId } } }
        );
        await User.updateOne(
            { _id: data.friendId },
            { $pull: { sentRequests: { id: data.myId } } }
        );
        let newChat = new Chat({
            users: [data.myId, data.friendId]
        })
        let chatDoc = await newChat.save();
        await User.updateOne(
            { _id: data.friendId },
            {
                $push:
                {
                    friends:
                    {
                        name: data.myName,
                        id: data.myId,
                        image: data.myImage,
                        chatId: chatDoc._id
                    },
                    chatIds: {
                        chatId: chatDoc._id
                    }
                }
            }
        );
        await User.updateOne(
            { _id: data.myId },
            {
                $push:
                {
                    friends:
                    {
                        name: data.friendName,
                        id: data.friendId,
                        image: data.friendImage,
                        chatId: chatDoc._id
                    }
                }
            }
        );
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.rejectFriendRequest = async (data) => {
    // remove me from friends requests
    // remove friend from my sent requests
    try {
        await mongoose.connect(DB_URL);
        await Promise.all([
            User.updateOne(
                { _id: data.myId },
                { $pull: { friendsRequests: { id: data.friendId } } }
            ),
            User.updateOne(
                { _id: data.friendId },
                { $pull: { sentRequests: { id: data.myId } } }
            )
        ]);
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.deleteFriend = async (data) => {
    // remove me from friends requests
    // remove friend from my sent requests
    try {
        await mongoose.connect(DB_URL);
        // await User.updateOne(
        //     { _id: data.friendId },
        //     { $pull: { friendsRequests: { id: data.myId } } }
        // );
        // await User.updateOne(
        //     { _id: data.myId },
        //     { $pull: { sentRequests: { id: data.friendId } } }
        // );
        await Promise.all([
            User.updateOne(
                { _id: data.friendId },
                { $pull: { friends: { id: data.myId } } }
            ),
            User.updateOne(
                { _id: data.myId },
                { $pull: { friends: { id: data.friendId } } }
            ),
            Chat.deleteOne(
                { _id: data.friendChatId }
            )
        ]);
        // await Chat.updateOne(
        //     { _id: data.friendId },
        //     { $pull: { }}
        // )
        mongoose.disconnect();
        return;
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};


exports.getFriendsRequests = async id => {
    try {
        await mongoose.connect(DB_URL);
        let data = await User.findById(id, { friendsRequests: true })
        return data.friendsRequests
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getFriends = async id => {
    try {
        await mongoose.connect(DB_URL);
        let data = await User.findById(id, { friends: true })
        return data.friends
    } catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.getFriendsBySearch = (search) => {
    return new Promise((resolve, reject) => {
        // connect to the database
        mongoose.connect(DB_URL).then(() => {
            // get users
            return User.find({ 
                $or: [
                    {
                        username: { $regex: search, $options: "i" }
                    }
                    
                ]
             })
        }).then(users => {
            // disconnect
            mongoose.disconnect()
            resolve(users)
            }).catch(err => {
                mongoose.disconnect()
                reject(err)
            })
    })
}

