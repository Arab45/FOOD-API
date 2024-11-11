const Admin = require("../models/Admin");
const { sendError } = require("../utils");


const checkAdminExistenceSignUp = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    let emailExists, usernameExists;
    let {email, username} = req.body;

    try {
        emailExists = await Admin.findOne({email});
        if(emailExists) {
            return sendError(res, 'Email address already exists. Login instead')
        }
        usernameExists= await Admin.findOne({username}) 
        if(usernameExists){
            return sendError(res, 'Username is already choosen')
        }
    } catch (error) {
        return sendError(res, `Unable to verify account existence - ${error}`)
    }
};

module.exports = {
    checkAdminExistenceSignUp 
};