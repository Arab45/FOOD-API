const {sendError, sendSuccess, generateOTP} = require('../middleware/index');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const verificationUserToken = require('../models/verificationUserToken');
const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');


const verifyUserExistence = async (req, res, next) => {
    let { loginId, password } = req.body;

    loginId = loginId.toLowerCase();


    let checkUserExistence

    try {
        if(loginId.includes('@')){
            checkUserExistence = await User.findOne({email: loginId});
            if(!checkUserExistence){
                return sendError(res, 'Invalid email address');
            };
        } else {
            checkUserExistence = await User.findOne({username: loginId});
            if(!checkUserExistence){
              return sendError(res, 'Invalide user name supply');  
            };
        }
        req.body = {loginId, password, checkUserExistence};
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify user existence, please signup.');
    }
};

const loginAttempt = async (req, res, next) => {
    const {loginId, password, checkUserExistence} = req.body;

    try {
        const hashpassword = checkUserExistence.password;
        const isPasswordCorrect = bcrypt.compareSync(password, hashpassword);
        if(!isPasswordCorrect){
            return sendError(res, 'Invalid email or password');
        };
        //return sendSuccess(res, 'successfully login', hashpassword);
        req.body = {loginId, password, checkUserExistence};
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to login, Something went wrong', 500);
    };
};

const generateToken = async (req, res, next) => {
const {loginId, password, checkUserExistence} = req.body;

const otp = generateOTP(6);
const hashotp = bcrypt.hashSync(otp);


const existingUserVToken = await verificationUserToken.findOne({owner: checkUserExistence._id});
    if(existingUserVToken){
        try {
            await verificationUserToken.findByIdAndDelete(existingUserVToken._id);
        } catch (error) {
            console.log(error);
            console.log('Unable to verify that there is no token already generate for this admin.');
            
        return sendError(res, 'Something went wrong, please try again.');
        }
    };

    const verifyUserToken = new verificationUserToken({
        owner: checkUserExistence._id,
        token: hashotp
    });

    try {
        await verifyUserToken.save();
        console.log(checkUserExistence);
        req.body = {checkUserExistence, otp};
        next();
    } catch (error) {
        console.log(error);
        console.log('Unable to verify that there is token generated for this user')
        return sendError(res, 'Unable to login, something went wrong', 500);
    }
};

const verifyLogin = async (req, res, next) => {
    const {otp} = req.body;
    const{userID} = req.params;

    if(!isValidObjectId(userID)){
        return sendError(res, 'Invalid user id, please try again');
    };

    try {
        const userToken = await verificationUserToken.findOne({owner: userID});
        if(!userToken){
            return sendError(res, 'No login detected, please try again.');
        };

        const hashotp = userToken.token;
        const isTokenCorrect = bcrypt.compareSync(otp, hashotp);
        if(!isTokenCorrect){
            return sendError(res, 'Provide a valid otp or token, please try again.')
        };

        try {
            const user = await User.findById(userID);
            req.body = {user};
            next()
        } catch (error) {
            console.log(error);
            return sendError(res, 'Invalid token provided', 500)
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify user ID, something went wrong.');
    }

};

const loginUser =  (req, res, next) => {
    const { user } = req.body;

    const loginToken = jwt.sign({userId: user._id}, 
        process.env.JWT_USER_SECRETE_KEY, {expiresIn: '1h'});

        res.cookie(String(user._id), loginToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60),
            httpOnly: true,
            Samesite: 'lax'
        });

        return sendSuccess(res, 'successfully create user login session', user);
        // req.body = {user, loginToken};
};


const verifyUserLoginToken = (req, res, next) => {
    const cookie = req.headers.cookie;

    if(!cookie){
        return sendError(res, 'No cookie found, you are not authorize to access this account.')
    };

    const token = cookie.split('=')[1];
    if(!token){
        return sendError(res, 'No session cookie found, login first');
    };


    jwt.verify(String(token), process.env.JWT_USER_SECRETE_KEY, (error, success) => {
        if(error){
            return sendError(res, 'your session can not be verify, you are not authorized.');
        };


        console.log('success id: ', success);
        req.userId = success.userId;
        next();
    })
}

module.exports = {
    verifyUserExistence,
    loginAttempt,
    generateToken,
    verifyLogin,
    loginUser,
    verifyUserLoginToken
};