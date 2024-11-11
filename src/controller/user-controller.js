const {sendError, sendSuccess} = require('../middleware/index');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res, next) => {
    const {name, email, username, password} = req.body;
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
        name,
        email,
        username,
        password: hashpassword
    });

    try {
        await newUser.save();
       // return sendSuccess(res, 'Account created successfully', newUser);

       req.body = { newUser };
       next()
    } catch (error) {
       console.log(err);
       return sendError(res, 'Something went wrong, Unabel to create User Account', 500); 
    }
};

module.exports = {
    createUser
}