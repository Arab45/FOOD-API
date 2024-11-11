const express = require('express');
const { signUp, fetchAllAdmin, fetchAllUserOrder } = require('../controller/admin-controller');
const { verifyAdminExistence, loginAttempt, generateVerificationToken, verifyLogin, loginAdminIn, verifyLoginAdminToken, logOut } = require('../controller/admin-auth-controller');
const { sendAdminMail, sendLoginOTPEmail } = require('../../service/emailService');
const { validateSignup, validateLogin, validation} = require('../middleware/validator');
const router = express.Router();

router.post('/sign-up', signUp, sendAdminMail);
router.get("/fetch-all-order-by-admin", verifyLoginAdminToken, fetchAllUserOrder);
router.get('/fetch-admin', fetchAllAdmin);
router.post('/login',  verifyAdminExistence, loginAttempt, generateVerificationToken, sendLoginOTPEmail);
router.post('/admin-loggIn/:adminId', verifyLogin, loginAdminIn);
router.get('/verify-token', verifyLoginAdminToken);
router.get('/logout', logOut);
module.exports = router;