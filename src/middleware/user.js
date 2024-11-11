


const checkUserExistenceSignUp = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    let emailExists, usernameExists;
    let {email, username} = req.body;

    try {
        emailExists = await User.findOne({email});
        if(emailExists) {
            return sendError(res, 'Email address already exists. Login instead')
        }
        usernameExists= await User.findOne({username}) 
        if(usernameExists){
            return sendError(res, 'Username is already choosen')
        }
    } catch (error) {
        return sendError(res, `Unable to verify account existence - ${error}`)
    }
};

module.exports = {
    checkUserExistenceSignUp
};