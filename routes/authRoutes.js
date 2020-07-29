const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const User = require('../models/user');

const userController = require('../controller/userController');

router.put('/api/signup',[
    body('email').isEmail().withMessage('please enter a valid email')
    .custom((value, {req})=>{
        return User.findOne({email: value})
            .then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email already exist');
                }
            });
    }).normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], userController.signup);

router.post('/api/login',userController.login);

module.exports = router;