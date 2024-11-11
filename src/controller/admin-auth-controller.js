const { isValidObjectId } = require('mongoose');
const { sendError, sendSuccess, generateOTP } = require('../middleware');
const Admin = require('../models/Admin');
const verificationToken = require('../models/verificationUserToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//checking username/phone/email for authenticating login
const verifyAdminExistence = async (req, res, next) => {
    let { loginID, password } = req.body;

    loginID = loginID.toLowerCase();


    let checkAdminExistence
    try {
        if(loginID.charAt(0) == 0){
             checkAdminExistence = await Admin.findOne({phone: loginID});
           if(!checkAdminExistence){
            return sendError(res, 'Invalid phone number. Signup instead.');
           }; 
        } else {
            checkAdminExistence = await Admin.findOne({username: loginID});
           if(!checkAdminExistence){
               return sendError(res, 'Invalid Username. Signup instead');
           }
        }
        req.body = {loginID, password, checkAdminExistence};
        next()
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify Admin Existence. Something went wrong.')
    }
};


//checking user password and also compare the hash password
const loginAttempt = async (req, res, next) => {
    const { loginID, password, checkAdminExistence } = req.body;

    try {
        const hashpassword = checkAdminExistence.password;
        const isPasswordCorrect = bcrypt.compareSync(password, hashpassword);
        if(!isPasswordCorrect){
            return sendError(res, 'Invalid phone number or Password')
        };
        // return sendSuccess(res, "login successfully", checkAdminExistence);
        req.body = { loginID, password, checkAdminExistence };
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to login. Something went wrong', 500);      
    }


};


//Generating OTP funtion for user login before it can be authorized
const generateVerificationToken = async (req, res, next) => {
    const {loginID, password, checkAdminExistence} = req.body;

    const otp = generateOTP(4);
    const hashToken = bcrypt.hashSync(otp);

    const existingAdminVToken = await verificationToken.findOne({owner: checkAdminExistence._id});
    if(existingAdminVToken){
        try {
            await verificationToken.findByIdAndDelete(existingAdminVToken._id);
        } catch (error) {
            console.log(error);
            console.log('Unable to verify that there is no token already generate for this admin.');
            
        return sendError(res, 'Something went wrong, please try again.');
        }
    }
    

    //Creating an instance of the user Admin verification token
    const newVerificationToken = new verificationToken({
        owner: checkAdminExistence._id,
        token: hashToken
    });

    try{
        await newVerificationToken.save()
        req.body = {checkAdminExistence, otp};
        next()
    } catch (error) {
        console.log(error);
        console.log('Unable to verify that there is token already generate for this admin.')
        return sendError(res, 'Unable to login. Something went wrong', 500);  
    }
};


//Verifying the user LOGIN with the OTP/ID
const verifyLogin = async (req, res, next) => {
    const {otp} = req.body;
    const {adminId} = req.params;

    if(!isValidObjectId(adminId)){
        return sendError(res, 'Invalid ID supplied, please try again.');
    };
    

    try {
        const adminToken = await verificationToken.findOne({owner: adminId});
        if(!adminToken){
            return sendError(res, 'No login attempt detected. Please try again');
        };

        const hashToken = adminToken.token;
        const isTokenCorrect = bcrypt.compareSync(otp, hashToken);
        if(!isTokenCorrect){
            return sendError(res, 'Please provide a valid token. Please try again');   
        };

        try {
            const admin = await Admin.findById(adminId);
            req.body = { admin };
           // return sendSuccess(res, 'Successfully confirm otp.', admin)
            next();
        } catch (error) {
            console.log(error);
            return sendError(res, 'Invalid token provided.', 500); 
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify login. Something went wrong.');
    }
};


//Authenticating the user Admin Login credentials
const loginAdminIn = (req, res, next) => {
    const { admin } = req.body;

    //Encoding the Admin payload
    const loginToken = jwt.sign({adminId: admin._id}, 
        process.env.JWT_ADMIN_SECRET, {expiresIn: '1h'});

        //Creating both server/browser cookies
        res.cookie(String(admin._id), loginToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60),
            httpOnly: true,
            sameSite: 'lax'
        });

        req.body = { admin, loginToken };
        next();
    
};


//Authorized user Admin credentials
const verifyLoginAdminToken = (req, res, next) => {
    const cookie = req.headers.cookie;

    if(!cookie){
        return sendError(res, 'No cookie found, You are not authorize to access this resource.');
    };

    const token = cookie.split('=')[1];
    if(!token){
        return sendError(res, 'No session cookie found, login first');
    };

    //Decoding Admin token
    jwt.verify(String(token), process.env.JWT_ADMIN_SECRET, (error, success) => {
        if(error){
            return sendError(res, 'Your session cannot be verified, you are not authorize to access this resource')
        };

        console.log('session created successfully', success);
        //custom rquest id
      req.adminId = success.adminId;
      next();
    })
};


//Logout funtion for Admin 
const logOut = (req, res) => {
    const cookie = req.headers.cookie;
    if(!cookie){
        return sendError(res, 'No cookie found, You are not authorize to access this resource.');
    };

    //Extracting my token from perticular admin
    const token = cookie.split('=')[1];
    if(!token){
        return sendError(res, 'No session cookie found, login first');
    };

    //Decoding my cookies
    jwt.verify(String(token), process.env.JWT_ADMIN_SECRET, (error, success) => {
        if(error){
            return sendError(res, 'Your session cannot be verified, you are not authorize to access this resource')
        };


        //clearing the cookie from my database
        res.clearCookie([`${success.adminId}`]);

        //setting the ID value to empty cokies. It also an array of available cookies
       //  res.cookies[`${success.adminId}`] = '';
        return sendError(res, 'Successfully logged out.')

         });


};


module.exports = { 
    verifyAdminExistence, 
    loginAttempt, 
    generateVerificationToken,
     verifyLogin, 
     loginAdminIn, 
     verifyLoginAdminToken,
     logOut
    };