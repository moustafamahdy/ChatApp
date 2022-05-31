const router = require('express').Router()
const bodyParser = require('body-parser')
const check = require('express-validator').check
const multer = require('multer');

const authGuard = require('./guards/auth.guard')

const authController = require('../controllers/auth.controller')

router.get('/signup',authGuard.notAuth, authController.getSignup)

router.post('/signup', authGuard.notAuth,
    bodyParser.urlencoded({ extended: true }),multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image'),
            
            check("username").not().isEmpty().withMessage('Invalid Format'),
            check("email").not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid Format'),
            check("password").not().isEmpty().withMessage('Password id required').isLength({ min:8 }).withMessage('Password must be at least 8 characters'),
            check("confirmPassword").custom((value, {req}) => {
                if (value === req.body.password) return true
                else throw 'Passwords are not the same'
            }),
            authController.postSignup)

router.get('/login', authGuard.notAuth, authController.getLogin)

router.post(
    '/login', authGuard.notAuth,
    bodyParser.urlencoded({extended: true}),
    check("email").not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid Format'),
    check("password").not().isEmpty().withMessage('Password is required').isLength({ min:8 }).withMessage('Password must be at least 8 characters'),
    authController.postLogin
)

router.all('/logout', authGuard.isAuth, authController.logout)

module.exports = router 