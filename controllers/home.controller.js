const userModel = require('../models/user.model');

exports.getHome = (req, res, next) => {
    let search = req.query.search;
    let friendsPromise
    if (search) friendsPromise = userModel.getFriendsBySearch(search);
    else friendsPromise = userModel.getFriends(req.session.userId);
    friendsPromise.then((friends) => {
        res.render('index', {
            pageTitle: 'Home',
            isUser: req.session.userId,
            friendsRequests: req.friendsRequests,
            myId: req.session.userId,
            friends: friends
        })
    })
}