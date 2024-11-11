const Admin = require('../models/Admin');
const {sendError, sendSuccess} = require('../middleware/index');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');


const signUp = async (req, res, next) => {
    const { name, email, username, phone, password } = req.body;
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(password, salt);

    req.body.password = hashpassword;
    const newAdmin = new Admin({ ...req.body});

    try {
        await newAdmin.save();
        req.body={ newAdmin };
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to create admin profile. Something went wrong!', 500);
    }
};

const fetchAllAdmin = async (req, res) => {

    try {
       const allAdmin = await Admin.find();
       if(!allAdmin){
        return sendError(res, "Unable to fetch all blog post. Something went wrong!", 500); 
       };
       return sendSuccess(res, "Successful fetch all blog post", allAdmin);
    } catch (error) {
        console.log(error);
    return sendError(res, 'error occur. Unable to fetch all blog post.')
    }
};

const fetchAllUserOrder = async (req, res) => {
    const adminId = req.adminId;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return sendError(res, "You are not authorised.");
    };
    try {
        const adminAllOrder = await Order.find();
        return sendSuccess(res, "Successfully fetch all user order by admin", adminAllOrder)
    } catch (error) {
        return sendError(res, 'Unable to create admin profile. Something went wrong!', 500);
    }
}


    module.exports = {
        signUp,
        fetchAllAdmin,
        fetchAllUserOrder
    }
