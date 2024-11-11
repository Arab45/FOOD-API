const {check, validationResult} = require('express-validator');
const {sendError} = require('./index');


const validateSignup = [
    check('name').trim()
    .not()
    .isEmpty()
    .withMessage('name is required'),
    check('email').trim()
    .not()
    .isEmpty()
    .withMessage('email is missing')
    .isEmail()
    .withMessage('email is not valid')
    .isLowercase(),
    check('username').trim()
    .not()
    .isEmpty()
    .withMessage('username is missing')
    .isLowercase(),
    check('password').trim()
    .not()
    .isEmpty()
    .withMessage('password is missing')
    .isLowercase()
];

const validateLogin = [
    check('loginId').trim().not().isEmpty().withMessage('Login ID is missing!'),
    check('password').trim().not().isEmpty().withMessage('Kindly provide the account password'),
  ];

const validation = (req, res, next) => {
    const error = validationResult(req).array();
    if(error.length > 0){
        console.log(error[0]);
        return sendError(res, error[0].msg);
    }
    next()
    };

    module.exports = {
        validateSignup,
        validateLogin, 
        validation
    }