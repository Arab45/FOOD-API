const sendMail = require('../src/utils/sendMail');
const registrationEmailATemp = require('../public/main/registrationEmailTemp');
const { sendSuccess } = require('../src/middleware');
const loginOTPtemp = require('../public/main/sendLoginOTPEmail');


const sendUserEmail = async (req, res) => {
    const { newUser } = req.body;
    const email = newUser.email;
    const username = newUser.username;
    const subject = 'customer account created';
    const body = registrationEmailATemp(username);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'You have register but we can not send you a email at the moment');   
    }
    return sendSuccess(res, 'Email has been successfully send to you.', newUser);
};

const sendLoginOTPEmail = async (req, res) => {
    const { otp, checkAdminExistence } = req.body;
    const email = checkAdminExistence.email;
    const username = checkAdminExistence.username;
    const userID = checkAdminExistence._id;
    const subject = 'Verify that it is you!';
    const body = loginOTPtemp(username, otp);

    try {
    sendMail(email, subject, body);
    } catch (error) {
     console.log(error);
     return sendError(res, 'Unable to send the OTP email. Please try again.');   
    };
    return sendSuccess(res, `Login OTP has been sent to your account email - ${email}`, userID)
};

const sendAdminMail = async (req, res) => {
    const { newAdmin } = req.body;
    const email = newAdmin.email;
    const username = newAdmin.username;
    const subject = 'You are now an administrator';
    const body = registrationEmailATemp(username);

    try {
        sendMail(email, subject, body);  
    } catch (error) {
     console.log(error.message);
     return sendSuccess(res, 'You have successful register but we could not send you a mail at the moment.');   
    };
    return sendSuccess(res, 'You have successful register but we could not send you a mail at the moment.', newAdmin);
};

const adminLoginSuccessfulEmail = async (req, res) => {
    const { admin, loginToken } = req.body;
    const email = admin.email;
    const username = admin.username;
    const subject = 'You have login';
    const body = loginSuccessfulTemp(username);

    try {
    sendMail(email, subject, body);
    } catch (error) {
     console.log(error);
     return sendSuccess(res, 'You have successful login. Unable to send email notification for this action');   
    };
    return sendSuccess(res, `You have successful login`, loginToken)
};


//user email template
const userLoginSuccessfulEmail = async (req, res) => {
    const { user, loginToken } = req.body;
    const email = user.email;
    const username = user.username;
    const subject = 'You have login';
    const body = loginSuccessfulTemp(username);

    try {
    sendMail(email, subject, body);
    } catch (error) {
     console.log(error);
     return sendSuccess(res, 'You have successful login. Unable to send email notification for this action');   
    };
    return sendSuccess(res, `You have successful login`, loginToken)
};

const sendUserLoginOTPEmail = async (req, res) => {
    const { otp, checkUserExistence } = req.body;
    const email = checkUserExistence.email;
    const username = checkUserExistence.username;
    const userID = checkUserExistence._id;
    const subject = 'Verify that it is you!';
    const body = loginOTPtemp(username, otp);

    try {
    sendMail(email, subject, body);
    } catch (error) {
     console.log(error);
     return sendError(res, 'Unable to send the OTP email. Please try again.');   
    };
    return sendSuccess(res, `Login OTP has been sent to your account email - ${email}`, userID)
};

module.exports = { 
    sendUserEmail,
    sendLoginOTPEmail,
    sendAdminMail,
    adminLoginSuccessfulEmail,
    userLoginSuccessfulEmail,
    sendUserLoginOTPEmail
};