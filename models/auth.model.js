const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('./user.model').User

const DB_URL = 'mongodb://localhost:27017/chat-app';

// const DB_URL = 'mongodb+srv://Moustafamahdy:Mo371997@chatapp.0ttvv.mongodb.net/?retryWrites=true&w=majority';

// const userSchema = mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
//     isAdmin: {
//         type: Boolean,
//         default: false
//     }
// });

// const User = mongoose.model('user', userSchema);

exports.createNewUser = (username, email, image, password) => {
    // check if email already exists
    // yes ===> error
    // no ===> create new accout

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL).then(() => {
            return User.findOne({email: email})
        })
        .then(user => {
            if (user) {
                mongoose.disconnect()
                reject("email is used");
            }
            else{
                return bcrypt.hash(password, 10)
            }
        })
        .then(hashedPassword => {
            let user = new User({
                username: username,
                email: email,
                image: image,
                password: hashedPassword
            })
            return user.save()
        })
        .then(() => {
            mongoose.disconnect()
            resolve("user created successfully");
        })
        .catch(err => {
            mongoose.disconnect()
            reject(err)
        });
    });
};

exports.login = (email, password) => {
    // check for email
    // no ===> error message
    // yes ===> check for password
    // no ===> error message
    // yes ===> set session


    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => User.findOne({ email: email }))
            .then((user) => {
                if (!user) {
                    mongoose.disconnect()
                    reject('there is no user matches this email')
                } else {
                    bcrypt.compare(password, user.password).then(same => {
                        if (!same) {
                            mongoose.disconnect()
                            reject('password is incorrect')
                        } else {
                            mongoose.disconnect();
                            resolve(user);
                        }
                    })
                }
            }).catch(err => {
                mongoose.disconnect()
                reject(err)
            })
    })
}

exports.getUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL)
            .then(() => {
                return User.findOne({_id: id})
            })
            .then((user) => {
                mongoose.disconnect();
                resolve(user);
            })
            .catch((err) => {
                mongoose.disconnect();
                reject(err)
            })
    })
}