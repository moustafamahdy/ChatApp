const userModel = require('../models/user.model');

exports.redirect = (req, res, next) => {
    res.redirect('/profile/' + req.session.userId);
}

exports.getProfile = (req, res, next) => {
    let id = req.params.id;
    userModel.
        getUserData(id)
        .then((data) => {
            res.render('profile', {
                pageTitle: data.username,
                isUser: req.session.userId,
                friendsRequests: req.friendsRequests,
                myId: req.session.userId,
                myName: req.session.name,
                myImage: req.session.image,
                friendId: data._id,
                username: data.username,
                userImage: data.image,
                isOwner: id === req.session.userId,
                isFriends: data.friends.find(friend => friend.id === req.session.userId),
                isRequestSent: data.friendsRequests.find(friend => friend.id === req.session.userId),
                isRequestReceived: data.sentRequests.find(friend => friend.id === req.session.userId)

            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/error');
        })
}