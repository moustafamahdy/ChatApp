const messageModel = require('../models/message.model');
const chatModel = require('../models/chat.model');
const userModel = require('../models/user.model');


exports.getChat = (req, res, next) => {
    let chatId = req.params.id


    messageModel.getMessages(chatId).then((messages) => {

        if (messages.length === 0) {
            
            chatModel.getChat(chatId).then((chat) => {
                let friendData = chat.users.find(
                    user => user._id != req.session.userId
                );
                let myData = chat.users.find(
                    user => user._id == req.session.userId
                    )
                chatModel.getAllChats().then((chats) => {
                    res.render("chat", {
                        pageTitle: friendData.username,
                        isUser: req.session.userId,
                        friendsRequests: req.friendsRequests,
                        messages: messages,
                        friendData: friendData,
                        myData: myData,
                        chatId: chatId,
                        chats: chats
                    })
                })
            });
        } else {
            // console.log(messages)

            let friendData = messages[0].chat.users.find(
                user => user._id != req.session.userId
            )
            let myData = messages[0].chat.users.find(
                user => user._id == req.session.userId
            )

            

            chatModel.getAllChats().then((chats) => {
                res.render("chat", {
                    pageTitle: friendData.username,
                    isUser: req.session.userId,
                    friendsRequests: req.friendsRequests,
                    messages: messages,
                    friendData: friendData,
                    myData: myData,
                    chatId: chatId,
                    chats: chats
                })
            })
            
        }
    })
}
        
// exports.getAllChats = (req, res, next) => {
//     let chats = chatModel.getAllChats().then((chats) => {
//         return chats
//     })
//     .catch(err => {
//         res.redirect('/error');
//     });
    
// }