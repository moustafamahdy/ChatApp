const express = require('express')
const path = require('path')

const session = require('express-session')
const SessionStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const socketIO = require('socket.io');


const homeRouter = require('./routes/home.route');
const authRouter = require('./routes/auth.route');
const profileRouter = require('./routes/profile.route');
const friendRouter = require('./routes/friend.route');
const chatRouter = require('./routes/chat.route');

const getFriendsRequests = require('./models/user.model').getFriendsRequests;

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

io.onlineUsers = {}

require('./sockets/friend.socket')(io);
require('./sockets/init.socket')(io);
require('./sockets/chat.socket')(io);



app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(flash())

const STORE = new SessionStore({
    uri: 'mongodb+srv://Moustafamahdy:Mo371997@chatapp.0ttvv.mongodb.net/?retryWrites=true&w=majority', //'mongodb://localhost:27017/chat-app',
    collection: 'sessions'
})

app.use(session({
    secret: 'this is my secret secret to hash express session for my online shop project sheblanga zibi manga',
    saveUninitialized: false,
    store: STORE
    // cookie: {
    //     maxAge: 
    // }
}))

app.set('view engine', 'ejs')
app.set('views', 'views') //defualt

app.use((req, res, next) => {
    if (req.session.userId) {
        getFriendsRequests(req.session.userId).then(requests => {
            req.friendsRequests = requests
            next()
        }).catch(err => res.redirect('/error'));
    } else {
        next();
    }
})

app.use('/', authRouter);
app.use('/', homeRouter);
app.use('/profile', profileRouter);
app.use('/friend', friendRouter);
app.use('/chat', chatRouter);

app.get('/error', (req, res, next) => {
    res.status(500)
    res.render('error', {
        pageTitle: "Error",
        friendsRequests: req.friendsRequests,
        isUser: req.session.userId
    })
})


app.use((req, res, next) => {
    res.status(404);
    res.render('not-found', {
        isUser: req.session.userId,
        friendsRequests: req.friendsRequests,
        pageTitle: "Page Not Found"
    })
})


const port = process.env.PORT || 3000;

server.listen(port, (err) => {
    // console.log(err)
    console.log('server listening on port ' + port);
});


// server.listen(3000, (err) => {
//     // console.log(err)
//     console.log('server listening on port 3000')
// })