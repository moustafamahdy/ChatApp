const userModel = require('../models/user.model');

exports.add = (req, res, next) => {
    userModel
        .sendFriendRequest(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
};

exports.cancel = (req, res, next) => {
    userModel
        .cancelFriendRequest(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
};

exports.accept = (req, res, next) => {
    userModel
        .acceptFriendRequest(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
};

exports.reject = (req, res, next) => {
    userModel
        .rejectFriendRequest(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
};

exports.delete = (req, res, next) => {

    userModel
        .deleteFriend(req.body)
        .then(() => {
            res.redirect('/profile/' + req.body.friendId);
        })
        .catch(err => {
            res.redirect('/error');
        });
};

exports.getFriends = (req, res, next) => {
    userModel
        .getFriends(req.session.userId)
        .then((friends) => {
            res.render('friends', {
                pageTitle: 'Friends',
                isUser: req.session.userId,
                myId: req.session.userId,
                friendsRequests: req.friendsRequests,
                friends: friends
            })
        })
        .catch(err => {
            res.redirect('/error');
        });
}