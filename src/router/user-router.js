const express = require('express');
const router = express.Router();
const {createUser} = require('../controller/user-controller');
const { sendUserEmail, sendUserLoginOTPEmail } = require('../../service/emailService');
const { validateSignup, validation } = require('../middleware/validator');
const { verifyUserExistence, loginAttempt, generateToken, verifyLogin, loginUser, verifyUserLoginToken} = require('../controller/user-auth-controller');

router.post('/create-user', validateSignup, validation, createUser, sendUserEmail);
router.post('/login-attempt', verifyUserExistence, loginAttempt, generateToken, sendUserLoginOTPEmail);
router.post('/verify-login/:userID', verifyLogin, loginUser);
router.get('/verify-login-session', verifyUserLoginToken);

module.exports = router;